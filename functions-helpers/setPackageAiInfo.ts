import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import { fetchPkgAIAlternatives } from './fetchPackageAIAlternatives';
import { fetchPkgAIInfo } from './fetchPackageAIInfo';

export async function setPkgAIInfo(
  pkgName: string,
  KV: KVNamespace,
  openAiAPIKey: string,
) {
  const content = await fetchPkgAIInfo(pkgName, openAiAPIKey);
  const alternatives = await fetchPkgAIAlternatives(pkgName, openAiAPIKey);

  try {
    await KV.put(pkgName, JSON.stringify({ ...content, alternatives }), {
      expirationTtl: 60 * 60 * 24 * 90,
    });
  } catch (error) {
    throw new Error(`[setPkgAIInfo] KV.put failed - ${String(error)}`);
  }
  console.log(`[setPkgAIInfo] KV.put success - ${pkgName}`);
}
