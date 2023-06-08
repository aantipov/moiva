interface Env {
  aiPkgDescription: KVNamespace;
}
type CTX = EventContext<Env, 'pkg', Record<string, unknown>>;
interface RawPkgInfo {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  license: string;
  version: string;
  repository: string | Record<string, unknown>;
  typings: string;
  types: string;
}

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

async function handleRequest(ctx: CTX) {
  const { pkg } = ctx.params;

  if (!pkg) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const pkgName = typeof pkg === 'string' ? pkg : pkg.join('/');
  const aiInfo = await fetchAiInfo(ctx.env.aiPkgDescription, pkgName);
  const pkgInfo = await fetchPkgInfo(pkgName);

  if (!pkgInfo) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const res = { ...pkgInfo, ai: aiInfo };

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      // 'Access-Control-Allow-Origin': '*',
      'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
    },
  });
}

async function fetchAiInfo(KV: KVNamespace, pkgName: string) {
  const result = await KV.get(pkgName);

  if (!result) {
    return null;
  }

  return JSON.parse(result);
}

/**
 * @param {Request} request
 */
async function fetchPkgInfo(pkgName: string) {
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
    license,
    version,
    repository,
    typings,
    types,
  } = (await response.json()) as RawPkgInfo;

  const result = {
    name,
    description,
    dependencies: Object.keys(dependencies),
    license,
    version,
    repository,
    hasBuiltinTypes: !!typings || !!types,
    hasOtherTypes: false,
    typesPackageName: typesPackage,
  };

  if (!result.hasBuiltinTypes) {
    const typesResponse = await typesPromise;
    if (typesResponse.ok) {
      result.hasOtherTypes = true;
    }
  }

  return result;
}
