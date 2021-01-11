type CategoryT =
  | '3D'
  | 'ApiMocking'
  | 'AwsLambdaFramework'
  | 'BuildTools'
  | 'Chart'
  | 'CSS-IN-JS'
  | 'Framework'
  | 'GraphQLSupport'
  | 'JAMstack'
  | 'LintPrettify'
  | 'Immutability'
  | 'Template'
  | 'Date'
  | 'Utilities'
  | 'e2e'
  | 'Sockets'
  | 'NodeFramework'
  | 'NodeLogging'
  | 'NodeMonitoring'
  | 'NodeRunner'
  | 'ObjectSchemaValidation'
  | 'CSSFrameworks'
  | 'VueComponents'
  | 'ReactComponents'
  | 'ReactNativeAndroid'
  | 'ReactForms'
  | 'ReactSelect'
  | 'ReactDates'
  | 'RuntimeTypesChecks'
  | 'State'
  | 'TypesChecking'
  | 'ReactUnitTesting'
  | 'UnitTestsRunner'
  | 'VisualRegression'
  | 'WebComponents'
  | 'UIDevEnvironment'
  | 'Other';
type FrameworkT = 'React' | 'Vue';
interface LibDataT {
  category: CategoryT;
  framework?: FrameworkT;
}

const libraries: [string, LibDataT][] = [
  // Frameworks
  ['react', { category: 'Framework' }],
  ['vue', { category: 'Framework' }],
  ['@angular/core', { category: 'Framework' }],
  ['svelte', { category: 'Framework' }],
  ['ember-source', { category: 'Framework' }],
  ['alpinejs', { category: 'Framework' }],
  ['inferno', { category: 'Framework' }],
  ['preact', { category: 'Framework' }],
  ['hyperapp', { category: 'Framework' }],
  ['riot', { category: 'Framework' }],
  ['angular', { category: 'Framework' }],
  ['backbone.marionette', { category: 'Framework' }],
  ['knockout', { category: 'Framework' }],
  ['solid-js', { category: 'Framework' }],

  // Templating Engines
  ['ejs', { category: 'Template' }],
  ['handlebars', { category: 'Template' }],
  ['mustache', { category: 'Template' }],
  ['pug', { category: 'Template' }],
  ['nunjucks', { category: 'Template' }],
  ['marko', { category: 'Template' }],
  ['blueimp-tmpl', { category: 'Template' }],
  ['dot', { category: 'Template' }],
  ['xtemplate', { category: 'Template' }],
  ['dustjs-linkedin', { category: 'Template' }],
  ['ehtml', { category: 'Template' }],

  // Date utilities
  ['date-fns', { category: 'Date' }],
  ['dayjs', { category: 'Date' }],
  ['luxon', { category: 'Date' }],
  ['moment', { category: 'Date' }],
  ['fecha', { category: 'Date' }],
  ['ms', { category: 'Date' }],
  ['timeago.js', { category: 'Date' }],
  ['date.js', { category: 'Date' }],

  // Utilities
  ['lodash', { category: 'Utilities' }],
  ['ramda', { category: 'Utilities' }],
  ['underscore', { category: 'Utilities' }],
  ['rambda', { category: 'Utilities' }],
  ['mout', { category: 'Utilities' }],
  ['sugar', { category: 'Utilities' }],
  ['lazy.js', { category: 'Utilities' }],

  // E2E testing
  ['puppeteer', { category: 'e2e' }],
  ['cypress', { category: 'e2e' }],
  ['playwright', { category: 'e2e' }],
  ['selenium-webdriver', { category: 'e2e' }],
  ['webdriverio', { category: 'e2e' }],
  ['testcafe', { category: 'e2e' }],
  ['nightwatch', { category: 'e2e' }],
  ['taiko', { category: 'e2e' }],

  ['nightmare', { category: 'e2e' }],
  ['casperjs', { category: 'e2e' }],
  ['slimerjs', { category: 'e2e' }],
  ['zombie', { category: 'e2e' }],

  // Web Sockets
  ['socket.io', { category: 'Sockets' }],
  ['ws', { category: 'Sockets' }],

  // NodeJS Frameworks
  ['express', { category: 'NodeFramework' }],
  ['@nestjs/core', { category: 'NodeFramework' }],
  ['koa', { category: 'NodeFramework' }],
  ['fastify', { category: 'NodeFramework' }],
  ['@hapi/hapi', { category: 'NodeFramework' }],
  ['sails', { category: 'NodeFramework' }],
  ['restify', { category: 'NodeFramework' }],
  ['@feathersjs/feathers', { category: 'NodeFramework' }],
  ['loopback', { category: 'NodeFramework' }],
  ['@loopback/core', { category: 'NodeFramework' }],

  // NodeJS Logging
  ['log4js', { category: 'NodeLogging' }],
  ['pino', { category: 'NodeLogging' }],
  ['winston', { category: 'NodeLogging' }],
  ['morgan', { category: 'NodeLogging' }],
  ['loglevel', { category: 'NodeLogging' }],
  ['bunyan', { category: 'NodeLogging' }],

  // CSS Frameworks
  ['bootstrap', { category: 'CSSFrameworks' }],
  ['bulma', { category: 'CSSFrameworks' }],
  ['tailwindcss', { category: 'CSSFrameworks' }],
  ['tachyons', { category: 'CSSFrameworks' }],
  ['materialize-css', { category: 'CSSFrameworks' }],

  // Charts
  ['chart.js', { category: 'Chart' }],
  ['d3', { category: 'Chart' }],
  ['plotly.js', { category: 'Chart' }],
  ['highcharts', { category: 'Chart' }],
  ['recharts', { category: 'Chart' }],
  ['echarts', { category: 'Chart' }],
  ['@amcharts/amcharts4', { category: 'Chart' }],
  ['apexcharts', { category: 'Chart' }],

  ['chartist', { category: 'Chart' }],
  ['vis', { category: 'Chart' }],
  ['nvd3', { category: 'Chart' }],
  ['amcharts3', { category: 'Chart' }],
  ['peity', { category: 'Chart' }],

  // Vue component libraries
  ['vuetify', { category: 'VueComponents' }],
  ['quasar', { category: 'VueComponents' }],
  ['bootstrap-vue', { category: 'VueComponents' }],
  ['primevue', { category: 'VueComponents' }],
  ['vue-material', { category: 'VueComponents' }],
  ['element-ui', { category: 'VueComponents' }],

  // React component libraries
  ['@material-ui/core', { category: 'ReactComponents' }],
  ['antd', { category: 'ReactComponents' }],
  ['react-bootstrap', { category: 'ReactComponents' }],
  ['semantic-ui', { category: 'ReactComponents' }],
  ['@chakra-ui/react', { category: 'ReactComponents' }],
  ['reactstrap', { category: 'ReactComponents' }],

  // State Management
  ['redux', { category: 'State' }],
  ['mobx', { category: 'State' }],
  ['rxjs', { category: 'State' }],
  ['recoil', { category: 'State' }],
  ['vuex', { category: 'State' }],

  // Api mocking
  ['msw', { category: 'ApiMocking' }],
  ['mountebank', { category: 'ApiMocking' }],

  // AwsLambdaFramework
  ['@middy/core', { category: 'AwsLambdaFramework' }],
  ['@laconia/core', { category: 'AwsLambdaFramework' }],
  ['vandium', { category: 'AwsLambdaFramework' }],

  // WebComponents
  ['@stencil/core', { category: 'WebComponents' }],
  ['lit-element', { category: 'WebComponents' }],

  // VisualRegression
  ['backstopjs', { category: 'VisualRegression' }],
  ['loki', { category: 'VisualRegression' }],
  ['gemini', { category: 'VisualRegression' }],

  // JAMstack
  ['gatsby', { category: 'JAMstack' }],
  ['next', { category: 'JAMstack' }],
  ['nuxt', { category: 'JAMstack' }],
  ['sapper', { category: 'JAMstack' }],
  ['@11ty/eleventy', { category: 'JAMstack' }],
  ['hexo', { category: 'JAMstack' }],
  ['docusaurus', { category: 'JAMstack' }],
  ['@docusaurus/core', { category: 'JAMstack' }],
  ['vuepress', { category: 'JAMstack', framework: 'Vue' }],
  ['docsify', { category: 'JAMstack' }],
  ['umi', { category: 'JAMstack' }],
  ['react-static', { category: 'JAMstack' }],
  ['gridsome', { category: 'JAMstack', framework: 'Vue' }],

  // ObjectSchemaValidation
  ['joi', { category: 'ObjectSchemaValidation' }],
  ['ajv', { category: 'ObjectSchemaValidation' }],
  ['yup', { category: 'ObjectSchemaValidation' }],

  // Immutability
  ['immer', { category: 'Immutability' }],
  ['immutable', { category: 'Immutability' }],

  // RuntimeTypesChecks
  ['io-ts', { category: 'RuntimeTypesChecks' }],
  ['runtypes', { category: 'RuntimeTypesChecks' }],

  // ReactNativeAndroid
  ['hermes-engine', { category: 'ReactNativeAndroid' }],
  ['jsc-android', { category: 'ReactNativeAndroid' }],
  ['react-native-v8', { category: 'ReactNativeAndroid' }],

  // GraphQLSupport
  ['relay-runtime', { category: 'GraphQLSupport' }],
  ['@apollo/client', { category: 'GraphQLSupport' }],
  ['apollo-client', { category: 'GraphQLSupport' }],
  ['vue-apollo', { category: 'GraphQLSupport' }],
  ['svelte-apollo', { category: 'GraphQLSupport' }],
  ['ember-apollo-client', { category: 'GraphQLSupport' }],

  // ReactForms
  ['formik', { category: 'ReactForms', framework: 'React' }],
  ['react-hook-form', { category: 'ReactForms', framework: 'React' }],
  ['redux-form', { category: 'ReactForms', framework: 'React' }],
  ['final-form', { category: 'ReactForms', framework: 'React' }],

  // TypesChecking
  ['typescript', { category: 'TypesChecking' }],
  ['flow-bin', { category: 'TypesChecking' }],

  // ReactUnitTesting
  ['enzyme', { category: 'ReactUnitTesting' }],
  ['@testing-library/react', { category: 'ReactUnitTesting' }],

  // LintPrettify
  ['eslint', { category: 'LintPrettify' }],
  ['tslint', { category: 'LintPrettify' }],
  ['prettier', { category: 'LintPrettify' }],
  ['jshint', { category: 'LintPrettify' }],
  ['js-beautify', { category: 'LintPrettify' }],

  // CSS-IN-JS
  ['styled-jsx', { category: 'CSS-IN-JS' }],
  ['styled-components', { category: 'CSS-IN-JS' }],
  ['radium', { category: 'CSS-IN-JS' }],
  ['emotion', { category: 'CSS-IN-JS' }],
  ['@linaria/core', { category: 'CSS-IN-JS' }],
  ['jss', { category: 'CSS-IN-JS' }],
  ['aphrodite', { category: 'CSS-IN-JS' }],
  ['@emotion/css', { category: 'CSS-IN-JS' }],

  // NodeMonitoring
  ['prom-client', { category: 'NodeMonitoring' }],
  ['express-status-monitor', { category: 'NodeMonitoring' }],
  ['clinic', { category: 'NodeMonitoring' }],
  ['appmetrics-dash', { category: 'NodeMonitoring' }],

  // 3D
  ['babylonjs', { category: '3D' }],
  ['three', { category: '3D' }],

  // UnitTestsRunner
  ['jest', { category: 'UnitTestsRunner' }],
  ['ava', { category: 'UnitTestsRunner' }],

  // UIDevEnvironment
  ['@storybook/core', { category: 'UIDevEnvironment' }],
  ['react-styleguidist', { category: 'UIDevEnvironment' }],

  // BuildTools
  ['webpack', { category: 'BuildTools' }],
  ['rollup', { category: 'BuildTools' }],
  ['@parcel/core', { category: 'BuildTools' }],
  ['parcel', { category: 'BuildTools' }],
  ['snowpack', { category: 'BuildTools' }],
  ['esbuild', { category: 'BuildTools' }],

  // NodeRunner
  ['forever', { category: 'NodeRunner' }],
  ['pm2', { category: 'NodeRunner' }],
  ['nodemon', { category: 'NodeRunner' }],

  // ReactSelect
  ['downshift', { category: 'ReactSelect' }],
  ['react-select', { category: 'ReactSelect' }],
  ['select2', { category: 'ReactSelect' }],
  ['react-autosuggest', { category: 'ReactSelect' }],
  ['react-autocomplete', { category: 'ReactSelect' }],
  ['react-virtualized-select', { category: 'ReactSelect' }],
  ['react-dropdown', { category: 'ReactSelect' }],

  // ReactDates
  ['react-datepicker', { category: 'ReactDates' }],
  ['react-date-picker', { category: 'ReactDates' }],
  ['react-dates', { category: 'ReactDates' }],
  ['react-datetime', { category: 'ReactDates' }],
  ['react-day-picker', { category: 'ReactDates' }],
  ['react-calendar', { category: 'ReactDates' }],

  ['@cucumber/cucumber', { category: 'Other' }],
  ['@nivo/core', { category: 'Other' }],
  ['apisauce', { category: 'Other' }],
  ['async', { category: 'Other' }],
  ['axios', { category: 'Other' }],
  ['bluebird', { category: 'Other' }],
  ['browserify', { category: 'Other' }],
  ['buefy', { category: 'Other' }],
  ['chai', { category: 'Other' }],
  ['commander', { category: 'Other' }],
  ['commitizen', { category: 'Other' }],
  ['classnames', { category: 'Other' }],
  ['cheerio', { category: 'Other' }],
  ['core-js', { category: 'Other' }],
  ['debug', { category: 'Other' }],
  ['fp-ts', { category: 'Other' }],
  ['grunt', { category: 'Other' }],
  ['gulp', { category: 'Other' }],
  ['inquirer', { category: 'Other' }],
  ['jasmine', { category: 'Other' }],
  ['jquery', { category: 'Other' }],
  ['karma', { category: 'Other' }],
  ['less', { category: 'Other' }],
  ['mkdirp', { category: 'Other' }],
  ['mocha', { category: 'Other' }],
  ['node-fetch', { category: 'Other' }],
  ['passport', { category: 'Other' }],
  ['prop-types', { category: 'Other' }],
  ['protractor', { category: 'Other' }],
  ['react-chartjs-2', { category: 'Other' }],
  ['react-router', { category: 'Other' }],
  ['react-vis', { category: 'Other' }],
  ['sanctuary', { category: 'Other' }],
  ['sass', { category: 'Other' }],
  ['superagent', { category: 'Other' }],
  ['universal-router', { category: 'Other' }],
  ['uuid', { category: 'Other' }],
  ['victory', { category: 'Other' }],
  ['yargs', { category: 'Other' }],
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
