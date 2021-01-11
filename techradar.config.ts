const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [HOLD, ASSESS, TRIAL, ADOPT];

type NameT = string;
type LinkT = string;
interface DataT {
  [key: string]: TRadarLevelT;
}

const libs: [NameT, LinkT, DataT][] = [
  [
    'vue',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/vue-js',
    { '2016-11': ASSESS, '2017-03': TRIAL, '2020-05': ADOPT },
  ],
  [
    'react',
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
    'svelte',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/svelte',
    { '2020-10': ASSESS },
  ],
  [
    '@angular/core',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/angular',
    { '2017-03': ASSESS, '2017-11': TRIAL },
  ],
  [
    'angular',
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
    'ember-source',
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
    'redux',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/redux',
    {
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
      '2020-10': TRIAL,
    },
  ],
  [
    'recoil',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/recoil',
    { '2020-10': ASSESS },
  ],
  [
    'xstate',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/xstate',
    { '2020-05': ASSESS, '2020-10': TRIAL },
  ],
  [
    '@testing-library/react',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/react-testing-library',
    { '2019-04': ASSESS, '2019-11': TRIAL, '2020-05': ADOPT },
  ],
  [
    '@testing-library/vue',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/testing-library',
    { '2020-10': ASSESS },
  ],
  [
    'enzyme',
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
    'jest',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jest',
    { '2017-11': TRIAL },
  ],
  [
    'jest-when',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jest-when',
    { '2019-11': TRIAL, '2020-10': ADOPT },
  ],
  [
    'fastify',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/fastify',
    { '2020-10': TRIAL },
  ],
  [
    'immer',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/immer',
    { '2019-04': ASSESS, '2020-10': TRIAL },
  ],
  [
    'immutable',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/immutable-js',
    { '2016-04': ASSESS, '2016-11': TRIAL },
  ],
  [
    'single-spa',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/single-spa',
    { '2017-11': ASSESS, '2020-10': TRIAL },
  ],
  [
    'typescript',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/typescript',
    {
      '2014-01': ASSESS,
      '2014-07': ASSESS,
      '2018-11': TRIAL,
      '2019-04': ADOPT,
    },
  ],
  [
    'babylonjs',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/babylon-js',
    { '2020-10': ASSESS },
  ],
  [
    'hermes-engine',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/hermes',
    { '2020-10': ASSESS },
  ],
  [
    'io-ts',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/io-ts',
    { '2020-10': ASSESS },
  ],
  [
    'lit-element',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/litelement',
    { '2020-10': ASSESS },
  ],
  [
    'msw',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/mock-service-worker',
    { '2020-10': ASSESS },
  ],
  [
    'swr',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
    { '2020-10': ASSESS },
  ],
  [
    '@testing-library/react-native',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
    { '2020-10': ASSESS },
  ],
  [
    'yarn',
    'https://www.thoughtworks.com/radar/tools/yarn',
    {
      '2017-03': ASSESS,
      '2017-11': ASSESS,
      '2018-03': TRIAL,
      '2020-10': TRIAL,
    },
  ],
  [
    'npm',
    'https://www.thoughtworks.com/radar/techniques/npm-for-all-the-things',
    { '2015-11': TRIAL, '2016-04': TRIAL },
  ],
  [
    'backstopjs',
    'https://www.thoughtworks.com/radar/tools/backstopjs',
    { '2018-05': TRIAL },
  ],
  [
    'loki',
    'https://www.thoughtworks.com/radar/tools/loki',
    { '2019-11': TRIAL },
  ],
  [
    'tailwindcss',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/tailwind-css',
    { '2020-05': ASSESS },
  ],
  [
    'testcafe',
    'https://www.thoughtworks.com/radar/tools/testcafe',
    { '2018-11': ASSESS, '2019-04': TRIAL },
  ],
  [
    'cypress',
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
    'puppeteer',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/puppeteer',
    { '2018-11': ASSESS, '2019-04': TRIAL },
  ],
  [
    '@sentry/core',
    'https://www.thoughtworks.com/radar/tools/sentry',
    { '2018-05': ASSESS, '2020-10': TRIAL },
  ],
  [
    'styled-components',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/styled-components',
    { '2019-11': TRIAL },
  ],
  [
    'snowpack',
    'https://www.thoughtworks.com/radar/tools/snowpack',
    { '2020-05': ASSESS },
  ],
  [
    'react-styleguidist',
    'https://www.thoughtworks.com/radar/tools/react-styleguidist',
    { '2019-11': ADOPT },
  ],
  [
    'pnpm',
    'https://www.thoughtworks.com/radar/tools/pnpm',
    { '2020-10': ASSESS },
  ],
  [
    'playwright',
    'https://www.thoughtworks.com/radar/tools/playwright',
    { '2020-10': ASSESS },
  ],
  [
    '@parcel/core',
    'https://www.thoughtworks.com/radar/tools/parcel',
    { '2018-05': ASSESS },
  ],
  [
    'parcel',
    'https://www.thoughtworks.com/radar/tools/parcel',
    { '2018-05': ASSESS },
  ],
  [
    'webpack',
    'https://www.thoughtworks.com/radar/tools/webpack',
    { '2016-04': TRIAL, '2016-11': TRIAL },
  ],
  [
    'prettier',
    'https://www.thoughtworks.com/radar/tools/prettier',
    { '2018-11': TRIAL },
  ],
  [
    '@pollyjs/core',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/polly-js',
    { '2018-11': ASSESS },
  ],
  [
    '@nestjs/core',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/nestjs',
    {
      '2019-11': ASSESS,
      '2020-05': TRIAL,
    },
  ],
  [
    'mountebank',
    'https://www.thoughtworks.com/radar/tools/mountebank',
    {
      '2014-07': ASSESS,
      '2015-01': ASSESS,
      '2015-05': ADOPT,
      '2015-11': ADOPT,
    },
  ],
  [
    '@mlvis/manifold',
    'https://www.thoughtworks.com/radar/tools/manifold',
    { '2020-05': ASSESS },
  ],
  [
    'mermaid',
    'https://www.thoughtworks.com/radar/tools/mermaid',
    { '2018-11': TRIAL },
  ],
  [
    '@laconia/core',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/laconia',
    { '2019-04': TRIAL },
  ],
  [
    'jscodeshift',
    'https://www.thoughtworks.com/radar/tools/jscodeshift',
    { '2020-10': TRIAL },
  ],
  [
    'gatsby',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/gatsby-js',
    { '2019-11': ASSESS },
  ],
  [
    'joi',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/joi',
    { '2019-04': TRIAL },
  ],
  [
    'hyperapp',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/hyperapp',
    { '2018-05': ASSESS },
  ],
  [
    'formik',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/formik',
    { '2019-04': TRIAL },
  ],
  [
    'flow-bin',
    'https://www.thoughtworks.com/radar/tools/flow',
    { '2017-11': ASSESS, '2018-05': ASSESS },
  ],
  [
    '@11ty/eleventy',
    'https://www.thoughtworks.com/radar/tools/eleventy',
    { '2020-10': ASSESS },
  ],
  [
    'eslint',
    'https://www.thoughtworks.com/radar/tools/eslint',
    { '2019-11': ADOPT },
  ],
  [
    'clinic',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/clinic-js-bubbleprof',
    { '2020-05': ASSESS },
  ],
  [
    'commitizen',
    'https://www.thoughtworks.com/radar/tools/commitizen',
    { '2019-11': ADOPT },
  ],
  ['ava', 'https://www.thoughtworks.com/radar/tools/ava', { '2019-04': TRIAL }],
];

export const libsToDatadMap = libs.reduce((accum, [name, _link, data]) => {
  accum[name] = data;
  return accum;
}, {} as Record<string, Record<string, TRadarLevelT>>);
