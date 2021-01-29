const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [HOLD, ASSESS, TRIAL, ADOPT];

type RepoNameT = string;
type LinkT = string;
interface DataT {
  [key: string]: TRadarLevelT;
}

const libs: [RepoNameT, LinkT, DataT][] = [
  [
    'vuejs/vue',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/vue-js',
    { '2016-11': ASSESS, '2017-03': TRIAL, '2020-05': ADOPT },
  ],
  [
    'facebook/react',
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
    'https://www.thoughtworks.com/radar/languages-and-frameworks/svelte',
    { '2020-10': ASSESS },
  ],
  [
    'angular/angular',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/angular',
    { '2017-03': ASSESS, '2017-11': TRIAL },
  ],
  [
    'angular/angular.js',
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
    'https://www.thoughtworks.com/radar/languages-and-frameworks/recoil',
    { '2020-10': ASSESS },
  ],
  [
    'davidkpiano/xstate',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/xstate',
    { '2020-05': ASSESS, '2020-10': TRIAL },
  ],
  [
    'testing-library/react-testing-library',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/react-testing-library',
    { '2019-04': ASSESS, '2019-11': TRIAL, '2020-05': ADOPT },
  ],
  [
    'airbnb/enzyme',
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
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jest',
    { '2017-11': TRIAL },
  ],
  [
    'timkindberg/jest-when',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jest-when',
    { '2019-11': TRIAL, '2020-10': ADOPT },
  ],
  [
    'fastify/fastify',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/fastify',
    { '2020-10': TRIAL },
  ],
  [
    'immerjs/immer',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/immer',
    { '2019-04': ASSESS, '2020-10': TRIAL },
  ],
  [
    'facebook/immutable-js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/immutable-js',
    { '2016-04': ASSESS, '2016-11': TRIAL },
  ],
  [
    'single-spa/single-spa',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/single-spa',
    { '2017-11': ASSESS, '2020-10': TRIAL },
  ],
  [
    'Microsoft/TypeScript',
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
    'https://www.thoughtworks.com/radar/languages-and-frameworks/babylon-js',
    { '2020-10': ASSESS },
  ],
  [
    'facebook/hermes',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/hermes',
    { '2020-10': ASSESS },
  ],
  [
    'gcanti/io-ts',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/io-ts',
    { '2020-10': ASSESS },
  ],
  [
    'Polymer/lit-element',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/litelement',
    { '2020-10': ASSESS },
  ],
  [
    'mswjs/msw',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/mock-service-worker',
    { '2020-10': ASSESS },
  ],
  [
    'vercel/swr',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
    { '2020-10': ASSESS },
  ],
  [
    'yarnpkg/yarn',
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
    'https://www.thoughtworks.com/radar/techniques/npm-for-all-the-things',
    { '2015-11': TRIAL, '2016-04': TRIAL },
  ],
  [
    'garris/backstopjs',
    'https://www.thoughtworks.com/radar/tools/backstopjs',
    { '2018-05': TRIAL },
  ],
  [
    'oblador/loki',
    'https://www.thoughtworks.com/radar/tools/loki',
    { '2019-11': TRIAL },
  ],
  [
    'tailwindlabs/tailwindcss',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/tailwind-css',
    { '2020-05': ASSESS },
  ],
  [
    'DevExpress/testcafe',
    'https://www.thoughtworks.com/radar/tools/testcafe',
    { '2018-11': ASSESS, '2019-04': TRIAL },
  ],
  [
    'cypress-io/cypress',
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
    'https://www.thoughtworks.com/radar/languages-and-frameworks/puppeteer',
    { '2018-11': ASSESS, '2019-04': TRIAL },
  ],
  [
    'getsentry/sentry',
    'https://www.thoughtworks.com/radar/tools/sentry',
    { '2018-05': ASSESS, '2020-10': TRIAL },
  ],
  [
    'styled-components/styled-components',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/styled-components',
    { '2019-11': TRIAL },
  ],
  [
    'snowpackjs/snowpack',
    'https://www.thoughtworks.com/radar/tools/snowpack',
    { '2020-05': ASSESS },
  ],
  [
    'styleguidist/react-styleguidist',
    'https://www.thoughtworks.com/radar/tools/react-styleguidist',
    { '2019-11': ADOPT },
  ],
  [
    'pnpm/pnpm',
    'https://www.thoughtworks.com/radar/tools/pnpm',
    { '2020-10': ASSESS },
  ],
  [
    'Microsoft/playwright',
    'https://www.thoughtworks.com/radar/tools/playwright',
    { '2020-10': ASSESS },
  ],
  [
    'parcel-bundler/parcel',
    'https://www.thoughtworks.com/radar/tools/parcel',
    { '2018-05': ASSESS },
  ],
  [
    'webpack/webpack',
    'https://www.thoughtworks.com/radar/tools/webpack',
    { '2016-04': TRIAL, '2016-11': TRIAL },
  ],
  [
    'prettier/prettier',
    'https://www.thoughtworks.com/radar/tools/prettier',
    { '2018-11': TRIAL },
  ],
  [
    'Netflix/pollyjs',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/polly-js',
    { '2018-11': ASSESS },
  ],
  [
    'nestjs/nest',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/nestjs',
    {
      '2019-11': ASSESS,
      '2020-05': TRIAL,
    },
  ],
  [
    'bbyars/mountebank',
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
    'https://www.thoughtworks.com/radar/tools/manifold',
    { '2020-05': ASSESS },
  ],
  [
    'knsv/mermaid',
    'https://www.thoughtworks.com/radar/tools/mermaid',
    { '2018-11': TRIAL },
  ],
  [
    'laconiajs/laconia',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/laconia',
    { '2019-04': TRIAL },
  ],
  [
    'facebook/jscodeshift',
    'https://www.thoughtworks.com/radar/tools/jscodeshift',
    { '2020-10': TRIAL },
  ],
  [
    'gatsbyjs/gatsby',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/gatsby-js',
    { '2019-11': ASSESS },
  ],
  [
    'sideway/joi',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/joi',
    { '2019-04': TRIAL },
  ],
  [
    'jorgebucaran/hyperapp',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/hyperapp',
    { '2018-05': ASSESS },
  ],
  [
    'formium/formik',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/formik',
    { '2019-04': TRIAL },
  ],
  [
    'flowtype/flow-bin',
    'https://www.thoughtworks.com/radar/tools/flow',
    { '2017-11': ASSESS, '2018-05': ASSESS },
  ],
  [
    '11ty/eleventy',
    'https://www.thoughtworks.com/radar/tools/eleventy',
    { '2020-10': ASSESS },
  ],
  [
    'eslint/eslint',
    'https://www.thoughtworks.com/radar/tools/eslint',
    { '2019-11': ADOPT },
  ],
  [
    'clinicjs/node-clinic-bubbleprof-examples',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/clinic-js-bubbleprof',
    { '2020-05': ASSESS },
  ],
  [
    'commitizen/cz-cli',
    'https://www.thoughtworks.com/radar/tools/commitizen',
    { '2019-11': ADOPT },
  ],
  [
    'avajs/ava',
    'https://www.thoughtworks.com/radar/tools/ava',
    { '2019-04': TRIAL },
  ],
];

export const libsToDatadMap = libs.reduce((accum, [name, , data]) => {
  accum[name] = data;
  return accum;
}, {} as Record<string, Record<string, TRadarLevelT>>);

export const libsToLinkMap = libs.reduce((accum, [name, link]) => {
  accum[name] = link;
  return accum;
}, {} as Record<string, string>);
