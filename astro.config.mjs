import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  outDir: './dist',
  site: 'https://moiva.io/',
  integrations: [vue({ appEntrypoint: '/src/main' }), tailwind()],
  experimental: { inlineStylesheets: 'auto' },
  // vite: {
  // build: { minify: false },
  //   resolve: { alias: { '@': '/src' } },
  // },
  output: 'server',
  adapter: cloudflare({ mode: 'directory' }),
});
