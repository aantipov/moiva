const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [HOLD, ASSESS, TRIAL, ADOPT];

export type DateT =
  | '2014-01'
  | '2014-07'
  | '2015-01'
  | '2015-05'
  | '2015-11'
  | '2016-04'
  | '2016-11'
  | '2017-03'
  | '2017-11'
  | '2018-05'
  | '2018-03'
  | '2018-11'
  | '2019-04'
  | '2019-11'
  | '2020-05'
  | '2020-10'
  | '2021-04';

type RepoNameT = string;
type AliasT = string;
type LinkT = string;
type DataT = Partial<{ [key in DateT]: TRadarLevelT }>;

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
    'enzymejs/enzyme',
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
    'immutable-js/immutable-js',
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
    'microsoft/typescript',
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
    'babylonjs/babylon.js',
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
    { '2020-10': ASSESS, '2021-04': TRIAL },
  ],
  [
    'polymer/lit-element',
    'LitElement',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/litelement',
    { '2020-10': ASSESS, '2021-04': TRIAL },
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
    { '2020-10': ASSESS, '2021-04': TRIAL },
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
    'devexpress/testcafe',
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
    { '2018-05': ASSESS, '2020-10': TRIAL, '2021-04': ADOPT },
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
    'microsoft/playwright',
    'Playwright',
    'https://www.thoughtworks.com/radar/tools/playwright',
    { '2020-10': ASSESS, '2021-04': TRIAL },
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
    'netflix/pollyjs',
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
    'mermaid-js/mermaid',
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
  [
    'vercel/next.js',
    'Next.js',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/next-js',
    { '2019-04': ASSESS, '2021-04': TRIAL },
  ],
  [
    'backstage/backstage',
    'Backstage',
    'https://www.thoughtworks.com/radar/platforms/backstage',
    { '2020-10': ASSESS, '2021-04': TRIAL },
  ],
  [
    'MaterializeInc/materialize',
    'Materialize',
    'https://www.thoughtworks.com/radar/platforms/materialize',
    { '2020-10': ASSESS, '2021-04': TRIAL },
  ],
  [
    'apache/incubator-pinot',
    'Apache Pinot',
    'https://www.thoughtworks.com/radar/platforms/apache-pinot',
    { '2021-04': ASSESS },
  ],
  [
    'teambit/bit',
    'Bit.dev',
    'https://www.thoughtworks.com/radar/platforms/bit-dev',
    { '2021-04': ASSESS },
  ],
  [
    'linkedin/datahub',
    'DataHub',
    'https://www.thoughtworks.com/radar/platforms/datahub',
    { '2021-04': ASSESS },
  ],
  [
    'juicedata/juicefs',
    'JuiceFS',
    'https://www.thoughtworks.com/radar/platforms/juicefs',
    { '2021-04': ASSESS },
  ],
  [
    'opstrace/opstrace',
    'Opstrace',
    'https://www.thoughtworks.com/radar/platforms/opstrace',
    { '2021-04': ASSESS },
  ],
  [
    'pulumi/pulumi',
    'Pulumi',
    'https://www.thoughtworks.com/radar/platforms/pulumi',
    { '2018-11': ASSESS, '2020-10': ASSESS, '2021-04': ASSESS },
  ],
  [
    'vectorizedio/redpanda',
    'Redpanda',
    'https://www.thoughtworks.com/radar/platforms/redpanda',
    { '2021-04': ASSESS },
  ],
  [
    'dequelabs/axe-core',
    'axe-core',
    'https://www.thoughtworks.com/radar/tools/axe-core',
    { '2021-04': TRIAL },
  ],
  [
    'evanw/esbuild',
    'esbuild',
    'https://www.thoughtworks.com/radar/tools/esbuild',
    { '2021-04': TRIAL },
  ],
  [
    'facebook/flipper',
    'Flipper',
    'https://www.thoughtworks.com/radar/tools/flipper',
    { '2021-04': TRIAL },
  ],
  [
    'k6io/k6',
    'k6',
    'https://www.thoughtworks.com/radar/tools/k6',
    { '2020-10': ASSESS, '2021-04': TRIAL },
  ],
  [
    'mlflow/mlflow',
    'MLflow',
    'https://www.thoughtworks.com/radar/tools/mlflow',
    { '2020-10': TRIAL, '2021-04': TRIAL },
  ],
  [
    'google/or-tools',
    'OR-Tools',
    'https://www.thoughtworks.com/radar/tools/or-tools',
    { '2021-04': TRIAL },
  ],
  [
    'toniblyx/prowler',
    'Prowler',
    'https://www.thoughtworks.com/radar/tools/prowler',
    { '2021-04': TRIAL },
  ],
  [
    'Microsoft/pyright',
    'Pyright',
    'https://www.thoughtworks.com/radar/tools/pyright',
    { '2021-04': TRIAL },
  ],
  [
    'getredash/redash',
    'Redash',
    'https://www.thoughtworks.com/radar/tools/redash',
    { '2021-04': TRIAL },
  ],
  [
    'gruntwork-io/terratest',
    'Terratest',
    'https://www.thoughtworks.com/radar/tools/terratest',
    { '2019-11': ASSESS, '2021-04': TRIAL },
  ],
  [
    'welldone-software/why-did-you-render',
    'Why Did You Render',
    'https://www.thoughtworks.com/radar/tools/why-did-you-render',
    { '2021-04': TRIAL },
  ],
  [
    'oracle/graal',
    'Graal Native Image',
    'https://www.thoughtworks.com/radar/tools/graal-native-image',
    { '2021-04': ASSESS },
  ],
  [
    'hashicorp/boundary',
    'HashiCorp Boundary',
    'https://www.thoughtworks.com/radar/tools/hashicorp-boundary',
    { '2021-04': ASSESS },
  ],
  [
    'imgcook/imgcook',
    'imgcook',
    'https://www.thoughtworks.com/radar/tools/imgcook',
    { '2021-04': ASSESS },
  ],
  [
    'longhorn/longhorn',
    'Longhorn',
    'https://www.thoughtworks.com/radar/tools/longhorn',
    { '2021-04': ASSESS },
  ],
  [
    'stoplightio/spectral',
    'Spectral',
    'https://www.thoughtworks.com/radar/tools/spectral',
    { '2021-04': ASSESS },
  ],
  [
    'Yelp/detect-secrets',
    'Yelp detect-secrets',
    'https://www.thoughtworks.com/radar/tools/yelp-detect-secrets',
    { '2021-04': ASSESS },
  ],
  [
    'zalando/zally',
    'Zally',
    'https://www.thoughtworks.com/radar/tools/zally',
    { '2021-04': ASSESS },
  ],
  [
    'square/leakcanary',
    'LeakCanary',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/leakcanary',
    { '2017-11': ASSESS, '2021-04': ADOPT },
  ],
  [
    'testing-library/angular-testing-library',
    'Angular Testing Library',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/angular-testing-library',
    { '2021-04': TRIAL },
  ],
  [
    'awslabs/aws-data-wrangler',
    'AWS Data Wrangler',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/aws-data-wrangler',
    { '2021-04': TRIAL },
  ],
  [
    'tiangolo/fastapi',
    'FastAPI',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/fastapi',
    { '2021-04': TRIAL },
  ],
  [
    'streamlit/streamlit',
    'Streamlit',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/streamlit',
    { '2021-04': TRIAL },
  ],
  [
    'egil/bUnit',
    'bUnit',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/bunit',
    { '2021-04': ASSESS },
  ],
  [
    'dagster-io/dagster',
    'Dagster',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/dagster',
    { '2021-04': ASSESS },
  ],
  [
    'flutter/flutter',
    'Flutter',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/flutter',
    { '2018-05': ASSESS, '2018-11': ASSESS, '2019-11': TRIAL },
  ],
  [
    'pmndrs/jotai',
    'Jotai',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jotai-and-zustand',
    { '2021-04': ASSESS },
  ],
  [
    'pmndrs/zustand',
    'Zustand',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/jotai-and-zustand',
    { '2021-04': ASSESS },
  ],
  [
    'lvgl/lvgl',
    'LVGL',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/lvgl',
    { '2021-04': ASSESS },
  ],
  [
    'react-hook-form/react-hook-form',
    'React Hook Form',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/react-hook-form',
    { '2021-04': ASSESS },
  ],
  [
    'online-ml/river',
    'River',
    'https://www.thoughtworks.com/radar/languages-and-frameworks/river',
    { '2021-04': ASSESS },
  ],
];

export const repoToTechRadarMap = libs.reduce(
  (accum, [repo, alias, link, data]) => {
    accum[repo] = { repo, alias, link, data };
    return accum;
  },
  {} as Record<string, TechRadarT>
);
