import type { APIRoute } from 'astro';
import { AI_INFO_VERSION } from '../../../functions-helpers/fetchPackageAIInfo';
import { setPkgAIInfo } from '../../../functions-helpers/setPackageAiInfo';
import type {
  KvAiT,
  NpmJsResponseT,
  NpmInfoApiResponseT,
  KvNpmInfoT,
} from '../../shared-types';
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

const cacheTtl = 3600 * 24 * 1; // 1 day in seconds
const errorPrefix = 'API-NPM-INFO';

export const prerender = false;

export const GET: APIRoute = ({ params, locals }) => {
  try {
    return handleRequest(params.pkg, locals.runtime.ctx, locals.runtime.env);
  } catch (error: any) {
    const msg = errorPrefix + ': ' + (error?.message || 'An error occurred!');
    // TODO: report to sentry
    console.error(msg, error);
    return new Response(msg, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};

async function handleRequest(
  pkg: string | undefined,
  ctx: Runtime['runtime']['ctx'],
  env: Runtime['runtime']['env'],
): Promise<Response> {
  if (!pkg) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const pkgName = decodeURIComponent(pkg);
  const cachedValue = await getCachedValue(pkgName, env);

  // Replace `&& cachedValue.data.npm` with ZOD scheme validataion: if cache value doesn't comply with the scheme, then re-fetch
  if (
    cachedValue &&
    cachedValue.data.npm &&
    cachedValue.data.npm.publishedAt &&
    cachedValue.data.npm.createdAt &&
    Object.hasOwn(cachedValue.data.npm, 'deprecated')
  ) {
    // Update cache in the background if it's older than 1 day or if it doesn't have AI info.
    const cacheAge = Date.now() - new Date(cachedValue.createdAt).getTime();
    if (
      !cachedValue.data.ai ||
      cacheAge > 3600 * 24 * 1000 ||
      cachedValue.data.ai.version !== AI_INFO_VERSION
    ) {
      ctx.waitUntil(fetchDataAndUpdateCache(pkgName, cachedValue, env));
    }

    return new Response(JSON.stringify(cachedValue.data), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
      },
    });
  }

  const res = await fetchData(pkgName, cachedValue, env);

  // TODO: Cache in KV the error response for 1 hour.
  if (!res) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  ctx.waitUntil(updateCache(pkgName, res, env));

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
    },
  });
}

async function getCachedValue(
  pkgName: string,
  env: Runtime['runtime']['env'],
): Promise<KvNpmInfoT | null> {
  const KV_CACHE = env.CACHE_KV;
  const KV_CACHE_KEY = `npm-info-${pkgName}`;
  const cachedValue = await KV_CACHE.get<KvNpmInfoT>(KV_CACHE_KEY, {
    type: 'json',
  });
  return cachedValue;
}

async function updateCache(
  pkgName: string,
  res: NpmInfoApiResponseT,
  env: Runtime['runtime']['env'],
): Promise<void> {
  const kvAiBinding = env.aiPkgDescription;
  const kvCacheBinding = env.CACHE_KV;
  const kvCacheKey = `npm-info-${pkgName}`;
  const newKvCacheValue: KvNpmInfoT = {
    data: res,
    createdAt: new Date().toISOString(),
  };

  await Promise.all([
    kvCacheBinding.put(kvCacheKey, JSON.stringify(newKvCacheValue)),
    res.ai && res.ai.version == AI_INFO_VERSION
      ? null
      : setPkgAIInfo(pkgName, kvAiBinding, env.OPENAI_API_KEY),
  ]);
  return;
}

async function fetchDataAndUpdateCache(
  pkgName: string,
  cachedValue: KvNpmInfoT | null,
  env: Runtime['runtime']['env'],
): Promise<null> {
  try {
    const res = await fetchData(pkgName, cachedValue, env);
    if (res) {
      await updateCache(pkgName, res, env);
    }
  } catch (error) {
    console.log('error fetch and update', error);
    return null;
  }
  return null;
}

async function fetchData(
  pkgName: string,
  cachedValue: KvNpmInfoT | null,
  env: Runtime['runtime']['env'],
): Promise<NpmInfoApiResponseT | null> {
  const kvAiBinding = env.aiPkgDescription;
  const aiPromise = kvAiBinding.get<KvAiT>(pkgName, { type: 'json' });
  const npm = await fetchPkgInfo(pkgName, cachedValue?.data?.npm);

  // TODO: Cache in KV the error response for 1 hour.
  if (!npm) {
    return null;
  }

  const repo = npm.repoId ? await fetchRepoInfo(npm.repoId, env) : null;
  const ai = await aiPromise;

  return { npm, ai, repo };
}

/**
 * @param {Request} request
 */
async function fetchPkgInfo(
  pkgName: string,
  cachedNpmValue: NpmInfoApiResponseT['npm'] | undefined,
): Promise<NpmInfoApiResponseT['npm'] | null> {
  // Try fetch types package in case the package doesn't have built-in types data.
  const typesPackage = '@types/' + pkgName.replace('@', '').replace('/', '__');
  const typesPromise = fetch(
    `https://registry.npmjs.org/${encodeURIComponent(typesPackage)}/latest`,
    {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      // @ts-ignore
      cf: { cacheEverything: true, cacheTtl },
    },
  );

  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(pkgName)}/latest`,
    {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      // @ts-ignore
      cf: { cacheEverything: true, cacheTtl },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch package info');
  }

  const responseData = (await response.json()) as NpmJsResponseT;

  // TODO: instead of checking for `cachedValue.publishedAt` check for scheme (ZOD) compliance
  if (
    cachedNpmValue &&
    cachedNpmValue.version === responseData.version &&
    cachedNpmValue.publishedAt &&
    cachedNpmValue.createdAt &&
    Object.hasOwn(cachedNpmValue, 'deprecated')
  ) {
    return cachedNpmValue;
  }

  const {
    name,
    description,
    dependencies = {},
    homepage = '',
    license,
    version,
    repository,
    typings,
    types,
    deprecated,
  } = responseData;

  const dates = await fetchPkgPublishedAt(name, version);

  const result: NpmInfoApiResponseT['npm'] = {
    name,
    description,
    dependencies: Object.keys(dependencies),
    license,
    homepage,
    version,
    repository,
    hasBuiltinTypes: !!typings || !!types,
    hasOtherTypes: false,
    typesPackageName: typesPackage,
    repoId: getRepoId(repository),
    deprecated: deprecated || null,
    publishedAt: dates.publishedAt,
    createdAt: dates.createdAt,
  };

  if (!result.hasBuiltinTypes) {
    const typesResponse = await typesPromise;
    if (typesResponse.ok) {
      result.hasOtherTypes = true;
    }
  }

  return result;
}

interface ExtendedPkgDataResponseT {
  time: Record<string, string>;
}

/**
 * Fetch publishedAt and creastedAt from the npm registry if
 * @param pkgName
 * @param version
 * @returns
 */
async function fetchPkgPublishedAt(
  pkgName: string,
  version: string,
): Promise<{ publishedAt: string; createdAt: string }> {
  try {
    const extendedPkgDataResponse = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(pkgName)}/`,
      { headers: { 'content-type': 'application/json;charset=UTF-8' } },
    );
    if (!extendedPkgDataResponse.ok) {
      // TODO: report to sentry
      console.error(
        'Failed to fetch publishedAt / createdAt',
        extendedPkgDataResponse.statusText,
      );
      throw new Error('Failed to fetch publishedAt / createdAt');
    }
    const res =
      (await extendedPkgDataResponse.json()) as ExtendedPkgDataResponseT;

    return {
      publishedAt: res.time[version],
      createdAt: res.time.created,
    };
  } catch (error) {
    // TODO: report error to sentry
    console.error('Failed to fetch publishedAt / createdAt', error);
    throw new Error('Failed to fetch publishedAt / createdAt');
  }
}

async function fetchRepoInfo(
  repoId: string,
  env: Runtime['runtime']['env'],
): Promise<NpmInfoApiResponseT['repo']> {
  const url = 'https://api.github.com/graphql';
  const [owner, name] = repoId.split('/');
  const response = await fetch(url, getRepoFetchParams(name, owner, env));

  if (!response.ok) {
    throw response;
  }

  // @ts-ignore
  const { errors, data } = await response.json();

  if (errors) {
    throw { statusCode: 500, message: JSON.stringify(errors) };
  }

  const { repository } = data;

  return {
    ...repository,
    lastCommitAt: repository.lastCommitData.target.committedDate,
    openIssues: repository.openIssues.totalCount,
    openBugIssues: repository.openBugIssues.totalCount,
    closedIssues: repository.closedIssues.totalCount,
    closedBugIssues: repository.closedBugIssues.totalCount,
    repoId: `${owner}/${name}`.toLocaleLowerCase(),
    repoName: name,
  };
}

function getRepoFetchParams(
  name: string,
  owner: string,
  env: Runtime['runtime']['env'],
) {
  // 'Type: Bug' - React; 'triage: bug' - Svelte; 'type: bug/fix' - Angular; 'Bug-fix' - Moment; 'issue: bug' - Luxon
  // '☢️Bug' - Dayjs; '🐜 Bug fix' & '🐛 Bug' - date-fns; 'type: bug' - chart.js; 'P2-bug' - Playwright
  // 'type: bug :sob:' - nestjs/nest
  const bugLabels =
    'labels: ["bug", "Bug", "Type: Bug", "triage: bug", "type: bug/fix", "Bug-fix", "issue: bug", "☢️Bug", "🐜 Bug fix", "🐛 Bug", "type: bug", "P2-bug", "type: bug :sob:"]';
  const halfAYearAgo = new Date(Date.now() - 1000 * 3600 * 24 * 183);
  const since = `since: "${halfAYearAgo.toISOString()}"`;

  return {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'User-Agent': env.GITHUB_USER_AGENT,
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    },
    method: 'POST',
    cf: { cacheEverything: true, cacheTtl },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query: `
        {
          repository(name: "${name}", owner: "${owner}") {
            homepageUrl
            isArchived
            licenseInfo {
              name
              key
              url
            }
            description
            stars: stargazerCount
            createdAt
            lastCommitData: defaultBranchRef {
              target {
                ... on Commit {
                  committedDate
                }
              }
            }
            openIssues: issues(filterBy: { states: [OPEN], ${since} }) {
              totalCount
            }
            openBugIssues: issues(filterBy: { states: [OPEN], ${since}, ${bugLabels} }) {
              totalCount
            }
            closedIssues: issues(filterBy: { states: [CLOSED], ${since} }) {
              totalCount
            }
            closedBugIssues: issues(filterBy: { states: [CLOSED], ${since}, ${bugLabels} }) {
              totalCount
            }
          }
        }
      `,
    }),
  };
}

function getRepoId(repository: NpmJsResponseT['repository']): string | null {
  if (!repository) {
    return null;
  }

  const hasPackageGithub =
    repository.type === 'git' && repository.url.indexOf('github.com') !== -1;

  if (!hasPackageGithub) {
    return null;
  }

  const dotGitIndex = repository.url.indexOf('.git');
  const endRepoUrlIndex = dotGitIndex !== -1 ? dotGitIndex : 400;
  const startRepoUrlIndex = repository.url.indexOf('github.com') + 11;
  const repoId = repository.url
    .slice(startRepoUrlIndex, endRepoUrlIndex)
    .toLocaleLowerCase();

  return repoId;
}
