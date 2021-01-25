const libraries: [
  string,
  string,
  string | null,
  string | null,
  string | null
][] = [
  // Frontend Frameworks
  ['react', 'Frontend Frameworks', null, null, null],
  ['vue', 'Frontend Frameworks', null, null, null],
  ['@angular/core', 'Frontend Frameworks', 'Angular', null, null],
  ['svelte', 'Frontend Frameworks', null, null, null],
  ['ember-source', 'Frontend Frameworks', 'Ember', null, null],
  ['alpinejs', 'Frontend Frameworks', null, null, null],
  ['inferno', 'Frontend Frameworks', null, null, null],
  ['preact', 'Frontend Frameworks', null, null, null],
  ['hyperapp', 'Frontend Frameworks', null, null, null],
  ['riot', 'Frontend Frameworks', null, null, null],
  ['angular', 'Frontend Frameworks', 'AngularJS', null, null],
  ['backbone.marionette', 'Frontend Frameworks', null, null, null],
  ['knockout', 'Frontend Frameworks', null, null, null],
  ['solid-js', 'Frontend Frameworks', 'Solid', null, null],
  ['mithril', 'Frontend Frameworks', null, null, null],
  ['aurelia-framework', 'Frontend Frameworks', 'Aurelia', null, null],
  ['stimulus', 'Frontend Frameworks', null, null, null],
  ['marko', 'Frontend Frameworks', null, null, null],

  // HTML Templating Engines
  ['ejs', 'HTML Templating Engines', null, null, null],
  ['handlebars', 'HTML Templating Engines', null, null, null],
  ['mustache', 'HTML Templating Engines', null, null, null],
  ['pug', 'HTML Templating Engines', null, null, null],
  ['nunjucks', 'HTML Templating Engines', null, null, null],
  ['blueimp-tmpl', 'HTML Templating Engines', null, null, null],
  ['dot', 'HTML Templating Engines', null, null, null],
  ['xtemplate', 'HTML Templating Engines', null, null, null],
  ['dustjs-linkedin', 'HTML Templating Engines', 'Dust.js', null, null],
  ['ehtml', 'HTML Templating Engines', null, null, null],

  // Date Utilities
  ['date-fns', 'Date Utilities', null, null, null],
  ['dayjs', 'Date Utilities', null, null, null],
  ['luxon', 'Date Utilities', null, null, null],
  ['moment', 'Date Utilities', null, null, null],
  ['fecha', 'Date Utilities', null, null, null],
  ['ms', 'Date Utilities', null, null, null],
  ['timeago.js', 'Date Utilities', null, null, null],
  ['date.js', 'Date Utilities', null, null, null],

  // Utilities
  ['lodash', 'Utilities', null, null, null],
  ['ramda', 'Utilities', null, null, null],
  ['underscore', 'Utilities', null, null, null],
  ['rambda', 'Utilities', null, null, null],
  ['mout', 'Utilities', null, null, null],
  ['sugar', 'Utilities', null, null, null],
  ['lazy.js', 'Utilities', null, null, null],

  // e2e testing
  ['puppeteer', 'e2e testing', null, null, null],
  ['cypress', 'e2e testing', null, null, null],
  ['playwright', 'e2e testing', null, null, null],
  ['selenium-webdriver', 'e2e testing', null, null, null],
  ['webdriverio', 'e2e testing', null, null, null],
  ['testcafe', 'e2e testing', null, null, null],
  ['nightwatch', 'e2e testing', null, null, null],
  ['taiko', 'e2e testing', null, null, null],
  ['nightmare', 'e2e testing', null, null, null],
  ['casperjs', 'e2e testing', null, null, null],
  ['slimerjs', 'e2e testing', null, null, null],
  ['zombie', 'e2e testing', null, null, null],

  // Web Sockets
  ['socket.io', 'Web Sockets', null, null, null],
  ['ws', 'Web Sockets', null, null, null],

  // NodeJS Frameworks
  ['express', 'NodeJS Frameworks', null, null, null],
  ['@nestjs/core', 'NodeJS Frameworks', 'NestJS', null, null],
  ['koa', 'NodeJS Frameworks', null, null, null],
  ['fastify', 'NodeJS Frameworks', null, null, null],
  ['@hapi/hapi', 'NodeJS Frameworks', 'Hapi', null, null],
  ['sails', 'NodeJS Frameworks', null, null, null],
  ['restify', 'NodeJS Frameworks', null, null, null],
  ['@feathersjs/feathers', 'NodeJS Frameworks', 'Feathers', null, null],
  ['loopback', 'NodeJS Frameworks', 'LoopBack 3', null, null],
  ['@loopback/core', 'NodeJS Frameworks', 'LoopBack 4', null, null],

  // NodeJS Logging
  ['log4js', 'NodeJS Logging', null, null, null],
  ['pino', 'NodeJS Logging', null, null, null],
  ['winston', 'NodeJS Logging', null, null, null],
  ['morgan', 'NodeJS Logging', null, null, null],
  ['loglevel', 'NodeJS Logging', null, null, null],
  ['bunyan', 'NodeJS Logging', null, null, null],

  // CSS Frameworks
  ['bootstrap', 'CSS Frameworks', null, null, null],
  ['bulma', 'CSS Frameworks', null, null, null],
  ['tailwindcss', 'CSS Frameworks', null, null, null],
  ['tachyons', 'CSS Frameworks', null, null, null],
  ['materialize-css', 'CSS Frameworks', null, null, null],
  ['html5-boilerplate', 'CSS Frameworks', 'HTML5 Boilerplate', null, null],
  ['foundation-sites', 'CSS Frameworks', 'Foundation', null, null],
  [
    'material-design-lite',
    'CSS Frameworks',
    'Material Design Lite',
    null,
    null,
  ],
  [
    'material-components-web',
    'CSS Frameworks',
    'Material Components for the web',
    null,
    null,
  ],
  ['spectre.css', 'CSS Frameworks', null, null, null],

  // Charts
  ['chart.js', 'Charts', null, null, null],
  ['d3', 'Charts', null, null, null],
  ['plotly.js', 'Charts', null, null, null],
  ['highcharts', 'Charts', null, null, null],
  ['recharts', 'Charts', null, null, null],
  ['echarts', 'Charts', null, null, null],
  ['@amcharts/amcharts4', 'Charts', 'amCharts 4', null, null],
  ['apexcharts', 'Charts', null, null, null],
  ['chartist', 'Charts', null, null, null],
  ['vis', 'Charts', null, null, null],
  ['nvd3', 'Charts', null, null, null],
  ['amcharts3', 'Charts', 'amCharts 3', null, null],
  ['peity', 'Charts', null, null, null],

  // Vue Component Libraries
  ['vuetify', 'Vue Component Libraries', null, null, null],
  ['quasar', 'Vue Component Libraries', null, null, null],
  ['bootstrap-vue', 'Vue Component Libraries', 'BootstrapVue', null, null],
  ['primevue', 'Vue Component Libraries', null, null, null],
  ['vue-material', 'Vue Component Libraries', 'Vue Material', null, null],
  ['element-ui', 'Vue Component Libraries', 'Element UI', null, null],
  ['element-plus', 'Vue Component Libraries', 'Element Plus', null, null],
  ['iview', 'Vue Component Libraries', 'iView', null, null],
  ['ant-design-vue', 'Vue Component Libraries', 'Ant Design Vue', null, null],

  // React Component Libraries
  ['@material-ui/core', 'React Component Libraries', 'Material-UI', null, null],
  ['antd', 'React Component Libraries', 'Ant Design', null, null],
  [
    'react-bootstrap',
    'React Component Libraries',
    'React Bootstrap',
    null,
    null,
  ],
  ['semantic-ui', 'React Component Libraries', 'Semantic UI', null, null],
  ['@chakra-ui/react', 'React Component Libraries', 'Chakra UI', null, null],
  ['reactstrap', 'React Component Libraries', null, null, null],
  ['evergreen-ui', 'React Component Libraries', 'Evergreen', null, null],

  // React Document Head Tags
  ['react-helmet', 'React Document Head Tags', 'React Helmet', null, null],
  ['react-helmet-async', 'React Document Head Tags', null, null, null],

  // State Management
  ['redux', 'State Management', null, null, null],
  ['mobx', 'State Management', 'MobX', null, null],
  ['rxjs', 'State Management', 'RxJS', null, null],
  ['recoil', 'State Management', null, null, null],
  ['vuex', 'State Management', null, 'vue', null],

  // Api Mocks
  ['msw', 'Api Mocks', 'MSW', null, null],
  ['mountebank', 'Api Mocks', null, null, null],
  ['json-server', 'Api Mocks', 'JSON Server', null, null],
  ['wiremock-standalone', 'Api Mocks', 'WireMock', null, null],
  ['miragejs', 'Api Mocks', 'Mirage', null, null],

  // AWS Lambda frameworks
  ['@middy/core', 'AWS Lambda frameworks', 'Middy', null, null],
  ['@laconia/core', 'AWS Lambda frameworks', 'Laconia', null, null],
  ['vandium', 'AWS Lambda frameworks', null, null, null],

  // Web Components
  ['@stencil/core', 'Web Components', 'Stencil', null, null],
  ['lit-element', 'Web Components', 'LitElement', null, null],

  // Visual Regression
  ['backstopjs', 'Visual Regression', 'BackstopJS', null, null],
  ['loki', 'Visual Regression', null, null, null],
  ['gemini', 'Visual Regression', null, null, null],

  // Static Site Generators / JAMStack
  ['gatsby', 'Static Site Generators / JAMStack', null, 'react', null],
  ['next', 'Static Site Generators / JAMStack', 'Next.js', 'react', null],
  ['nuxt', 'Static Site Generators / JAMStack', 'Nuxt.js', 'vue', null],
  ['sapper', 'Static Site Generators / JAMStack', null, 'svelte', null],
  ['@11ty/eleventy', 'Static Site Generators / JAMStack', '11ty', null, null],
  ['hexo', 'Static Site Generators / JAMStack', null, null, null],
  ['docusaurus', 'Static Site Generators / JAMStack', null, 'react', null],
  [
    '@docusaurus/core',
    'Static Site Generators / JAMStack',
    'Docusaurus 2',
    'react',
    null,
  ],
  ['vuepress', 'Static Site Generators / JAMStack', 'VuePress', 'vue', null],
  ['docsify', 'Static Site Generators / JAMStack', null, null, null],
  ['umi', 'Static Site Generators / JAMStack', 'UmiJS', 'react', null],
  [
    'react-static',
    'Static Site Generators / JAMStack',
    'React Static',
    'react',
    null,
  ],
  ['gridsome', 'Static Site Generators / JAMStack', null, 'vue', null],

  // Object Schema Validation
  ['joi', 'Object Schema Validation', null, null, null],
  ['ajv', 'Object Schema Validation', null, null, null],
  ['yup', 'Object Schema Validation', null, null, null],

  // Immutability
  ['immer', 'Immutability', null, null, null],
  ['immutable', 'Immutability', 'Immutable.js', null, null],

  // Runtime Types Checks
  ['io-ts', 'Runtime Types Checks', null, null, null],
  ['runtypes', 'Runtime Types Checks', null, null, null],

  // React Native Android
  ['hermes-engine', 'React Native Android', 'Hermes', null, null],
  ['jsc-android', 'React Native Android', null, null, null],
  ['react-native-v8', 'React Native Android', null, null, null],

  // GraphQL clients
  ['relay-runtime', 'GraphQL clients', 'Relay', 'react', null],
  ['@apollo/client', 'GraphQL clients', 'Apollo Client', 'react', null],
  ['apollo-client', 'GraphQL clients', null, 'react', null],
  ['vue-apollo', 'GraphQL clients', 'Vue Apollo', 'vue', null],
  ['svelte-apollo', 'GraphQL clients', null, 'svelte', null],
  ['ember-apollo-client', 'GraphQL clients', null, 'ember', null],
  ['apollo-angular', 'GraphQL clients', 'Apollo Angular', 'angular', null],

  // React Forms
  ['formik', 'React Forms', null, null, null],
  ['react-hook-form', 'React Forms', 'React Hook Form', null, null],
  ['redux-form', 'React Forms', 'Redux Form', null, null],
  ['final-form', 'React Forms', 'React Final Form', null, null],

  // Static Types Checking
  ['typescript', 'Static Types Checking', null, null, null],
  ['flow-bin', 'Static Types Checking', 'Flow', null, null],

  // React Unit Testing
  ['enzyme', 'React Unit Testing', null, null, null],
  [
    '@testing-library/react',
    'React Unit Testing',
    'React Testing Library',
    null,
    null,
  ],

  // Lint Prettify
  ['eslint', 'Lint Prettify', 'ESLint', null, null],
  ['tslint', 'Lint Prettify', 'TSLint', null, null],
  ['prettier', 'Lint Prettify', null, null, null],
  ['jshint', 'Lint Prettify', 'JSHint', null, null],
  ['js-beautify', 'Lint Prettify', 'JS Beautifier', null, null],

  // CSS-IN-JS
  ['styled-jsx', 'CSS-IN-JS', null, 'react', null],
  ['styled-components', 'CSS-IN-JS', null, 'react', null],
  ['radium', 'CSS-IN-JS', null, 'react', null],
  ['@emotion/react', 'CSS-IN-JS', null, 'react', null],
  ['@linaria/core', 'CSS-IN-JS', 'Linaria', 'react', null],
  ['jss', 'CSS-IN-JS', 'JSS', null, null],
  ['aphrodite', 'CSS-IN-JS', null, null, null],
  ['@emotion/css', 'CSS-IN-JS', 'Emotion', null, null],

  // Node Monitoring
  ['prom-client', 'Node Monitoring', 'Prometheus client', null, null],
  ['express-status-monitor', 'Node Monitoring', null, null, null],
  ['clinic', 'Node Monitoring', 'Clinic.js', null, null],
  ['appmetrics-dash', 'Node Monitoring', null, null, null],

  // 3D
  ['babylonjs', '3D', 'Babylon.js', null, null],
  ['three', '3D', 'Three.js', null, null],

  // Unit Tests Runner
  ['jest', 'Unit Tests Runner', null, null, null],
  ['ava', 'Unit Tests Runner', null, null, null],

  // ui dev environment
  ['@storybook/core', 'ui dev environment', 'Storybook', null, null],
  [
    'react-styleguidist',
    'ui dev environment',
    'React Styleguidist',
    'react',
    null,
  ],

  // Build Tools
  ['webpack', 'Build Tools', null, null, null],
  ['rollup', 'Build Tools', null, null, null],
  ['@parcel/core', 'Build Tools', 'Parcel 2', null, null],
  ['parcel-bundler', 'Build Tools', 'Parcel 1', null, null],
  ['snowpack', 'Build Tools', null, null, null],
  ['esbuild', 'Build Tools', null, null, null],

  // Node Runners
  ['forever', 'Node Runners', null, null, null],
  ['pm2', 'Node Runners', null, null, null],
  ['nodemon', 'Node Runners', null, null, null],

  // Fullstack Serverless React Frameworks
  ['blitz', 'Fullstack Serverless React Frameworks', null, 'react', null],
  [
    '@redwoodjs/core',
    'Fullstack Serverless React Frameworks',
    'RedwoodJS',
    'react',
    'redwoodjs/redwood',
  ],

  // Select Box
  ['downshift', 'Select Box', null, 'react', null],
  ['react-select', 'Select Box', 'React Select', 'react', null],
  ['select2', 'Select Box', null, null, null],
  ['react-autosuggest', 'Select Box', 'React Autosuggest', 'react', null],
  ['react-autocomplete', 'Select Box', 'React Autocomplete', 'react', null],
  [
    'react-virtualized-select',
    'Select Box',
    'React Virtualized Select',
    'react',
    null,
  ],
  ['react-dropdown', 'Select Box', null, 'react', null],

  // React Dates
  ['react-datepicker', 'React Dates', null, null, null],
  ['react-date-picker', 'React Dates', null, null, null],
  ['react-dates', 'React Dates', null, null, null],
  ['react-datetime', 'React Dates', null, null, null],
  ['react-day-picker', 'React Dates', null, null, null],
  ['react-calendar', 'React Dates', null, null, null],

  // misc
  ['@nivo/core', 'misc', null, null, null],
  ['apisauce', 'misc', null, null, null],
  ['async', 'misc', null, null, null],
  ['axios', 'misc', null, null, null],
  ['bluebird', 'misc', null, null, null],
  ['browserify', 'misc', null, null, null],
  ['buefy', 'misc', null, null, null],
  ['chai', 'misc', null, null, null],
  ['commander', 'misc', null, null, null],
  ['commitizen', 'misc', null, null, null],
  ['classnames', 'misc', null, null, null],
  ['cheerio', 'misc', null, null, null],
  ['core-js', 'misc', null, null, null],
  ['debug', 'misc', null, null, null],
  ['fp-ts', 'misc', null, null, null],
  ['grunt', 'misc', null, null, null],
  ['gulp', 'misc', null, null, null],
  ['inquirer', 'misc', null, null, null],
  ['jasmine', 'misc', null, null, null],
  ['jquery', 'misc', null, null, null],
  ['karma', 'misc', null, null, null],
  ['less', 'misc', null, null, null],
  ['mkdirp', 'misc', null, null, null],
  ['mocha', 'misc', null, null, null],
  ['node-fetch', 'misc', null, null, null],
  ['passport', 'misc', null, null, null],
  ['prop-types', 'misc', null, null, null],
  ['protractor', 'misc', null, null, null],
  ['react-chartjs-2', 'misc', null, null, null],
  ['react-router', 'misc', null, null, null],
  ['react-vis', 'misc', null, null, null],
  ['sanctuary', 'misc', null, null, null],
  ['sass', 'misc', null, null, null],
  ['superagent', 'misc', null, null, null],
  ['universal-router', 'misc', null, null, null],
  ['uuid', 'misc', null, null, null],
  ['victory', 'misc', null, null, null],
  ['yargs', 'misc', null, null, null],
  ['postcss', 'misc', 'PostCSS', null, null],
  ['create-react-app', 'misc', 'Create React App', null, null],
  ['react-router-dom', 'misc', null, null, null],
  ['react-native', 'misc', null, null, null],
  ['electron', 'misc', null, null, null],
  ['animate.css', 'misc', null, null, null],
  ['@fortawesome/fontawesome-free', 'misc', 'Font Awesome', null, null],
  ['reveal.js', 'misc', null, null, null],
  ['@ionic/core', 'misc', 'Ionic', null, null],
  ['normalize.css', 'misc', null, null, null],
  ['material-design-icons', 'misc', 'Material Icons', null, null],
  ['yarn', 'misc', null, null, null],
  ['serverless', 'misc', 'Serverless Framework', null, null],
  ['@babel/core', 'misc', 'Babel', null, null],
  ['animejs', 'misc', null, null, null],
  ['impress.js', 'misc', null, null, null],
  ['ghost', 'misc', null, null, null],
  ['mermaid', 'misc', null, null, null],
  ['strapi', 'misc', null, null, null],
  ['pixi.js', 'misc', 'PixiJS', null, null],
  ['fullpage.js', 'misc', 'fullPage.js', null, null],
  ['@atomist/hackathon-starter', 'misc', 'Hackathon Starter', null, null],
  ['video.js', 'misc', null, null, null],
  ['clipboard', 'misc', 'clipboard.js', null, null],
  ['faker', 'misc', 'faker.js', null, null],
  ['phaser', 'misc', null, null, null],
  ['quill', 'misc', null, null, null],
  ['ant-design-pro', 'misc', 'Ant Design Pro', null, null],
  ['@vue/cli', 'misc', 'Vue CLI', 'vue', null],
  ['slick-carousel', 'misc', 'Slick', null, null],
  ['lerna', 'misc', null, null, null],
  ['swiper', 'misc', null, null, null],
  ['request', 'misc', null, null, null],
  ['standard', 'misc', 'JavaScript Standard Style', null, null],
  ['modernizr', 'misc', null, null, null],
  ['whatwg-fetch', 'misc', 'Fetch', null, null],
  ['xlsx', 'misc', 'SheetJS js-xlsx', null, null],
  ['marked', 'misc', null, null, null],
  ['@angular/cli', 'misc', 'Angular CLI', 'angular', null],
  ['@uppy/core', 'misc', 'Uppy', null, null],
  ['sequelize', 'misc', null, null, null],
  ['webtorrent', 'misc', 'WebTorrent', null, null],
  ['webtorrent-cli', 'misc', null, null, null],
  ['lottie-web', 'misc', 'Lottie for Web', null, null],
  ['monaco-editor', 'misc', 'Monaco Editor', null, null],
  ['tesseract.js', 'misc', null, null, null],
  ['typeorm', 'misc', 'TypeORM', null, null],
  ['@tabler/core', 'misc', 'Tabler', null, null],
  ['ace-builds', 'misc', 'Ace', null, null],
  ['react-beautiful-dnd', 'misc', null, null, null],
  ['mongoose', 'misc', null, null, null],
  ['hammerjs', 'misc', 'hammer.js', null, null],
  ['codemirror', 'misc', 'CodeMirror', null, null],
  ['sortablejs', 'misc', 'Sortable', null, null],
  ['lighthouse', 'misc', null, null, null],
  ['@polymer/polymer', 'misc', 'Polymer', null, null],
  ['polymer-cli', 'misc', null, null, null],
  ['husky', 'misc', null, null, null],
  ['purecss', 'misc', 'Pure.css', null, null],
  ['redux-saga', 'misc', null, null, null],
  ['jspdf', 'misc', 'jsPDF', null, null],
  ['@angular/material', 'misc', 'Material for Angular', null, null],
  ['react-virtualized', 'misc', null, null, null],
  ['react-window', 'misc', null, null, null],
  ['dragula', 'misc', null, null, null],
  ['intro.js', 'misc', null, null, null],
  ['normalizr', 'misc', null, null, null],
  ['draft-js', 'misc', 'Draft.js', null, null],
  ['nativescript', 'misc', null, null, null],
  ['feather-icons', 'misc', 'Feather', null, null],
  ['slate', 'misc', null, null, null],
  ['scrollreveal', 'misc', null, null, null],
  ['react-motion', 'misc', null, null, null],
  ['@mostly-adequate/support', 'misc', 'Guide to FP', null, null],
  ['react-spring', 'misc', null, null, null],
  ['autoprefixer', 'misc', null, null, null],
  ['flv.js', 'misc', null, null, null],
  ['plyr', 'misc', null, null, null],
  ['sharp', 'misc', null, null, null],
  ['localforage', 'misc', 'localForage', null, null],
  ['react-use', 'misc', null, null, null],
  ['popmotion', 'misc', null, null, null],
  ['react-native-web', 'misc', 'React Native for Web', null, null],
  ['fabric', 'misc', 'Fabric.js', null, null],
  ['highlight.js', 'misc', null, null, null],
  ['howler', 'misc', 'Howler.js', null, null],
  ['vue-router', 'misc', 'Vue Router', null, null],
  ['reselect', 'misc', null, null, null],
  ['vux', 'misc', null, null, null],
  ['pkg', 'misc', null, null, null],
  ['@blueprintjs/core', 'misc', 'Blueprint', 'react', null],
  ['react-query', 'misc', 'React Query', null, null],
  ['validator', 'misc', 'validator.js', null, null],
  ['flux', 'misc', null, null, null],
  ['js-cookie', 'misc', 'JavaScript Cookie', null, null],
  ['ccxt', 'misc', null, null, null],
  ['undefined', 'misc', null, null, null],
  ['egg', 'misc', null, null, null],
  ['@popperjs/core', 'misc', 'Popper', null, null],
  ['uikit', 'misc', 'UIkit', null, null],
  ['vant', 'misc', null, 'vue', null],
  ['@mojs/core', 'misc', 'mojs', null, null],
  ['cleave.js', 'misc', null, null, null],
  ['mint-ui', 'misc', 'Mint UI', null, null],
  ['file-saver', 'misc', 'FileSaver.js', null, null],
  ['streamsaver', 'misc', 'StreamSaver.js', null, null],
  ['vite', 'misc', null, null, null],
  ['framework7', 'misc', null, null, null],
  ['trix', 'misc', null, null, null],
  ['chalk', 'misc', null, null, null],
  ['react-admin', 'misc', null, 'react', null],
  ['coffeescript', 'misc', 'CoffeeScript', null, null],
  ['react-loadable', 'misc', null, null, null],
  ['ink', 'misc', null, null, null],
  ['dva', 'misc', 'DvaJS', null, null],
  ['svgo', 'misc', null, null, null],
  ['jsdom', 'misc', null, null, null],
  ['aos', 'misc', null, null, null],
  ['swr', 'misc', 'SWR', null, null],
  ['ar.js', 'misc', null, null, null],
  ['masonry-layout', 'misc', null, null, null],
  ['react-dnd', 'misc', 'React DnD', null, null],
  ['ionicons', 'misc', null, null, null],
  ['rxdb', 'misc', 'RxDB', null, null],
  ['roughjs', 'misc', 'Rough.js', null, null],
  ['medium-editor', 'misc', 'MediumEditor', null, null],
  ['q', 'misc', null, null, null],
  ['zepto', 'misc', 'Zepto.js', null, null],
  ['@shopify/draggable', 'misc', 'Draggable', null, null],
  ['p5', 'misc', null, null, null],
  ['lazysizes', 'misc', null, null, null],
  ['handsontable', 'misc', null, null, null],
  ['recompose', 'misc', null, 'react', null],
  ['lowdb', 'misc', null, null, null],
  ['native-base', 'misc', null, null, null],
  ['@tensorflow/tfjs', 'misc', 'TensorFlow.js', null, null],
  ['xstate', 'misc', null, null, null],
  ['@editorjs/editorjs', 'misc', 'Editor.js', null, null],
  ['prepack', 'misc', null, null, null],
  ['n', 'misc', null, null, null],
  ['blessed-contrib', 'misc', null, null, null],
  ['blessed', 'misc', null, null, null],
  ['weex-vue-render', 'misc', null, null, null],
  ['pouchdb', 'misc', 'PouchDB', null, null],
  ['@theia/core', 'misc', 'Eclipse Theia', null, null],
  ['flatpickr', 'misc', null, null, null],
  ['frappe-charts', 'misc', 'Frappe Charts', null, null],
  ['knex', 'misc', 'knex.js', null, null],
  ['jsonwebtoken', 'misc', null, null, null],
  ['vivus', 'misc', 'vivus.js', null, null],
  ['@fullcalendar/core', 'misc', 'FullCalendar', null, null],
  ['nodemailer', 'misc', null, null, null],
  ['react-table', 'misc', 'React Table', 'react', null],
  ['store', 'misc', 'Store.js', null, null],
  ['netlify-cms-app', 'misc', 'Netlify CMS', null, null],
  ['katex', 'misc', 'KaTeX', null, null],
  ['snapsvg', 'misc', 'Snap.svg', null, null],
  ['dotenv', 'misc', null, null, null],
  ['bit-bin', 'misc', 'Bit', null, null],
  ['expo-cli', 'misc', null, null, null],
  ['expo', 'misc', null, null, null],
  ['react-grid-layout', 'misc', 'React-Grid-Layout', 'react', null],
  ['headless-recorder', 'misc', 'Headless Recorder', null, null],
  ['bootswatch', 'misc', null, null, null],
  ['selectize', 'misc', 'selectize.js', null, null],
  ['turbolinks', 'misc', null, null, null],
  ['gun', 'misc', null, null, null],
  ['super-tiny-icons', 'misc', 'Super Tiny Icons', null, null],
  ['grapesjs', 'misc', 'GrapesJS', null, null],
  ['sweetalert2', 'misc', null, null, null],
  ['aframe', 'misc', 'A-Frame', null, null],
  ['@toast-ui/editor', 'misc', 'TOAST UI Editor', null, null],
  ['react-intl', 'misc', 'React Intl', null, null],
  ['@vx/vx', 'misc', 'visx', null, null],
  ['paper', 'misc', 'Paper.js', null, null],
  ['driver.js', 'misc', null, null, null],
  ['twemoji', 'misc', null, null, null],
  ['n8n', 'misc', null, null, null],
  ['johnny-five', 'misc', null, null, null],
  ['gpu.js', 'misc', 'GPU.js', null, null],
  ['react-native-navigation', 'misc', 'React Native Navigation', null, null],
  ['react-hot-loader', 'misc', 'React Hot Loader', null, null],
  ['gsap', 'misc', 'GSAP', null, null],
  ['fuse.js', 'misc', null, null, null],
  ['verbal-expressions', 'misc', 'VerbalExpressions', null, null],
  ['brain.js', 'misc', null, null, null],
  ['omi', 'misc', null, null, null],
  ['react-three-fiber', 'misc', null, null, null],
  ['shelljs', 'misc', 'ShellJS', null, null],
  ['smartcrop', 'misc', 'smartcrop.js', null, null],
  ['mjml', 'misc', 'MJML', null, null],
  ['pell', 'misc', null, null, null],
  ['node-red', 'misc', 'Node-RED', null, null],
  ['co', 'misc', null, null, null],
  ['nanoid', 'misc', 'Nano ID', null, null],
  ['browser-sync', 'misc', 'Browsersync', null, null],
  ['systemjs', 'misc', 'SystemJS', null, null],
  ['pomelo', 'misc', null, null, null],
  ['verdaccio', 'misc', null, null, null],
  ['matter-js', 'misc', 'Matter.js', null, null],
  ['redux-persist', 'misc', 'Redux Persist', null, null],
  ['virtual-dom', 'misc', null, null, null],
  ['markdown-it', 'misc', null, null, null],
  ['apollo-server', 'misc', 'Apollo Server', null, null],
  ['@assemblyscript/loader', 'misc', 'AssemblyScript', null, null],
  ['jimp', 'misc', null, null, null],
  ['jquery-ui', 'misc', 'jQuery UI', null, null],
  ['raphael', 'misc', null, null, null],
  ['supertest', 'misc', 'SuperTest', null, null],
  ['x-data-spreadsheet', 'misc', 'x-spreadsheet', null, null],
  ['mathjs', 'misc', 'Math.js', null, null],
  ['headroom.js', 'misc', null, null, null],
  ['proton-native', 'misc', null, null, null],
  ['dplayer', 'misc', 'DPlayer', null, null],
  ['tone', 'misc', 'Tone.js', null, null],
  ['stylus', 'misc', null, null, null],
  ['crypto-js', 'misc', null, null, null],
  ['mousetrap', 'misc', null, null, null],
  ['@antv/g2', 'misc', 'G2', null, null],
  ['@antv/g2plot', 'misc', 'G2Plot', null, null],
  ['@swc/core', 'misc', 'swc', null, null],
  ['filepond', 'misc', null, null, null],
  ['react-content-loader', 'misc', null, 'react', null],
  ['list.js', 'misc', null, null, null],
  ['@mdx-js/mdx', 'misc', 'MDX', null, null],
  ['fx', 'misc', null, null, null],
  ['@fluentui/react', 'misc', 'Fluent UI Web/React', null, null],
  ['nock', 'misc', null, null, null],
  ['botkit', 'misc', null, null, null],
  ['electron-builder', 'misc', null, null, null],
  ['vue-resource', 'misc', null, null, null],
  ['bull', 'misc', null, null, null],
  ['@primer/css', 'misc', 'Primer CSS', null, null],
  ['web-vitals', 'misc', null, null, null],
  ['@vueuse/core', 'misc', 'VueUse', null, null],
];

interface CatalogLibraryT {
  name: string;
  category: string;
  seoAlias: string | null;
  framework: string | null;
  github: string | null;
}

export const catalogLibsByName = libraries.reduce(
  (acc, [name, category, seoAlias, framework, github]) => {
    acc[name] = { name, category, seoAlias, framework, github };
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
