/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string;
  readonly LOCAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
