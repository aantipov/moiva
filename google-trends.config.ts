export const libs = [
  { name: 'vue', keyword: '/g/11c0vmgx5d' }, // Vue.js; type: Topic
  { name: 'react', keyword: '/m/012l1vxv' }, // Vue.js; type: Topic
  { name: 'svelte', keyword: 'Svelte' },
  { name: '@angular/core', keyword: '/g/11c6w0ddw9' }, // Angular; type: Web framework
  { name: 'ember-source', keyword: '/m/0s8wr70' }, // Ember.js; type: Topic
  { name: 'redux', keyword: '/g/11dxf0gf92' }, // Redux; type: JavaScript library
  { name: 'recoil', keyword: '/m/01dyp7' }, // Recoil; type: Topic
  { name: 'xstate', keyword: 'xstate' },
  { name: '@testing-library/react', keyword: 'react testing library' },
  { name: 'enzyme', keyword: '/m/02jgw' }, // Enzyme; type: Topic
  { name: 'vuetify', keyword: 'vuetify' },
  { name: 'quasar', keyword: 'quasar framework' },
  { name: 'bootstrap-vue', keyword: 'bootstrap-vue' },
  { name: 'element-ui', keyword: 'element vue' },
];

export const libsToKeywordMap = libs.reduce((accum, lib) => {
  accum[lib.name] = lib.keyword;
  return accum;
}, {} as Record<string, string>);
