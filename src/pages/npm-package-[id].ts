import { getRuntime } from '@astrojs/cloudflare/runtime';
import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import type { APIContext } from 'astro';
import { getNpmLibraryByNpm } from '@/data/index';

export async function get({ params, request }: APIContext) {
  const npmPackage = params.id as string;
  const runtime = getRuntime(request);
  const { aiPkgDescription: aiPkgDescBinding } = runtime.env as {
    aiPkgDescription: KVNamespace;
  };
  const result = await aiPkgDescBinding.get(npmPackage);

  if (!result) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const pkg = JSON.parse(result);
  const data = {
    name: npmPackage,
    alias: getNpmLibraryByNpm(pkg)?.alias || npmPackage,
    description: pkg.description || null,
    tags: pkg.tags || null,
    alternatives: pkg.alternatives || null,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
