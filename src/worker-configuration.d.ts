// worker-configuration.d.ts
interface Env {
  aiPkgDescription: KVNamespace;
  CACHE_KV: KVNamespace;
  AI_COMPARE_KV: KVNamespace;
  OPENAI_API_KEY: string;
  GITHUB_TOKEN: string;
  GITHUB_USER_AGENT: string;
}
