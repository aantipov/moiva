import { setPkgAIInfo } from '../../functions-helpers/setPackageAiInfo';
import type {
  KvAiT,
  NpmJsResponseT,
  NpmInfoApiResponseT,
  KvNpmInfoT,
} from '../../src/shared-types';

type CTX = EventContext<Env, 'pkg', Record<string, unknown>>;
const cacheTtl = 3600 * 24 * 1; // 1 day in seconds
const errorPrefix = 'API-NPM-INFO';

export const onRequest: PagesFunction<Env, 'pkg'> = async (ctx) => {
  try {
    return await handleRequest(ctx);
  } catch (error: any) {
    const msg = errorPrefix + ': ' + (error?.message || 'An error occurred!');
    return new Response(msg, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};

async function handleRequest(ctx: CTX): Promise<Response> {
  const pkg = ctx.params.pkg as string;

  if (!pkg) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const pkgName = decodeURIComponent(pkg);
  const cachedValue = await getCachedValue(pkgName, ctx);

  // Replace `&& cachedValue.data.npm` with ZOD scheme validataion: if cache value doesn't comply with the scheme, then re-fetch
  if (
    cachedValue &&
    cachedValue.data.npm &&
    cachedValue.data.npm.publishedAt &&
    Object.hasOwn(cachedValue.data.npm, 'deprecated')
  ) {
    // Update cache in the background if it's older than 1 day or if it doesn't have AI info.
    const cacheAge = Date.now() - new Date(cachedValue.createdAt).getTime();
    if (!cachedValue.data.ai || cacheAge > 3600 * 24 * 1000) {
      ctx.waitUntil(fetchDataAndUpdateCache(pkgName, cachedValue, ctx));
    }

    return new Response(JSON.stringify(cachedValue.data), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
      },
    });
  }

  const res = await fetchData(pkgName, cachedValue, ctx);

  // TODO: Cache in KV the error response for 1 hour.
  if (!res) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  ctx.waitUntil(updateCache(pkgName, res, ctx));

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
    },
  });
}

async function getCachedValue(
  pkgName: string,
  ctx: CTX
): Promise<KvNpmInfoT | null> {
  const KV_CACHE = ctx.env.CACHE_KV;
  const KV_CACHE_KEY = `npm-info-${pkgName}`;
  const cachedValue = await KV_CACHE.get<KvNpmInfoT>(KV_CACHE_KEY, {
    type: 'json',
  });
  return cachedValue;
}

async function updateCache(
  pkgName: string,
  res: NpmInfoApiResponseT,
  ctx: CTX
) {
  const kvAiBinding = ctx.env.aiPkgDescription;
  const kvCacheBinding = ctx.env.CACHE_KV;
  const kvCacheKey = `npm-info-${pkgName}`;
  const newKvCacheValue: KvNpmInfoT = {
    data: res,
    createdAt: new Date().toISOString(),
  };

  return Promise.all([
    kvCacheBinding.put(kvCacheKey, JSON.stringify(newKvCacheValue)),
    res.ai ? null : setPkgAIInfo(pkgName, kvAiBinding, ctx.env.OPENAI_API_KEY),
  ]);
}

async function fetchDataAndUpdateCache(
  pkgName: string,
  cachedValue: KvNpmInfoT | null,
  ctx: CTX
): Promise<null> {
  const res = await fetchData(pkgName, cachedValue, ctx);
  if (res) {
    await updateCache(pkgName, res, ctx);
  }
  return null;
}

async function fetchData(
  pkgName: string,
  cachedValue: KvNpmInfoT | null,
  ctx: CTX
): Promise<NpmInfoApiResponseT | null> {
  const kvAiBinding = ctx.env.aiPkgDescription;
  const aiPromise = kvAiBinding.get<KvAiT>(pkgName, { type: 'json' });
  const npm = await fetchPkgInfo(pkgName, cachedValue?.data?.npm);

  // TODO: Cache in KV the error response for 1 hour.
  if (!npm) {
    return null;
  }
  const repo = await fetchRepoInfo(npm.repoId, ctx);
  const ai = await aiPromise;

  return { npm, ai, repo };
}

/**
 * @param {Request} request
 */
async function fetchPkgInfo(
  pkgName: string,
  cachedNpmValue: NpmInfoApiResponseT['npm'] | undefined
): Promise<NpmInfoApiResponseT['npm'] | null> {
  // Try fetch types package in case the package doesn't have built-in types data.
  const typesPackage = '@types/' + pkgName.replace('@', '').replace('/', '__');
  const typesPromise = fetch(
    `https://registry.npmjs.org/${encodeURIComponent(typesPackage)}/latest`,
    {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      cf: { cacheEverything: true, cacheTtl },
    }
  );

  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(pkgName)}/latest`,
    {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      cf: { cacheEverything: true, cacheTtl },
    }
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
    publishedAt: await fetchPkgPublishedAt(name, version),
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

// Fetch publishedAt from the npm registry if
async function fetchPkgPublishedAt(
  pkgName: string,
  version: string
): Promise<string | undefined> {
  try {
    const extendedPkgDataResponse = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(pkgName)}/`,
      { headers: { 'content-type': 'application/json;charset=UTF-8' } }
    );
    if (!extendedPkgDataResponse.ok) {
      // TODO: report to sentry
      console.error(
        'Failed to fetch publishedAt',
        extendedPkgDataResponse.statusText
      );
      return undefined;
    }
    return ((await extendedPkgDataResponse.json()) as ExtendedPkgDataResponseT)
      .time[version];
  } catch (error) {
    // TODO: report error to sentry
    console.error('Failed to fetch publishedAt', error);
    return undefined;
  }
}

async function fetchRepoInfo(repoId: string, ctx: CTX) {
  const url = 'https://api.github.com/graphql';
  const [owner, name] = repoId.split('/');
  const response = await fetch(url, getRepoFetchParams(name, owner, ctx));

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
    repoId: `${owner}/${name}`,
    repoName: name,
  };
}

function getRepoFetchParams(name: string, owner: string, ctx: CTX) {
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
      'User-Agent': ctx.env.GITHUB_USER_AGENT,
      Authorization: `Bearer ${ctx.env.GITHUB_TOKEN}`,
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

function getRepoId(repository: NpmJsResponseT['repository']): string {
  if (!repository) {
    // return null;
    throw new Error('Npm package is missing repository info');
  }

  const hasPackageGithub =
    repository.type === 'git' && repository.url.indexOf('github.com') !== -1;

  if (!hasPackageGithub) {
    // return null;
    throw new Error('Npm Package is missing proper github repository info');
  }

  const dotGitIndex = repository.url.indexOf('.git');
  const endRepoUrlIndex = dotGitIndex !== -1 ? dotGitIndex : 400;
  const startRepoUrlIndex = repository.url.indexOf('github.com') + 11;
  const repoId = repository.url.slice(startRepoUrlIndex, endRepoUrlIndex);

  return repoId;
}
