import type { APIRoute } from 'astro';
import { setAICompareInfo } from '../../../functions-helpers/setAiCompareInfo';
import type { KvAiCompareT } from '../../shared-types';

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
const errorPrefix = 'API-NPM-COMPARE';

export const prerender = false;

export const GET: APIRoute = ({ params, locals }) => {
  try {
    const packagesStr = decodeURIComponent(params.packages as string);
    return handleRequest(packagesStr, locals.runtime.ctx, locals.runtime.env);
  } catch (error: any) {
    const msg = errorPrefix + ': ' + (error?.message || 'An error occurred!');
    console.error(msg);
    return new Response(msg, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};

async function handleRequest(
  packagesStr: string,
  ctx: Runtime['runtime']['ctx'],
  env: Runtime['runtime']['env'],
): Promise<Response> {
  const packages = packagesStr.split('_vs_');
  if (
    packages.length !== 2 ||
    packages[0].length <= 1 ||
    packages[1].length <= 1
  ) {
    console.error(`[${errorPrefix}]: Invalid packages parameter`, packagesStr);
    return new Response('Invalid packages', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  const [pkgName1, pkgName2] = packages.sort();
  const kvValue = await getKvValue(pkgName1, pkgName2, env);

  if (kvValue) {
    // check the creation date and update the value if it's older than 30 days
    const creationDate = new Date(kvValue.createdAt);
    const now = new Date();
    const diffTime = now.getTime() - creationDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays > 30) {
      ctx.waitUntil(updateKvValue(pkgName1, pkgName2, kvValue, env));
    }

    return new Response(JSON.stringify(kvValue.data), {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    });
  }

  ctx.waitUntil(setKvValue(pkgName1, pkgName2, env));

  // TODO: Cache in KV the error response for 1 hour.
  return new Response(null, {
    status: 404,
    statusText: 'Not found',
  });
}

async function getKvValue(
  pkgName1: string,
  pkgName2: string,
  env: Runtime['runtime']['env'],
): Promise<KvAiCompareT> {
  const KV_AI_COMPARE = env.AI_COMPARE_KV;
  const kvKey = `${pkgName1}_vs_${pkgName2}`;
  const kvValue = await KV_AI_COMPARE.get<KvAiCompareT>(kvKey, {
    type: 'json',
  });
  return kvValue;
}

/**
 * Update the KV value with the current creation date
 * @param pkgName1
 * @param pkgName2
 * @param kvValue
 * @param ctx
 * @returns
 */
async function updateKvValue(
  pkgName1: string,
  pkgName2: string,
  kvValue: KvAiCompareT,
  env: Runtime['runtime']['env'],
): Promise<void> {
  const KV_AI_COMPARE = env.AI_COMPARE_KV;
  const kvKey = `${pkgName1}_vs_${pkgName2}`;
  try {
    await KV_AI_COMPARE.put(
      kvKey,
      JSON.stringify({
        ...kvValue,
        createdAt: new Date().toISOString().slice(0, 10),
      }),
      { expirationTtl: 60 * 60 * 24 * 30 * 2 }, // 2 months
    );
  } catch (error) {
    console.error('Error updating KV Compare value', error);
  }
}

async function setKvValue(
  pkgName1: string,
  pkgName2: string,
  env: Runtime['runtime']['env'],
): Promise<void> {
  try {
    await setAICompareInfo(
      pkgName1,
      pkgName2,
      env.AI_COMPARE_KV,
      env.OPENAI_API_KEY,
    );
  } catch (error) {
    console.error(`[${errorPrefix}]: Error setting KV value`, error);
  }
}
