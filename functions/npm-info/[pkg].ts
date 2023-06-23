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

  if (cachedValue) {
    // Update cache in the background if it's older than 1 day or if it doesn't have AI info.
    const cacheAge = Date.now() - new Date(cachedValue.createdAt).getTime();
    if (!cachedValue.data.ai || cacheAge > 3600 * 24 * 1000) {
      ctx.waitUntil(fetchDataAndUpdateCache(pkgName, ctx));
    }

    return new Response(JSON.stringify(cachedValue.data), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
      },
    });
  }

  const res = await fetchData(pkgName, ctx);

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

async function fetchDataAndUpdateCache(
  pkgName: string,
  ctx: CTX
): Promise<null> {
  const res = await fetchData(pkgName, ctx);
  if (res) {
    await updateCache(pkgName, res, ctx);
  }
  return null;
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

async function fetchData(
  pkgName: string,
  ctx: CTX
): Promise<NpmInfoApiResponseT | null> {
  const kvAiBinding = ctx.env.aiPkgDescription;
  const aiInfoPromise = kvAiBinding.get<KvAiT>(pkgName, { type: 'json' });
  const pkgInfo = await fetchPkgInfo(pkgName);

  // TODO: Cache in KV the error response for 1 hour.
  if (!pkgInfo) {
    return null;
  }

  const aiInfo = await aiInfoPromise;
  const res: NpmInfoApiResponseT = { ...pkgInfo, ai: aiInfo };

  return res;
}

/**
 * @param {Request} request
 */
async function fetchPkgInfo(
  pkgName: string
): Promise<Omit<NpmInfoApiResponseT, 'ai'> | null> {
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
    return null;
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
  } = (await response.json()) as NpmJsResponseT;

  const result = {
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
  };

  if (!result.hasBuiltinTypes) {
    const typesResponse = await typesPromise;
    if (typesResponse.ok) {
      result.hasOtherTypes = true;
    }
  }

  return result;
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
