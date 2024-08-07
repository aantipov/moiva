import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  outDir: './dist',
  site: 'https://moiva.io/',
  integrations: [vue({ appEntrypoint: '/src/main' }), tailwind()],
  build: { inlineStylesheets: 'auto' },
  vite: {
    // build: { minify: false },
    //   resolve: { alias: { '@': '/src' } },
    ssr: { external: ['node:buffer'], noExternal: ['path-to-regexp'] },
  },
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
