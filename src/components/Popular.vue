<template>
  <div class="flex flex-col items-start sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">
      Popular comparisons by category
    </h2>

    <div v-for="item in items" :key="item.url" class="mb-2">
      <a class="text-lg" :href="item.url">{{ item.name }}</a
      >:
      {{ ' ' }}
      <span class="text-base text-gray-800 sm:text-lg">{{ item.libs }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Popular',
  data() {
    return {
      items: [
        {
          url: '/?compare=%40angular%2Fcore+react+svelte+vue',
          name: 'Frontend frameworks',
          libs: 'React, Svelte, Vue, Angular',
        },
        {
          url: '/?compare=bootstrap+bulma+tailwindcss',
          name: 'CSS frameworks',
          libs: 'Bootstrap, Tailwind CSS, Bulma',
        },
        {
          url: '/?compare=date-fns+dayjs+luxon+moment',
          name: 'Date utilities',
          libs: 'Moment.js, Day.js, Luxon, date-fns',
        },
        {
          url: '/?compare=lodash+ramda+underscore',
          name: 'Utilities',
          libs: 'Lodash, Ramda, Underscore.js',
        },
        {
          url: '/?compare=cypress+playwright+puppeteer+selenium-webdriver',
          name: 'End-to-end testing',
          libs: 'Puppeteer, Cypress, Playwright, Selenium',
        },
        {
          url: '/?compare=%40nestjs%2Fcore+fastify+koa',
          name: 'Node.js frameworks',
          libs: 'Koa, NestJS, Fastify',
        },
        {
          url: '/?compare=log4js+morgan+pino+winston',
          name: 'Node.js logging',
          libs: 'winston, morgan, log4js-node, pino',
        },
        {
          url: '/?compare=ejs+handlebars+mustache+pug',
          name: 'Templating languages',
          libs: 'EJS, Handlebars.js, Mustache.js, Pug',
        },
        {
          url: '/?compare=socket.io+ws',
          name: 'Web sockets',
          libs: 'Socket.IO, ws',
        },
      ],
    };
  },
});
</script>
