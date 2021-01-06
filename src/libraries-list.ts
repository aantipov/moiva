type CategoryT =
  | 'Chart'
  | 'Framework'
  | 'Template'
  | 'Date'
  | 'Utilities'
  | 'e2e'
  | 'Sockets'
  | 'NodeFramework'
  | 'NodeLogging'
  | 'CSSFrameworks'
  | 'VueComponents'
  | 'Other';
type FrameworkT = 'React' | 'Vue';
interface LibDataT {
  category: CategoryT;
  framework: FrameworkT | null;
}

const libraries: [string, LibDataT][] = [
  // Frameworks
  ['react', { category: 'Framework', framework: null }],
  ['vue', { category: 'Framework', framework: null }],
  ['@angular/core', { category: 'Framework', framework: null }],
  ['svelte', { category: 'Framework', framework: null }],
  ['ember-source', { category: 'Framework', framework: null }],
  ['alpinejs', { category: 'Framework', framework: null }],
  ['inferno', { category: 'Framework', framework: null }],
  ['preact', { category: 'Framework', framework: null }],
  ['hyperapp', { category: 'Framework', framework: null }],
  ['riot', { category: 'Framework', framework: null }],
  ['angular', { category: 'Framework', framework: null }],
  ['backbone.marionette', { category: 'Framework', framework: null }],
  ['knockout', { category: 'Framework', framework: null }],

  // Templating Engines
  ['ejs', { category: 'Template', framework: null }],
  ['handlebars', { category: 'Template', framework: null }],
  ['mustache', { category: 'Template', framework: null }],
  ['pug', { category: 'Template', framework: null }],
  ['nunjucks', { category: 'Template', framework: null }],
  ['marko', { category: 'Template', framework: null }],
  ['blueimp-tmpl', { category: 'Template', framework: null }],
  ['dot', { category: 'Template', framework: null }],
  ['xtemplate', { category: 'Template', framework: null }],
  ['dustjs-linkedin', { category: 'Template', framework: null }],
  ['ehtml', { category: 'Template', framework: null }],

  // Date utilities
  ['date-fns', { category: 'Date', framework: null }],
  ['dayjs', { category: 'Date', framework: null }],
  ['luxon', { category: 'Date', framework: null }],
  ['moment', { category: 'Date', framework: null }],
  ['fecha', { category: 'Date', framework: null }],
  ['ms', { category: 'Date', framework: null }],
  ['timeago.js', { category: 'Date', framework: null }],
  ['date.js', { category: 'Date', framework: null }],

  // Utilities
  ['lodash', { category: 'Utilities', framework: null }],
  ['ramda', { category: 'Utilities', framework: null }],
  ['underscore', { category: 'Utilities', framework: null }],
  ['rambda', { category: 'Utilities', framework: null }],
  ['mout', { category: 'Utilities', framework: null }],
  ['sugar', { category: 'Utilities', framework: null }],
  ['lazy.js', { category: 'Utilities', framework: null }],

  // E2E testing
  ['puppeteer', { category: 'e2e', framework: null }],
  ['cypress', { category: 'e2e', framework: null }],
  ['playwright', { category: 'e2e', framework: null }],
  ['selenium-webdriver', { category: 'e2e', framework: null }],
  ['webdriverio', { category: 'e2e', framework: null }],
  ['testcafe', { category: 'e2e', framework: null }],
  ['nightwatch', { category: 'e2e', framework: null }],
  ['taiko', { category: 'e2e', framework: null }],

  ['nightmare', { category: 'e2e', framework: null }],
  ['casperjs', { category: 'e2e', framework: null }],
  ['slimerjs', { category: 'e2e', framework: null }],
  ['zombie', { category: 'e2e', framework: null }],

  // Web Sockets
  ['socket.io', { category: 'Sockets', framework: null }],
  ['ws', { category: 'Sockets', framework: null }],

  // NodeJS Frameworks
  ['express', { category: 'NodeFramework', framework: null }],
  ['@nestjs/core', { category: 'NodeFramework', framework: null }],
  ['koa', { category: 'NodeFramework', framework: null }],
  ['fastify', { category: 'NodeFramework', framework: null }],
  ['@hapi/hapi', { category: 'NodeFramework', framework: null }],
  ['sails', { category: 'NodeFramework', framework: null }],
  ['restify', { category: 'NodeFramework', framework: null }],
  ['@feathersjs/feathers', { category: 'NodeFramework', framework: null }],
  ['loopback', { category: 'NodeFramework', framework: null }],
  ['@loopback/core', { category: 'NodeFramework', framework: null }],

  // NodeJS Logging
  ['log4js', { category: 'NodeLogging', framework: null }],
  ['pino', { category: 'NodeLogging', framework: null }],
  ['winston', { category: 'NodeLogging', framework: null }],
  ['morgan', { category: 'NodeLogging', framework: null }],
  ['loglevel', { category: 'NodeLogging', framework: null }],
  ['bunyan', { category: 'NodeLogging', framework: null }],

  // CSS Frameworks
  ['bootstrap', { category: 'CSSFrameworks', framework: null }],
  ['bulma', { category: 'CSSFrameworks', framework: null }],
  ['tailwindcss', { category: 'CSSFrameworks', framework: null }],
  ['tachyons', { category: 'CSSFrameworks', framework: null }],

  // Charts
  ['chart.js', { category: 'Chart', framework: null }],
  ['d3', { category: 'Chart', framework: null }],
  ['plotly.js', { category: 'Chart', framework: null }],
  ['highcharts', { category: 'Chart', framework: null }],
  ['recharts', { category: 'Chart', framework: null }],
  ['echarts', { category: 'Chart', framework: null }],
  ['@amcharts/amcharts4', { category: 'Chart', framework: null }],
  ['apexcharts', { category: 'Chart', framework: null }],

  ['chartist', { category: 'Chart', framework: null }],
  ['vis', { category: 'Chart', framework: null }],
  ['nvd3', { category: 'Chart', framework: null }],
  ['amcharts3', { category: 'Chart', framework: null }],
  ['peity', { category: 'Chart', framework: null }],

  // State Management

  // Vue component libraries
  ['vuetify', { category: 'VueComponents', framework: null }],
  ['quasar', { category: 'VueComponents', framework: null }],
  ['bootstrap-vue', { category: 'VueComponents', framework: null }],
  ['primevue', { category: 'VueComponents', framework: null }],
  ['vue-material', { category: 'VueComponents', framework: null }],

  // React component libraries

  ['@cucumber/cucumber', { category: 'Other', framework: null }],
  ['@emotion/css', { category: 'Other', framework: null }],
  ['@material-ui/core', { category: 'Other', framework: null }],
  ['@nivo/core', { category: 'Other', framework: null }],
  ['@parcel/core', { category: 'Other', framework: null }],
  ['antd', { category: 'Other', framework: null }],
  ['apisauce', { category: 'Other', framework: null }],
  ['async', { category: 'Other', framework: null }],
  ['axios', { category: 'Other', framework: null }],
  ['bluebird', { category: 'Other', framework: null }],
  ['browserify', { category: 'Other', framework: null }],
  ['buefy', { category: 'Other', framework: null }],
  ['chai', { category: 'Other', framework: null }],
  ['commander', { category: 'Other', framework: null }],
  ['classnames', { category: 'Other', framework: null }],
  ['cheerio', { category: 'Other', framework: null }],
  ['core-js', { category: 'Other', framework: null }],
  ['debug', { category: 'Other', framework: null }],
  ['downshift', { category: 'Other', framework: null }],
  ['eslint', { category: 'Other', framework: null }],
  ['forever', { category: 'Other', framework: null }],
  ['fp-ts', { category: 'Other', framework: null }],
  ['gatsby', { category: 'Other', framework: null }],
  ['grunt', { category: 'Other', framework: null }],
  ['gulp', { category: 'Other', framework: null }],
  ['immer', { category: 'Other', framework: null }],
  ['inquirer', { category: 'Other', framework: null }],
  ['jasmine', { category: 'Other', framework: null }],
  ['jest', { category: 'Other', framework: null }],
  ['jshint', { category: 'Other', framework: null }],
  ['jquery', { category: 'Other', framework: null }],
  ['js-beautify', { category: 'Other', framework: null }],
  ['jss', { category: 'Other', framework: null }],
  ['karma', { category: 'Other', framework: null }],
  ['less', { category: 'Other', framework: null }],
  ['mkdirp', { category: 'Other', framework: null }],
  ['mobx', { category: 'Other', framework: null }],
  ['mocha', { category: 'Other', framework: null }],
  ['materialize-css', { category: 'Other', framework: null }],
  ['next', { category: 'Other', framework: null }],
  ['node-fetch', { category: 'Other', framework: null }],
  ['nodemon', { category: 'Other', framework: null }],
  ['nuxt', { category: 'Other', framework: null }],
  ['passport', { category: 'Other', framework: null }],
  ['prettier', { category: 'Other', framework: null }],
  ['prop-types', { category: 'Other', framework: null }],
  ['pm2', { category: 'Other', framework: null }],
  ['protractor', { category: 'Other', framework: null }],
  ['radium', { category: 'Other', framework: null }],
  ['react-autosuggest', { category: 'Other', framework: null }],
  ['react-bootstrap', { category: 'Other', framework: null }],
  ['react-chartjs-2', { category: 'Other', framework: null }],
  ['react-datepicker', { category: 'Other', framework: null }],
  ['react-date-picker', { category: 'Other', framework: null }],
  ['react-dates', { category: 'Other', framework: null }],
  ['react-day-picker', { category: 'Other', framework: null }],
  ['react-router', { category: 'Other', framework: null }],
  ['react-select', { category: 'Other', framework: null }],
  ['react-vis', { category: 'Other', framework: null }],
  ['reactstrap', { category: 'Other', framework: null }],
  ['recoil', { category: 'Other', framework: null }],
  ['redux', { category: 'Other', framework: null }],
  ['rollup', { category: 'Other', framework: null }],
  ['rxjs', { category: 'Other', framework: null }],
  ['semantic-ui', { category: 'Other', framework: null }],
  ['sanctuary', { category: 'Other', framework: null }],
  ['sass', { category: 'Other', framework: null }],
  ['superagent', { category: 'Other', framework: null }],
  ['select2', { category: 'Other', framework: null }],
  ['styled-jsx', { category: 'Other', framework: null }],
  ['styled-components', { category: 'Other', framework: null }],
  ['tslint', { category: 'Other', framework: null }],
  ['universal-router', { category: 'Other', framework: null }],
  ['uuid', { category: 'Other', framework: null }],
  ['victory', { category: 'Other', framework: null }],
  ['vuex', { category: 'Other', framework: null }],
  ['webpack', { category: 'Other', framework: null }],
  ['yargs', { category: 'Other', framework: null }],
];

export const libsDataByName = libraries.reduce((acc, [libName, libData]) => {
  acc[libName] = libData;
  return acc;
}, {} as Record<string, LibDataT>);

export const libsNamesByCategory = libraries.reduce(
  (acc, [libName, libData]) => {
    if (!acc[libData.category]) {
      acc[libData.category] = [];
    }

    acc[libData.category].push(libName);

    return acc;
  },
  {} as Record<string, string[]>
);

export default libraries;
