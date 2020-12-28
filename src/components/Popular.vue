<template>
  <div class="flex flex-col items-start sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">
      Popular comparisons by category
    </h2>

    <div v-for="item in items" :key="item.url" class="mb-2">
      <a class="text-lg" :href="makeHref(item.libs)">{{ item.name }}</a
      >:
      {{ ' ' }}
      <span class="text-base text-gray-800 sm:text-lg">{{ item.libsStr }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Popular',
  setup() {
    return {
      makeHref(libs: string[]): string {
        return '/?compare=' + libs.sort().join('+');
      },
      items: [
        {
          name: 'Frontend frameworks',
          libs: ['react', `@angular/core`, 'svelte', 'vue'],
          libsStr: 'React, Svelte, Vue, Angular',
        },
        {
          url: '/?compare=',
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
          name: 'End-to-end testing',
          libs: ['puppeteer', 'cypress', 'playwright', 'selenium-webdriver'],
          libsStr: 'Puppeteer, Cypress, Playwright, Selenium',
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
          name: 'Templating languages',
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
