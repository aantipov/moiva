export const libs = [
  { name: 'vue', keyword: '/g/11c0vmgx5d' }, // Vue.js; type: Topic
  { name: 'react', keyword: '/m/012l1vxv' }, // Vue.js; type: Topic
  { name: '@angular/core', keyword: '/g/11c6w0ddw9' }, // Angular; type: Web framework
  { name: 'redux', keyword: '/g/11dxf0gf92' }, // Redux; type: JavaScript library
  { name: 'vuetify', keyword: 'vuetify' },
  { name: 'bootstrap', keyword: '/m/0j671ln' },
  { name: 'moment', keyword: 'moment js' },
  { name: 'lodash', keyword: 'lodash' },
  { name: 'underscore', keyword: '/m/0ndwxg_' },
  { name: 'chart.js', keyword: '/g/11fqctpc5j' },
  { name: 'd3', keyword: '/m/0k2kwt4' },
  { name: 'highcharts', keyword: '/g/11bv3xdz92' },
  { name: 'puppeteer', keyword: 'puppeteer' },
  { name: 'cypress', keyword: 'cypress' },
  { name: '@nestjs/core', keyword: 'nestjs' },
  { name: 'express', keyword: '/m/0_v2szx' },
  { name: 'ejs', keyword: 'ejs' },
  { name: 'ws', keyword: 'ws' },
];

export const libsToKeywordMap = libs.reduce((accum, lib) => {
  accum[lib.name] = lib.keyword;
  return accum;
}, {} as Record<string, string>);
