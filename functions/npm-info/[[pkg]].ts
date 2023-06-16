import { setPkgAIInfo, KV_AI } from '../../src/setPackageAiInfo';

interface Env {
  aiPkgDescription: KVNamespace;
  OPENAI_API_KEY: string;
}
type CTX = EventContext<Env, 'pkg', Record<string, unknown>>;
interface RawPkgInfo {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  license: string;
  version: string;
  repository: string | Record<string, unknown>;
  homepage: string;
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
  const KV = ctx.env.aiPkgDescription;
  const aiInfoPromise = KV.get<KV_AI>(pkgName, { type: 'json' });
  const pkgInfo = await fetchPkgInfo(pkgName);

  if (!pkgInfo) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const aiInfo = await aiInfoPromise;
  if (!aiInfo) {
    ctx.waitUntil(setPkgAIInfo(pkgName, KV, ctx.env.OPENAI_API_KEY));
  }

  const res = { ...pkgInfo, ai: aiInfo, thisIs: 'npm-info' };

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': `max-age=0, s-maxage=${cacheTtl}`,
    },
  });
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
    homepage = '',
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
    homepage,
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
