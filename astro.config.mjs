import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  outDir: './dist',
  site: 'https://moiva.io/',
  integrations: [vue({ appEntrypoint: '/src/main' })],
  // vite: {
  //   resolve: { alias: { '@': '/src' } },
  // },
});
