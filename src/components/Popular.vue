<template>
  <div class="flex flex-col items-start sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">
      Popular comparisons by category
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
          libs: ['react', `@angular/core`, 'svelte', 'vue'],
          libsStr: 'React, Svelte, Vue, Angular',
        },
        {
          libs: ['bootstrap', 'tailwindcss', 'bulma'],
          name: 'CSS frameworks',
          libsStr: 'Bootstrap, Tailwind CSS, Bulma',
        },
        {
          name: 'Date utilities',
          libs: ['moment', 'dayjs', 'luxon', 'date-fns'],
          libsStr: 'Moment.js, Day.js, Luxon, date-fns',
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
          name: 'Node.js logging',
          libs: ['winston', 'morgan', 'log4js', 'pino'],
          libsStr: 'winston, morgan, log4js-node, pino',
        },
        {
          name: 'Templating engines',
          libs: ['ejs', 'handlebars', 'mustache', 'pug'],
          libsStr: 'EJS, Handlebars.js, Mustache.js, Pug',
        },
        {
          name: 'Web sockets',
          libs: ['socket.io', 'ws'],
          libsStr: 'Socket.IO, ws',
        },
      ],
    };
  },
});
</script>
