import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  outDir: './dist',
  site: 'https://moiva.io/',
  integrations: [vue({ appEntrypoint: '/src/main' }), tailwind()],
  // vite: {
  //   resolve: { alias: { '@': '/src' } },
  // },
});
