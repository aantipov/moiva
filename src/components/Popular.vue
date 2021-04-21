<template>
  <div class="flex flex-col items-start mx-2 sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">
      Popular UI libraries comparisons
    </h2>

    <div v-for="item in items" :key="item.name" class="mb-2">
      <a
        class="text-lg"
        :href="makeHref(item.libs)"
        @click.prevent="$emit('select', item.libs)"
        >{{ item.name }}</a
      >:
      {{ ' ' }}
      <span class="text-base text-black text-opacity-80 sm:text-lg">{{
        item.libsStr
      }}</span>
    </div>

    <div class="mt-4 font-light">
      Check out our <a href="/catalog">Catalog</a> for inspiration.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { constructHref } from '@/utils';

export default defineComponent({
  name: 'Popular',
  emits: ['select'],
  setup() {
    return {
      makeHref(libs: string[]): string {
        return constructHref(libs, []);
      },
      items: [
        {
          name: 'Frontend frameworks',
          libs: ['react', 'svelte', 'vue'],
          libsStr: 'React, Svelte, Vue',
        },
        {
          name: 'State Management',
          libs: ['redux', 'mobx', 'xstate'],
          libsStr: 'Redux, MobX, Xstate',
        },
        {
          libs: ['bootstrap', 'tailwindcss', 'bulma'],
          name: 'CSS frameworks',
          libsStr: 'Bootstrap, Tailwind CSS, Bulma',
        },
        {
          name: 'Date utilities',
          libs: ['moment', 'dayjs', 'date-fns'],
          libsStr: 'Moment.js, Day.js, date-fns',
        },
        {
          name: 'Utilities',
          libs: ['lodash', 'ramda', 'underscore'],
          libsStr: 'Lodash, Ramda, Underscore.js',
        },
        {
          name: 'Charts',
          libs: ['chart.js', 'd3', 'highcharts'],
          libsStr: 'Chart.js, D3, Highcharts',
        },
        {
          name: 'End-to-end testing',
          libs: ['puppeteer', 'cypress', 'playwright'],
          libsStr: 'Puppeteer, Cypress, Playwright',
        },
        {
          name: 'Node.js frameworks',
          libs: ['koa', '@nestjs/core', 'fastify'],
          libsStr: 'Koa, NestJS, Fastify',
        },
        {
          name: 'Build Tools and Module Bundlers',
          libs: ['webpack', 'snowpack', 'vite'],
          libsStr: 'Webpack, Snowpack, Vite',
        },
        {
          name: 'Static Sites Generators',
          libs: ['next', 'gatsby', 'nuxt'],
          libsStr: 'Next.js, Gatsby, Nuxt.js',
        },
        {
          name: 'Testing Frameworks',
          libs: ['jest', 'ava', 'jasmine'],
          libsStr: 'Jest, Ava, Jasmine',
        },
      ],
    };
  },
});
</script>
