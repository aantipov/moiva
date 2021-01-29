const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [HOLD, ASSESS, TRIAL, ADOPT];

type RepoNameT = string;
type AliasT = string;
type LinkT = string;
interface DataT {
  [key: string]: TRadarLevelT;
}
export interface TechRadarT {
  repo: RepoNameT;
  alias: AliasT;
  link: LinkT;
  data: DataT;
}

const libs: [RepoNameT, AliasT, LinkT, DataT][] = [
  [
    'vuejs/vue',
    'Vue.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/vue-js',
    { '2016-11': ASSESS, '2017-03': TRIAL, '2020-05': ADOPT },
  ],
  [
    'facebook/react',
    'React.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/react-js',
    {
      '2015-01': ASSESS,
      '2015-05': TRIAL,
      '2015-11': TRIAL,
      '2016-04': ADOPT,
      '2016-11': ADOPT,
    },
  ],
  [
    'sveltejs/svelte',
    'Svelte',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/svelte',
    { '2020-10': ASSESS },
  ],
  [
    'angular/angular',
    'Angular',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/angular',
    { '2017-03': ASSESS, '2017-11': TRIAL },
  ],
  [
    'angular/angular.js',
    'AngularJS',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/angularjs',
    {
      '2014-07': TRIAL,
      '2015-01': TRIAL,
      '2016-04': ASSESS,
      '2016-11': HOLD,
      '2017-03': HOLD,
    },
  ],
  [
    'emberjs/ember.js',
    'Ember.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/ember-js',
    {
      '2015-05': ASSESS,
      '2015-11': ASSESS,
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
    },
  ],
  [
    'reduxjs/redux',
    'Redux',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/redux',
    {
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
      '2020-10': TRIAL,
    },
  ],
  [
    'facebookexperimental/recoil',
    'Recoil',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/recoil',
    { '2020-10': ASSESS },
  ],
  [
    'davidkpiano/xstate',
    'XState',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/xstate',
    { '2020-05': ASSESS, '2020-10': TRIAL },
  ],
  [
    'testing-library/react-testing-library',
    'React Testing Library',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/react-testing-library',
    { '2019-04': ASSESS, '2019-11': TRIAL, '2020-05': ADOPT },
  ],
  [
    'airbnb/enzyme',
    'Enzyme',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/enzyme',
    {
      '2016-11': TRIAL,
      '2017-03': TRIAL,
      '2018-05': ADOPT,
      '2019-11': HOLD,
      '2020-05': HOLD,
    },
  ],
  [
    'facebook/jest',
    'Jest',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jest',
    { '2017-11': TRIAL },
  ],
  [
    'timkindberg/jest-when',
    'jest-when',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jest-when',
    { '2019-11': TRIAL, '2020-10': ADOPT },
  ],
  [
    'fastify/fastify',
    'Fastify',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/fastify',
    { '2020-10': TRIAL },
  ],
  [
    'immerjs/immer',
    'Immer',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/immer',
    { '2019-04': ASSESS, '2020-10': TRIAL },
  ],
  [
    'facebook/immutable-js',
    'Immutable.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/immutable-js',
    { '2016-04': ASSESS, '2016-11': TRIAL },
  ],
  [
    'single-spa/single-spa',
    'single-spa',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/single-spa',
    { '2017-11': ASSESS, '2020-10': TRIAL },
  ],
  [
    'Microsoft/TypeScript',
    'TypeScript',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/typescript',
    {
      '2014-01': ASSESS,
      '2014-07': ASSESS,
      '2018-11': TRIAL,
      '2019-04': ADOPT,
    },
  ],
  [
    'BabylonJS/Babylon.js',
    'Babylon.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/babylon-js',
    { '2020-10': ASSESS },
  ],
  [
    'facebook/hermes',
    'Hermes',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/hermes',
    { '2020-10': ASSESS },
  ],
  [
    'gcanti/io-ts',
    'io-ts',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/io-ts',
    { '2020-10': ASSESS },
  ],
  [
    'Polymer/lit-element',
    'LitElement',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/litelement',
    { '2020-10': ASSESS },
  ],
  [
    'mswjs/msw',
    'Mock Service Worker',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/mock-service-worker',
    { '2020-10': ASSESS },
  ],
  [
    'vercel/swr',
    'SWR',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
    { '2020-10': ASSESS },
  ],
  [
    'yarnpkg/yarn',
    'Yarn',
    'https://www.thoughtworks.com/radar/tools/yarn',
    {
      '2017-03': ASSESS,
      '2017-11': ASSESS,
      '2018-03': TRIAL,
      '2020-10': TRIAL,
    },
  ],
  [
    'npm/cli',
    'NPM for all the things',
    'https://www.thoughtworks.com/radar/techniques/npm-for-all-the-things',
    { '2015-11': TRIAL, '2016-04': TRIAL },
  ],
  [
    'garris/backstopjs',
    'BackstopJS',
    'https://www.thoughtworks.com/radar/tools/backstopjs',
    { '2018-05': TRIAL },
  ],
  [
    'oblador/loki',
    'Loki',
    'https://www.thoughtworks.com/radar/tools/loki',
    { '2019-11': TRIAL },
  ],
  [
    'tailwindlabs/tailwindcss',
    'Tailwind CSS',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/tailwind-css',
    { '2020-05': ASSESS },
  ],
  [
    'DevExpress/testcafe',
    'TestCafe',
    'https://www.thoughtworks.com/radar/tools/testcafe',
    { '2018-11': ASSESS, '2019-04': TRIAL },
  ],
  [
    'cypress-io/cypress',
    'Cypress',
    'https://www.thoughtworks.com/radar/tools/cypress',
    {
      '2017-11': ASSESS,
      '2018-05': ASSESS,
      '2018-11': TRIAL,
      '2019-04': ADOPT,
      '2020-05': ADOPT,
    },
  ],
  [
    'puppeteer/puppeteer',
    'Puppeteer',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/puppeteer',
    { '2018-11': ASSESS, '2019-04': TRIAL },
  ],
  [
    'getsentry/sentry',
    'Sentry',
    'https://www.thoughtworks.com/radar/tools/sentry',
    { '2018-05': ASSESS, '2020-10': TRIAL },
  ],
  [
    'styled-components/styled-components',
    'Styled components',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/styled-components',
    { '2019-11': TRIAL },
  ],
  [
    'snowpackjs/snowpack',
    'Snowpack',
    'https://www.thoughtworks.com/radar/tools/snowpack',
    { '2020-05': ASSESS },
  ],
  [
    'styleguidist/react-styleguidist',
    'React Styleguidist',
    'https://www.thoughtworks.com/radar/tools/react-styleguidist',
    { '2019-11': ADOPT },
  ],
  [
    'pnpm/pnpm',
    'pnpm',
    'https://www.thoughtworks.com/radar/tools/pnpm',
    { '2020-10': ASSESS },
  ],
  [
    'Microsoft/playwright',
    'Playwright',
    'https://www.thoughtworks.com/radar/tools/playwright',
    { '2020-10': ASSESS },
  ],
  [
    'parcel-bundler/parcel',
    'Parcel',
    'https://www.thoughtworks.com/radar/tools/parcel',
    { '2018-05': ASSESS },
  ],
  [
    'webpack/webpack',
    'Webpack',
    'https://www.thoughtworks.com/radar/tools/webpack',
    { '2016-04': TRIAL, '2016-11': TRIAL },
  ],
  [
    'prettier/prettier',
    'Prettier',
    'https://www.thoughtworks.com/radar/tools/prettier',
    { '2018-11': TRIAL },
  ],
  [
    'Netflix/pollyjs',
    'Polly.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/polly-js',
    { '2018-11': ASSESS },
  ],
  [
    'nestjs/nest',
    'NestJS',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/nestjs',
    {
      '2019-11': ASSESS,
      '2020-05': TRIAL,
    },
  ],
  [
    'bbyars/mountebank',
    'Mountebank',
    'https://www.thoughtworks.com/radar/tools/mountebank',
    {
      '2014-07': ASSESS,
      '2015-01': ASSESS,
      '2015-05': ADOPT,
      '2015-11': ADOPT,
    },
  ],
  [
    'uber/manifold',
    'Manifold',
    'https://www.thoughtworks.com/radar/tools/manifold',
    { '2020-05': ASSESS },
  ],
  [
    'knsv/mermaid',
    'Mermaid',
    'https://www.thoughtworks.com/radar/tools/mermaid',
    { '2018-11': TRIAL },
  ],
  [
    'laconiajs/laconia',
    'Laconia',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/laconia',
    { '2019-04': TRIAL },
  ],
  [
    'facebook/jscodeshift',
    'jscodeshift',
    'https://www.thoughtworks.com/radar/tools/jscodeshift',
    { '2020-10': TRIAL },
  ],
  [
    'gatsbyjs/gatsby',
    'Gatsby.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/gatsby-js',
    { '2019-11': ASSESS },
  ],
  [
    'sideway/joi',
    'joi',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/joi',
    { '2019-04': TRIAL },
  ],
  [
    'jorgebucaran/hyperapp',
    'Hyperapp',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/hyperapp',
    { '2018-05': ASSESS },
  ],
  [
    'formium/formik',
    'Formik',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/formik',
    { '2019-04': TRIAL },
  ],
  [
    'flowtype/flow-bin',
    'Flow',
    'https://www.thoughtworks.com/radar/tools/flow',
    { '2017-11': ASSESS, '2018-05': ASSESS },
  ],
  [
    '11ty/eleventy',
    'Eleventy',
    'https://www.thoughtworks.com/radar/tools/eleventy',
    { '2020-10': ASSESS },
  ],
  [
    'eslint/eslint',
    'ESLint',
    'https://www.thoughtworks.com/radar/tools/eslint',
    { '2019-11': ADOPT },
  ],
  [
    'clinicjs/node-clinic-bubbleprof-examples',
    'Clinic.js Bubbleprof',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/clinic-js-bubbleprof',
    { '2020-05': ASSESS },
  ],
  [
    'commitizen/cz-cli',
    'Commitizen',
    'https://www.thoughtworks.com/radar/tools/commitizen',
    { '2019-11': ADOPT },
  ],
  [
    'avajs/ava',
    'AVA',
    'https://www.thoughtworks.com/radar/tools/ava',
    { '2019-04': TRIAL },
  ],
];

export const repoToTechRadarMap = libs.reduce(
  (accum, [repo, alias, link, data]) => {
    accum[repo] = { repo, alias, link, data };
    return accum;
  },
  {} as Record<string, TechRadarT>
);
