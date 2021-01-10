const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [HOLD, ASSESS, TRIAL, ADOPT];

const libs: {
  name: string;
  link: string;
  data: { [key: string]: TRadarLevelT };
}[] = [
  {
    name: 'vue',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/vue-js',
    data: { '2016-11': ASSESS, '2017-03': TRIAL, '2020-05': ADOPT },
  },
  {
    name: 'react',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/react-js',
    data: {
      '2015-01': ASSESS,
      '2015-05': TRIAL,
      '2015-11': TRIAL,
      '2016-04': ADOPT,
      '2016-11': ADOPT,
    },
  },
  {
    name: 'svelte',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/svelte',
    data: { '2020-10': ASSESS },
  },
  {
    name: '@angular/core',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/angular',
    data: { '2017-03': ASSESS, '2017-11': TRIAL },
  },
  {
    name: 'angular',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/angularjs',
    data: {
      '2014-07': TRIAL,
      '2015-01': TRIAL,
      '2016-04': ASSESS,
      '2016-11': HOLD,
      '2017-03': HOLD,
    },
  },
  {
    name: 'ember-source',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/ember-js',
    data: {
      '2015-05': ASSESS,
      '2015-11': ASSESS,
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
    },
  },
  {
    name: 'redux',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/redux',
    data: {
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
      '2020-10': TRIAL,
    },
  },
  {
    name: 'recoil',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/recoil',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'xstate',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/xstate',
    data: { '2020-05': ASSESS, '2020-10': TRIAL },
  },
  {
    name: '@testing-library/react',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/react-testing-library',
    data: { '2019-04': ASSESS, '2019-11': TRIAL, '2020-05': ADOPT },
  },
  {
    name: '@testing-library/vue',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/testing-library',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'enzyme',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/enzyme',
    data: {
      '2016-11': TRIAL,
      '2017-03': TRIAL,
      '2018-05': ADOPT,
      '2019-11': HOLD,
      '2020-05': HOLD,
    },
  },
  {
    name: 'jest',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/jest',
    data: { '2017-11': TRIAL },
  },
  {
    name: 'jest-when',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/jest-when',
    data: { '2019-11': TRIAL, '2020-10': ADOPT },
  },
  {
    name: 'fastify',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/fastify',
    data: { '2020-10': TRIAL },
  },
  {
    name: 'immer',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/immer',
    data: { '2019-04': ASSESS, '2020-10': TRIAL },
  },
  {
    name: 'immutable',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/immutable-js',
    data: { '2016-04': ASSESS, '2016-11': TRIAL },
  },
  {
    name: 'single-spa',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/single-spa',
    data: { '2017-11': ASSESS, '2020-10': TRIAL },
  },
  {
    name: 'typescript',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/typescript',
    data: {
      '2014-01': ASSESS,
      '2014-07': ASSESS,
      '2018-11': TRIAL,
      '2019-04': ADOPT,
    },
  },
  {
    name: 'babylonjs',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/babylon-js',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'hermes-engine',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/hermes',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'io-ts',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/io-ts',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'lit-element',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/litelement',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'msw',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/mock-service-worker',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'swr',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
    data: { '2020-10': ASSESS },
  },
  {
    name: '@testing-library/react-native',
    link: 'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'yarn',
    link: 'https://www.thoughtworks.com/radar/tools/yarn',
    data: {
      '2017-03': ASSESS,
      '2017-11': ASSESS,
      '2018-03': TRIAL,
      '2020-10': TRIAL,
    },
  },
  {
    name: 'npm',
    link:
      'https://www.thoughtworks.com/radar/techniques/npm-for-all-the-things',
    data: { '2015-11': TRIAL, '2016-04': TRIAL },
  },
  {
    name: 'backstopjs',
    link: 'https://www.thoughtworks.com/radar/tools/backstopjs',
    data: { '2018-05': TRIAL },
  },
  {
    name: 'loki',
    link: 'https://www.thoughtworks.com/radar/tools/loki',
    data: { '2019-11': TRIAL },
  },
  {
    name: 'tailwindcss',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/tailwind-css',
    data: { '2020-05': ASSESS },
  },
  {
    name: 'testcafe',
    link: 'https://www.thoughtworks.com/radar/tools/testcafe',
    data: { '2018-11': ASSESS, '2019-04': TRIAL },
  },
  {
    name: 'cypress',
    link: 'https://www.thoughtworks.com/radar/tools/cypress',
    data: {
      '2017-11': ASSESS,
      '2018-05': ASSESS,
      '2018-11': TRIAL,
      '2019-04': ADOPT,
      '2020-05': ADOPT,
    },
  },
  {
    name: 'puppeteer',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/puppeteer',
    data: { '2018-11': ASSESS, '2019-04': TRIAL },
  },
  {
    name: '@sentry/core',
    link: 'https://www.thoughtworks.com/radar/tools/sentry',
    data: { '2018-05': ASSESS, '2020-10': TRIAL },
  },
  {
    name: 'styled-components',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/styled-components',
    data: { '2019-11': TRIAL },
  },
  {
    name: 'snowpack',
    link: 'https://www.thoughtworks.com/radar/tools/snowpack',
    data: { '2020-05': ASSESS },
  },
  {
    name: 'react-styleguidist',
    link: 'https://www.thoughtworks.com/radar/tools/react-styleguidist',
    data: { '2019-11': ADOPT },
  },
  {
    name: 'pnpm',
    link: 'https://www.thoughtworks.com/radar/tools/pnpm',
    data: { '2020-10': ASSESS },
  },
  {
    name: 'playwright',
    link: 'https://www.thoughtworks.com/radar/tools/playwright',
    data: { '2020-10': ASSESS },
  },
  {
    name: '@parcel/core',
    link: 'https://www.thoughtworks.com/radar/tools/parcel',
    data: { '2018-05': ASSESS },
  },
  {
    name: 'parcel',
    link: 'https://www.thoughtworks.com/radar/tools/parcel',
    data: { '2018-05': ASSESS },
  },
  {
    name: 'webpack',
    link: 'https://www.thoughtworks.com/radar/tools/webpack',
    data: { '2016-04': TRIAL, '2016-11': TRIAL },
  },
  {
    name: 'prettier',
    link: 'https://www.thoughtworks.com/radar/tools/prettier',
    data: { '2018-11': TRIAL },
  },
  {
    name: '@pollyjs/core',
    link:
      'https://www.thoughtworks.com/radar/languages-and-frameworks/polly-js',
    data: { '2018-11': ASSESS },
  },
];

export const libsToDatadMap = libs.reduce((accum, lib) => {
  accum[lib.name] = lib.data;
  return accum;
}, {} as Record<string, Record<string, TRadarLevelT>>);
