export const frameworksTags = [
  'react',
  'preact',
  'angular',
  'vue',
  'svelte',
  'ember',
  'nodejs',
  'jQuery',
];

// Too generic tags to be used in suggestions on their own (they always need to be accompanied with more specific tags)
export const genericTags = ['markdown', 'cli-tool'];

export const tags = [
  ...frameworksTags,
  ...genericTags,
  // 3D libs
  '3D',
  'WebXR',
  'Game Engine',
  'WebGL',

  // charts
  'charts',
  'canvas',
  'svg',
  'd3',
  '3D-charts',

  // Testing mock libs, test servers
  'testing',
  'api',
  'mock',
  'http-server',
  // Lambda frameworks
  'aws-lambda',
  'serverless-framework',

  // Build tools, module bundlers
  'build-tool',
  'module-bundler',
  'dev-server',
  'esm',
  'hmr',
  'cjs',
  'umd',

  // css frameworks
  'css-framework',
  // css in js
  'css-in-js',
  // date time utilities
  'Date-time',
  // frameworks for desktop apps
  'desktop-app',
  // e2e testing, browser automation
  'browser-automation',
  // linter, formatting, beautify
  'linter',
  'formatting',

  // misc
  'ui-framework',
  'document-head-manager',
  'react-hooks',
  'immutability',
  'templating',
  'GraphQL-client',
  'maps',
  'nodejs-logging',
  'nodejs-monitoring',
  'websocket',
  'web-components',
  'pwa',
  'nodejs-process-manager',
  'schema-validation',
  'orm',
  'tooltip',
  'date-picker',
  'form',
  'runtime-types-checking',
  'types',
  'autocomplete',
  'state-management',
  'date-fetching',
  'compiler',
  'static-type-checker',
  'bdd-testing',
  'testing-framework',
  'visual-regression',
  'utils',
  'bootstrap',
  'web',
  'test-runner',
  'markdown-parser',
  'tailwindcss-components',

  // static site generators
  'static-site-generator-SSD',
  'server-side-rendering-SSR',
  'documentation',
  'blog',

  // nodejs frameworks
  'nodejs-framework',
  'realtime',
  // component libraries
  'component-library',
  'material-design',
  // fullstask frameworks
  'fullstack-framework',
  'JAMstack',
  // react native libs for android
  'runtime',
  'react-native',
  'android',

  // ui component dev tools
  'storybook',
  'playground',
  'component-explorer',
  'component-development-tool',

  // ui frameworks for building mobile apps
  'mobile',
  'ui-toolkit',
  'desktop',
  'hybrid',
  'cordova',

  // Numbers
  'bigdecimal',
  'bignumber',
  'math',
  'matrices',
  'complex-numbers',
];
