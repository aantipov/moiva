/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string;
  readonly GITHUB_USER_AGENT: string;
  readonly GITHUB_TOKEN: string;
  readonly LOCAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
