/* eslint-disable */
fs = require('fs');

const urls = [
  ['@amcharts/amcharts4'],
  ['@angular/core'],
  ['@chakra-ui/react'],
  ['@cucumber/cucumber'],
  ['@feathersjs/feathers'],
  ['@hapi/hapi'],
  ['@material-ui/core'],
  ['@nestjs/core'],
  ['@nivo/core'],
  ['@parcel/core'],
  ['@loopback/core'],

  ['alpinejs'],
  ['antd'],
  ['apexcharts'],
  ['apisauce'],
  ['async'],
  ['axios'],
  ['backbone.marionette'],
  ['bluebird'],
  ['blueimp-tmpl'],
  ['bootstrap'],
  ['bootstrap-vue'],
  ['browserify'],
  ['bulma'],
  ['bunyan'],

  ['casperjs'],
  ['chai'],
  ['chart.js'],
  ['chartist'],
  ['commander'],
  ['classnames'],
  ['cheerio'],
  ['core-js'],
  ['cypress'],
  ['date-fns'],
  ['d3'],
  ['dayjs'],
  ['date.js'],
  ['debug'],
  ['dot'],
  ['downshift'],
  ['dustjs-linkedin'],
  ['echarts'],
  ['ehtml'],
  ['ejs'],
  ['element-ui'],
  ['ember-source'],
  ['eslint'],
  ['express'],
  ['fastify'],
  ['fecha'],
  ['forever'],
  ['fp-ts'],
  ['gatsby'],
  ['grunt'],
  ['gulp'],

  ['handlebars'],
  ['highcharts'],
  ['hyperapp'],
  ['immer'],
  ['inferno'],
  ['inquirer'],
  ['jasmine'],
  ['jest'],
  ['jshint'],
  ['jquery'],
  ['quasar'],
  ['karma'],
  ['knockout'],
  ['koa'],
  ['lazy.js'],
  ['less'],
  ['lodash'],
  ['log4js'],
  ['loglevel'],
  ['loopback'],
  ['luxon'],
  ['marko'],
  ['materialize-css'],
  ['mkdirp'],
  ['mobx'],
  ['mocha'],
  ['moment'],
  ['morgan'],
  ['mout'],
  ['ms'],
  ['mustache'],

  ['next'],
  ['nightmare'],
  ['nightwatch'],
  ['next'],
  ['node-fetch'],
  ['nodemon'],
  ['nunjucks'],
  ['nuxt'],
  ['passport'],
  ['pino'],
  ['prettier'],
  ['prop-types'],
  ['pm2'],
  ['playwright'],
  ['plotly.js'],
  ['primevue'],
  ['pug'],
  ['puppeteer'],

  ['radium'],
  ['ramda'],
  ['rambda'],
  ['react'],
  ['react-autosuggest'],
  ['react-bootstrap'],
  ['react-chartjs-2'],
  ['react-datepicker'],
  ['react-date-picker'],
  ['react-dates'],
  ['react-day-picker'],
  ['react-router'],
  ['react-select'],
  ['react-vis'],
  ['reactstrap'],
  ['recharts'],
  ['recoil'],
  ['redux'],
  ['restify'],
  ['rollup'],
  ['rxjs'],
  ['sails'],
  ['semantic-ui'],
  ['sanctuary'],
  ['sass'],
  ['selenium-webdriver'],
  ['slimerjs'],
  ['socket.io'],
  ['svelte'],
  ['sugar'],
  ['superagent'],

  ['taiko'],
  ['tailwindcss'],
  ['tachyons'],
  ['testcafe'],
  ['timeago.js'],
  ['tslint'],
  ['underscore'],
  ['universal-router'],
  ['uuid'],
  ['victory'],
  ['vue'],
  ['vuetify'],
  ['vuex'],
  ['vue-material'],
  ['xtemplate'],
  ['webdriverio'],
  ['webpack'],
  ['winston'],
  ['ws'],
  ['yargs'],
  ['zombie'],

  ['@angular/core', 'angular'],
  ['@angular/core', 'jquery', 'react'],
  ['@angular/core', 'react'],
  ['@angular/core', 'react', 'svelte'],
  ['@angular/core', 'react', 'svelte', 'vue'],
  ['@angular/core', 'react', 'vue'],
  ['@angular/core', 'svelte'],
  ['@angular/core', 'svelte', 'vue'],
  ['@angular/core', 'vue'],
  ['@cucumber/cucumber', 'cypress'],
  ['@emotion/css', 'styled-components'],
  ['@hapi/hapi', '@nestjs/core'],
  ['@hapi/hapi', 'express'],
  ['@hapi/hapi', 'fastify'],
  ['@hapi/hapi', 'koa'],
  ['@material-ui/core', 'antd'],
  ['@material-ui/core', 'bootstrap'],
  ['@material-ui/core', 'bulma'],
  ['@material-ui/core', 'materialize-css'],
  ['@material-ui/core', 'react-bootstrap'],
  ['@material-ui/core', 'semantic-ui'],
  ['@material-ui/core', 'styled-components'],
  ['@material-ui/core', 'tailwindcss'],
  ['@material-ui/core', 'vuetify'],
  ['@nestjs/core', 'express'],
  ['@nestjs/core', 'fastify'],
  ['@nivo/core', 'recharts'],
  ['@parcel/core', 'webpack'],

  ['antd', 'react-bootstrap'],
  ['apexcharts', 'd3'],
  ['apisauce', 'axios'],
  ['axios', 'node-fetch'],
  ['axios', 'request'],
  ['axios', 'superagent'],
  ['bootstrap-vue', 'vuetify'],
  ['buefy', 'vuetify'],
  ['bulma', 'tailwindcss'],
  ['bulma', 'tailwindcss', 'vuetify'],
  ['bulma', 'vuetify'],
  ['bunyan', 'log4js'],
  ['bunyan', 'morgan'],
  ['bunyan', 'pino'],
  ['bunyan', 'winston'],

  ['chai', 'mocha'],
  ['chart.js', 'd3'],
  ['chart.js', 'highcharts'],
  ['chart.js', 'plotly.js'],
  ['chart.js', 'recharts'],
  ['commander', 'yargs'],
  ['commander', 'inquirer'],
  ['cypress', 'jest'],
  ['cypress', 'karma'],
  ['cypress', 'nightwatch'],
  ['cypress', 'playwright'],
  ['cypress', 'puppeteer'],
  ['cypress', 'selenium-webdriver'],
  ['cypress', 'protractor'],
  ['cypress', 'testcafe'],
  ['cypress', 'webdriverio'],

  ['d3', 'highcharts'],
  ['d3', 'plotly.js'],
  ['date-fns', 'dayjs'],
  ['date-fns', 'moment'],
  ['date-fns', 'luxon'],
  ['dayjs', 'luxon'],
  ['dayjs', 'moment'],
  ['downshift', 'react-select'],
  ['downshift', 'react-autosuggest'],
  ['ejs', 'pug'],
  ['ejs', 'handlebars'],
  ['eslint', 'jshint'],
  ['eslint', 'prettier'],
  ['eslint', 'tslint'],
  ['express', 'fastify'],
  ['express', 'koa'],
  ['express', 'next'],
  ['fastify', 'koa'],
  ['fastify', 'restify'],
  ['forever', 'pm2'],
  ['fp-ts', 'ramda'],
  ['gatsby', 'next'],
  ['gatsby', 'nuxt'],
  ['gulp'],

  ['handlebars', 'pug'],
  ['handlebars', 'mustache'],
  ['highcharts', 'plotly.js'],
  ['immer', 'ramda'],
  ['inquirer', 'yargs'],
  ['jasmine', 'karma'],
  ['jasmine', 'mocha'],
  ['jasmine', 'jest'],
  ['jest', 'mocha'],
  ['jest', 'karma'],
  ['jquery', 'react'],
  ['jquery', 'lodash'],
  ['jquery', 'vue'],
  ['js-beautify', 'prettier'],
  ['jss', 'styled-components'],
  ['quasar', 'vuetify'],
  ['karma', 'mocha'],
  ['less', 'sass'],
  ['lodash', 'ramda'],
  ['lodash', 'underscore'],
  ['log4js', 'morgan'],
  ['log4js', 'pino'],
  ['log4js', 'winston'],
  ['luxon', 'moment'],

  ['mobx', 'recoil'],
  ['mobx', 'redux'],
  ['mobx', 'rxjs'],
  ['mobx', 'vuex'],
  ['morgan', 'winston'],
  ['next', 'nuxt'],
  ['nodemon', 'pm2'],
  ['pino', 'winston'],
  ['preact', 'react'],
  ['primevue', 'vuetify'],

  ['radium', 'styled-components'],
  ['ramda', 'rxjs'],
  ['ramda', 'sanctuary'],
  ['react', 'svelte'],
  ['react', 'svelte', 'vue'],
  ['react', 'vue'],
  ['react-autosuggest', 'react-select'],
  ['react-bootstrap', 'reactstrap'],
  ['react-bootstrap', 'semantic-ui'],
  ['react-chartjs-2', 'recharts'],
  ['react-date-picker', 'react-datepicker'],
  ['react-dates', 'react-day-picker'],
  ['react-datepicker', 'react-dates'],
  ['react-router', 'universal-router'],
  ['react-select', 'select2'],
  ['react-vis', 'recharts'],
  ['recharts', 'victory'],
  ['redux', 'vuex'],
  ['recoil', 'redux'],
  ['redux', 'rxjs'],
  ['riot'],
  ['rollup', 'webpack'],
  ['socket.io', 'ws'],
  ['styled-components', 'styled-jsx'],
  ['styled-components', 'tailwindcss'],
  ['svelte', 'vue'],
  ['tailwindcss', 'vuetify'],
  ['vue-material', 'vuetify'],
];

const urlsStr = urls.sort().reduce((acc, url) => {
  return (
    acc +
    `  <url>
    <loc>https://moiva.io/?compare=${url.join('+')}</loc>
    <lastmod>2021-01-02</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`
  );
}, '');

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moiva.io/</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${urlsStr}</urlset>
`;

fs.writeFile('public/sitemap.xml', content, function (err) {
  if (err) return console.log(err);
  console.log('Sitemap generated successfully');
});
