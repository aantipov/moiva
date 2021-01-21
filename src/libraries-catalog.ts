const libraries = [
  // Frontend Frameworks 
  ['react', 'Frontend Frameworks', 'null', 'null'],
  ['vue', 'Frontend Frameworks', 'null', 'null'],
  ['@angular/core', 'Frontend Frameworks', 'angular', 'null'],
  ['svelte', 'Frontend Frameworks', 'null', 'null'],
  ['ember-source', 'Frontend Frameworks', 'Ember', 'null'],
  ['alpinejs', 'Frontend Frameworks', 'null', 'null'],
  ['inferno', 'Frontend Frameworks', 'null', 'null'],
  ['preact', 'Frontend Frameworks', 'null', 'null'],
  ['hyperapp', 'Frontend Frameworks', 'null', 'null'],
  ['riot', 'Frontend Frameworks', 'null', 'null'],
  ['angular', 'Frontend Frameworks', 'AngularJS', 'null'],
  ['backbone.marionette', 'Frontend Frameworks', 'null', 'null'],
  ['knockout', 'Frontend Frameworks', 'null', 'null'],
  ['solid-js', 'Frontend Frameworks', 'solid', 'null'],

  // HTML Templating Engines 
  ['ejs', 'HTML Templating Engines', 'null', 'null'],
  ['handlebars', 'HTML Templating Engines', 'null', 'null'],
  ['mustache', 'HTML Templating Engines', 'null', 'null'],
  ['pug', 'HTML Templating Engines', 'null', 'null'],
  ['nunjucks', 'HTML Templating Engines', 'null', 'null'],
  ['marko', 'HTML Templating Engines', 'null', 'null'],
  ['blueimp-tmpl', 'HTML Templating Engines', 'null', 'null'],
  ['dot', 'HTML Templating Engines', 'null', 'null'],
  ['xtemplate', 'HTML Templating Engines', 'null', 'null'],
  ['dustjs-linkedin', 'HTML Templating Engines', 'Dust.js', 'null'],
  ['ehtml', 'HTML Templating Engines', 'null', 'null'],

  // Date Utilities 
  ['date-fns', 'Date Utilities', 'null', 'null'],
  ['dayjs', 'Date Utilities', 'null', 'null'],
  ['luxon', 'Date Utilities', 'null', 'null'],
  ['moment', 'Date Utilities', 'null', 'null'],
  ['fecha', 'Date Utilities', 'null', 'null'],
  ['ms', 'Date Utilities', 'null', 'null'],
  ['timeago.js', 'Date Utilities', 'null', 'null'],
  ['date.js', 'Date Utilities', 'null', 'null'],

  // Utilities 
  ['lodash', 'Utilities', 'null', 'null'],
  ['ramda', 'Utilities', 'null', 'null'],
  ['underscore', 'Utilities', 'null', 'null'],
  ['rambda', 'Utilities', 'null', 'null'],
  ['mout', 'Utilities', 'null', 'null'],
  ['sugar', 'Utilities', 'null', 'null'],
  ['lazy.js', 'Utilities', 'null', 'null'],

  // e2e testing 
  ['puppeteer', 'e2e testing', 'null', 'null'],
  ['cypress', 'e2e testing', 'null', 'null'],
  ['playwright', 'e2e testing', 'null', 'null'],
  ['selenium-webdriver', 'e2e testing', 'null', 'null'],
  ['webdriverio', 'e2e testing', 'null', 'null'],
  ['testcafe', 'e2e testing', 'null', 'null'],
  ['nightwatch', 'e2e testing', 'null', 'null'],
  ['taiko', 'e2e testing', 'null', 'null'],
  ['nightmare', 'e2e testing', 'null', 'null'],
  ['casperjs', 'e2e testing', 'null', 'null'],
  ['slimerjs', 'e2e testing', 'null', 'null'],
  ['zombie', 'e2e testing', 'null', 'null'],

  // Web Sockets 
  ['socket.io', 'Web Sockets', 'null', 'null'],
  ['ws', 'Web Sockets', 'null', 'null'],

  // NodeJS Frameworks 
  ['express', 'NodeJS Frameworks', 'null', 'null'],
  ['@nestjs/core', 'NodeJS Frameworks', 'NestJS', 'null'],
  ['koa', 'NodeJS Frameworks', 'null', 'null'],
  ['fastify', 'NodeJS Frameworks', 'null', 'null'],
  ['@hapi/hapi', 'NodeJS Frameworks', 'Hapi', 'null'],
  ['sails', 'NodeJS Frameworks', 'null', 'null'],
  ['restify', 'NodeJS Frameworks', 'null', 'null'],
  ['@feathersjs/feathers', 'NodeJS Frameworks', 'Feathers', 'null'],
  ['loopback', 'NodeJS Frameworks', 'LoopBack 3', 'null'],
  ['@loopback/core', 'NodeJS Frameworks', 'LoopBack 4', 'null'],

  // NodeJS Logging 
  ['log4js', 'NodeJS Logging', 'null', 'null'],
  ['pino', 'NodeJS Logging', 'null', 'null'],
  ['winston', 'NodeJS Logging', 'null', 'null'],
  ['morgan', 'NodeJS Logging', 'null', 'null'],
  ['loglevel', 'NodeJS Logging', 'null', 'null'],
  ['bunyan', 'NodeJS Logging', 'null', 'null'],

  // CSS Frameworks 
  ['bootstrap', 'CSS Frameworks', 'null', 'null'],
  ['bulma', 'CSS Frameworks', 'null', 'null'],
  ['tailwindcss', 'CSS Frameworks', 'null', 'null'],
  ['tachyons', 'CSS Frameworks', 'null', 'null'],
  ['materialize-css', 'CSS Frameworks', 'null', 'null'],

  // Charts 
  ['chart.js', 'Charts', 'null', 'null'],
  ['d3', 'Charts', 'null', 'null'],
  ['plotly.js', 'Charts', 'null', 'null'],
  ['highcharts', 'Charts', 'null', 'null'],
  ['recharts', 'Charts', 'null', 'null'],
  ['echarts', 'Charts', 'null', 'null'],
  ['@amcharts/amcharts4', 'Charts', 'amCharts 4', 'null'],
  ['apexcharts', 'Charts', 'null', 'null'],
  ['chartist', 'Charts', 'null', 'null'],
  ['vis', 'Charts', 'null', 'null'],
  ['nvd3', 'Charts', 'null', 'null'],
  ['amcharts3', 'Charts', 'amCharts 3', 'null'],
  ['peity', 'Charts', 'null', 'null'],

  // Vue Component Libraries 
  ['vuetify', 'Vue Component Libraries', 'null', 'null'],
  ['quasar', 'Vue Component Libraries', 'null', 'null'],
  ['bootstrap-vue', 'Vue Component Libraries', 'BootstrapVue', 'null'],
  ['primevue', 'Vue Component Libraries', 'null', 'null'],
  ['vue-material', 'Vue Component Libraries', 'Vue Material', 'null'],
  ['element-ui', 'Vue Component Libraries', 'Element UI', 'null'],

  // React Component Libraries 
  ['@material-ui/core', 'React Component Libraries', 'Material-UI', 'null'],
  ['antd', 'React Component Libraries', 'Ant Design', 'null'],
  ['react-bootstrap', 'React Component Libraries', 'React Bootstrap', 'null'],
  ['semantic-ui', 'React Component Libraries', 'Semantic UI', 'null'],
  ['@chakra-ui/react', 'React Component Libraries', 'Chakra UI', 'null'],
  ['reactstrap', 'React Component Libraries', 'null', 'null'],

  // State Management 
  ['mobx', 'State Management', 'MobX', 'null'],
  ['rxjs', 'State Management', 'RxJS', 'null'],
  ['recoil', 'State Management', 'null', 'null'],
  ['vuex', 'State Management', 'null', 'vue'],

  // Api Mocks 
  ['msw', 'Api Mocks', 'MSW', 'null'],
  ['mountebank', 'Api Mocks', 'null', 'null'],

  // AWS Lambda frameworks 
  ['@middy/core', 'AWS Lambda frameworks', 'Middy', 'null'],
  ['@laconia/core', 'AWS Lambda frameworks', 'Laconia', 'null'],
  ['vandium', 'AWS Lambda frameworks', 'null', 'null'],

  // Web Components 
  ['@stencil/core', 'Web Components', 'Stencil', 'null'],
  ['lit-element', 'Web Components', 'LitElement', 'null'],

  // Visual Regression 
  ['backstopjs', 'Visual Regression', 'BackstopJS', 'null'],
  ['loki', 'Visual Regression', 'null', 'null'],
  ['gemini', 'Visual Regression', 'null', 'null'],

  // Static Site Generators / JAMStack 
  ['gatsby', 'Static Site Generators / JAMStack', 'null', 'react'],
  ['next', 'Static Site Generators / JAMStack', 'Next.js', 'react'],
  ['nuxt', 'Static Site Generators / JAMStack', 'Nuxt.js', 'vue'],
  ['sapper', 'Static Site Generators / JAMStack', 'null', 'svelte'],
  ['@11ty/eleventy', 'Static Site Generators / JAMStack', '11ty', 'null'],
  ['hexo', 'Static Site Generators / JAMStack', 'null', 'null'],
  ['docusaurus', 'Static Site Generators / JAMStack', 'null', 'react'],
  ['@docusaurus/core', 'Static Site Generators / JAMStack', 'Docusaurus 2', 'react'],
  ['vuepress', 'Static Site Generators / JAMStack', 'VuePress', 'vue'],
  ['docsify', 'Static Site Generators / JAMStack', 'null', 'null'],
  ['umi', 'Static Site Generators / JAMStack', 'UmiJS', 'react'],
  ['react-static', 'Static Site Generators / JAMStack', 'React Static', 'react'],
  ['gridsome', 'Static Site Generators / JAMStack', 'null', 'vue'],

  // Object Schema Validation 
  ['joi', 'Object Schema Validation', 'null', 'null'],
  ['ajv', 'Object Schema Validation', 'null', 'null'],
  ['yup', 'Object Schema Validation', 'null', 'null'],

  // Immutability 
  ['immer', 'Immutability', 'null', 'null'],
  ['immutable', 'Immutability', 'Immutable.js', 'null'],

  // Runtime Types Checks 
  ['io-ts', 'Runtime Types Checks', 'null', 'null'],
  ['runtypes', 'Runtime Types Checks', 'null', 'null'],

  // React Native Android 
  ['hermes-engine', 'React Native Android', 'Hermes', 'null'],
  ['jsc-android', 'React Native Android', 'null', 'null'],
  ['react-native-v8', 'React Native Android', 'null', 'null'],

  // GraphQL clients 
  ['relay-runtime', 'GraphQL clients', 'Relay', 'react'],
  ['@apollo/client', 'GraphQL clients', 'Apollo Client', 'react'],
  ['apollo-client', 'GraphQL clients', 'null', 'react'],
  ['vue-apollo', 'GraphQL clients', 'Vue Apollo', 'vue'],
  ['svelte-apollo', 'GraphQL clients', 'null', 'svelte'],
  ['ember-apollo-client', 'GraphQL clients', 'null', 'ember'],
  ['apollo-angular', 'GraphQL clients', 'null', 'Apollo Angular'],

  // React Forms 
  ['formik', 'React Forms', 'null', 'null'],
  ['react-hook-form', 'React Forms', 'React Hook Form', 'null'],
  ['redux-form', 'React Forms', 'Redux Form', 'null'],
  ['final-form', 'React Forms', 'React Final Form', 'null'],

  // Static Types Checking 
  ['typescript', 'Static Types Checking', 'null', 'null'],
  ['flow-bin', 'Static Types Checking', 'Flow', 'null'],

  // React Unit Testing 
  ['enzyme', 'React Unit Testing', 'null', 'null'],
  ['@testing-library/react', 'React Unit Testing', 'React Testing Library', 'null'],

  // Lint Prettify 
  ['eslint', 'Lint Prettify', 'ESLint', 'null'],
  ['tslint', 'Lint Prettify', 'TSLint', 'null'],
  ['prettier', 'Lint Prettify', 'null', 'null'],
  ['jshint', 'Lint Prettify', 'JSHint', 'null'],
  ['js-beautify', 'Lint Prettify', 'JS Beautifier', 'null'],

  // CSS-IN-JS 
  ['styled-jsx', 'CSS-IN-JS', 'null', 'react'],
  ['styled-components', 'CSS-IN-JS', 'null', 'react'],
  ['radium', 'CSS-IN-JS', 'null', 'react'],
  ['@emotion/react', 'CSS-IN-JS', 'null', 'react'],
  ['@linaria/core', 'CSS-IN-JS', 'Linaria', 'react'],
  ['jss', 'CSS-IN-JS', 'JSS', 'null'],
  ['aphrodite', 'CSS-IN-JS', 'null', 'null'],
  ['@emotion/css', 'CSS-IN-JS', 'Emotion', 'null'],

  // Node Monitoring 
  ['prom-client', 'Node Monitoring', 'Prometheus client', 'null'],
  ['express-status-monitor', 'Node Monitoring', 'null', 'null'],
  ['clinic', 'Node Monitoring', 'Clinic.js', 'null'],
  ['appmetrics-dash', 'Node Monitoring', 'null', 'null'],

  // 3D 
  ['babylonjs', '3D', 'Babylon.js', 'null'],
  ['three', '3D', 'Three.js', 'null'],

  // Unit Tests Runner 
  ['jest', 'Unit Tests Runner', 'null', 'null'],
  ['ava', 'Unit Tests Runner', 'null', 'null'],

  // ui dev environment 
  ['@storybook/core', 'ui dev environment', 'Storybook', 'null'],
  ['react-styleguidist', 'ui dev environment', 'React Styleguidist', 'react'],

  // Build Tools 
  ['webpack', 'Build Tools', 'null', 'null'],
  ['rollup', 'Build Tools', 'null', 'null'],
  ['@parcel/core', 'Build Tools', 'Parcel.js', 'null'],
  ['parcel', 'Build Tools', 'null', 'null'],
  ['snowpack', 'Build Tools', 'null', 'null'],
  ['esbuild', 'Build Tools', 'null', 'null'],

  // Node Runners 
  ['forever', 'Node Runners', 'null', 'null'],
  ['pm2', 'Node Runners', 'null', 'null'],
  ['nodemon', 'Node Runners', 'null', 'null'],

  // Select Box 
  ['downshift', 'Select Box', 'null', 'react'],
  ['react-select', 'Select Box', 'React Select', 'react'],
  ['select2', 'Select Box', 'null', 'null'],
  ['react-autosuggest', 'Select Box', 'React Autosuggest', 'react'],
  ['react-autocomplete', 'Select Box', 'React Autocomplete', 'react'],
  ['react-virtualized-select', 'Select Box', 'React Virtualized Select', 'react'],
  ['react-dropdown', 'Select Box', 'null', 'react'],

  // React Dates 
  ['react-datepicker', 'React Dates', 'null', 'null'],
  ['react-date-picker', 'React Dates', 'null', 'null'],
  ['react-dates', 'React Dates', 'null', 'null'],
  ['react-datetime', 'React Dates', 'null', 'null'],
  ['react-day-picker', 'React Dates', 'null', 'null'],
  ['react-calendar', 'React Dates', 'null', 'null'],

  // misc 
  ['@cucumber/cucumber', 'misc', 'null', 'null'],
  ['@nivo/core', 'misc', 'null', 'null'],
  ['apisauce', 'misc', 'null', 'null'],
  ['async', 'misc', 'null', 'null'],
  ['axios', 'misc', 'null', 'null'],
  ['bluebird', 'misc', 'null', 'null'],
  ['browserify', 'misc', 'null', 'null'],
  ['buefy', 'misc', 'null', 'null'],
  ['chai', 'misc', 'null', 'null'],
  ['commander', 'misc', 'null', 'null'],
  ['commitizen', 'misc', 'null', 'null'],
  ['classnames', 'misc', 'null', 'null'],
  ['cheerio', 'misc', 'null', 'null'],
  ['core-js', 'misc', 'null', 'null'],
  ['debug', 'misc', 'null', 'null'],
  ['fp-ts', 'misc', 'null', 'null'],
  ['grunt', 'misc', 'null', 'null'],
  ['gulp', 'misc', 'null', 'null'],
  ['inquirer', 'misc', 'null', 'null'],
  ['jasmine', 'misc', 'null', 'null'],
  ['jquery', 'misc', 'null', 'null'],
  ['karma', 'misc', 'null', 'null'],
  ['less', 'misc', 'null', 'null'],
  ['mkdirp', 'misc', 'null', 'null'],
  ['mocha', 'misc', 'null', 'null'],
  ['node-fetch', 'misc', 'null', 'null'],
  ['passport', 'misc', 'null', 'null'],
  ['prop-types', 'misc', 'null', 'null'],
  ['protractor', 'misc', 'null', 'null'],
  ['react-chartjs-2', 'misc', 'null', 'null'],
  ['react-router', 'misc', 'null', 'null'],
  ['react-vis', 'misc', 'null', 'null'],
  ['sanctuary', 'misc', 'null', 'null'],
  ['sass', 'misc', 'null', 'null'],
  ['superagent', 'misc', 'null', 'null'],
  ['universal-router', 'misc', 'null', 'null'],
  ['uuid', 'misc', 'null', 'null'],
  ['victory', 'misc', 'null', 'null'],
  ['yargs', 'misc', 'null', 'null'],
];

interface CatalogLibraryT {
  name: string;
  category: string;
  seoAlias: string | null;
  framework: string | null;
}

export const catalogLibsByName = libraries.reduce(
  (acc, [name, category, seoAlias, framework]) => {
    acc[name] = { name, category, seoAlias, framework };
    return acc;
  },
  {} as Record<string, CatalogLibraryT>
);

export const libsNamesByCategory = libraries.reduce(
  (acc, [libName, category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(libName);

    return acc;
  },
  {} as Record<string, string[]>
);
