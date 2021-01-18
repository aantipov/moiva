/* eslint-disable */
fs = require('fs');

const tools = [
  {
    entity: {
      category: 'libraries',
      id: 'typescript',
      npm: 'typescript',
    },
  },
  {
    entity: {
      category: 'languages',
      id: 'reason',
      npm: null,
    },
  },
  {
    entity: {
      category: 'languages',
      id: 'elm',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'clojurescript',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'purescript',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'react',
      npm: 'react',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'vuejs',
      npm: 'vue',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'angular',
      npm: '@angular/core',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'preact',
      npm: 'preact',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'ember',
      npm: 'ember-source',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'svelte',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'alpinejs',
      npm: 'alpinejs',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'litelement',
      npm: 'lit-element',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'stimulus',
      npm: 'stimulus',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'redux',
      npm: 'redux',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'apollo',
      npm: 'apollo-client',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'graphql',
      npm: 'graphql-relay',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'mobx',
      npm: 'mobx',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'relay',
      npm: 'react-relay',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'xstate',
      npm: 'xstate',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'vuex',
      npm: 'vuex',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'express',
      npm: 'express',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'nextjs',
      npm: 'next',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'koa',
      npm: 'koa',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'meteor',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'sails',
      npm: 'sails',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'feathers',
      npm: '@feathersjs/feathers',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'nuxt',
      npm: 'nuxt',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'gatsby',
      npm: 'gatsby',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'nest',
      npm: '@nestjs/core',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'strapi',
      npm: 'strapi',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'fastify',
      npm: 'fastify',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'hapi',
      npm: '@hapi/hapi',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'jest',
      npm: 'jest',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'mocha',
      npm: 'mocha',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'storybook',
      npm: 'storybook',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'cypress',
      npm: 'cypress',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'enzyme',
      npm: 'enzyme',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'ava',
      npm: 'ava',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'jasmine',
      npm: 'jasmine',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'puppeteer',
      npm: 'puppeteer',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'testing_library',
      npm: '@testing-library/react',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'playwright',
      npm: 'playwright',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'webdriverio',
      npm: 'webdriverio',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'webpack',
      npm: 'webpack',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'parcel',
      npm: 'parcel-bundler',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'gulp',
      npm: 'gulp',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'rollup',
      npm: 'rollup',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'browserify',
      npm: 'browserify',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'typescript',
      npm: 'typescript',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'rome',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'snowpack',
      npm: 'snowpack',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'swc',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'esbuild',
      npm: 'esbuild',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'electron',
      npm: 'electron',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'reactnative',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'nativeapps',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'cordova',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'ionic',
      npm: '@ionic/core',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'nwjs',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'expo',
      npm: 'expo',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'capacitor',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'quasar',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'sass',
      npm: 'node-sass',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'less',
      npm: 'less',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'post_css',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'stylus',
      npm: 'stylus',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'bootstrap',
      npm: 'bootstrap',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'materialize_css',
      npm: 'materialize-css',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'ant_design',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'semantic_ui',
      npm: 'semantic-ui',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'bulma',
      npm: 'bulma',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'foundation',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'ui_kit',
      npm: 'uikit',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'tachyons',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'primer',
      npm: '@primer/css',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'tailwind_css',
      npm: 'tailwindcss',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'pure_css',
      npm: 'purecss',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'skeleton',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'spectre_css',
      npm: 'spectre.css',
    },
  },
  {
    entity: {
      category: 'other',
      id: 'bem',
      npm: null,
    },
  },
  {
    entity: {
      category: 'other',
      id: 'atomic_css',
      npm: null,
    },
  },
  {
    entity: {
      category: 'other',
      id: 'oocss',
      npm: null,
    },
  },
  {
    entity: {
      category: 'other',
      id: 'smacss',
      npm: null,
    },
  },
  {
    entity: {
      category: 'other',
      id: 'it_css',
      npm: null,
    },
  },
  {
    entity: {
      category: 'other',
      id: 'cube_css',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'styled_components',
      npm: 'styled-components',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'jss',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'styled_jsx',
      npm: 'styled-jsx',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'radium',
      npm: '@emotion/core',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'emotion',
      npm: 'emotion',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'css_modules',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'styled_system',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'stitches',
      npm: null,
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'styletron',
      npm: 'styletron-engine-atomic',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'fela',
      npm: 'fela',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'linaria',
      npm: 'linaria',
    },
  },
  {
    entity: {
      category: 'libraries',
      id: 'astroturf',
      npm: 'astroturf',
    },
  },
];

const toolsStr = tools
  .filter(({ entity }) => !!entity.npm)
  .sort((a, b) => {
    if (a.entity.id < b.entity.id) {
      return -1;
    }
    if (a.entity.id > b.entity.id) {
      return 1;
    }
    return 0;
  })
  .map(({ entity }) => `['${entity.id}', '${entity.npm}']`)
  .join(',\n');

const resultStr = `
const libs = [
${toolsStr}]
`;

fs.writeFile('stateofjs.config.ts', resultStr, function (err) {
  if (err) return console.log(err);
  console.log('StateOfJS config successfully written');
});
