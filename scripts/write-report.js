/* eslint-disable */
const fs = require('fs');
const fetch = require('/Users/alexey/.nvm/versions/node/v14.15.0/lib/node_modules/node-fetch');

const catalog = fs.readFileSync(
  '../src/components/developer-usage/stateof-js-css-data.json',
  'utf8'
);
const catalogItems = JSON.parse(catalog);

const libs = [
  ['gatsbyjs/gatsby', 'gatsby'],
  ['vercel/next.js', 'next'],
  ['nuxt/nuxt.js', 'nuxt'],
  ['sveltejs/sapper', 'sapper'],
  ['11ty/eleventy', '@11ty/eleventy'],
  ['hexojs/hexo', 'hexo'],
  ['facebook/docusaurus', '@docusaurus/core'],
  ['vuejs/vuepress', 'vuepress'],
  ['docsifyjs/docsify', 'docsify'],
  ['umijs/umi', 'umi'],
  ['react-static/react-static', 'react-static'],
  ['gridsome/gridsome', 'gridsome'],
];

// fetchLastMonthStars
// fetchLastQuarterStars
// fetchGithubOther
// fetchNpmAll
// fetchBundleSize

Promise.all(libs.map(([repo, pkg]) => fetchLastMonthStars(repo, pkg)))
  .then((data) => {
    console.log(JSON.stringify(data));
    // console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

// Show ThoughtWorks Tech Radar Data
// (() => {
//   const techRadarLibs = getTechradarLibs();
//   const data = libs
//     .map(([repo]) =>
//       techRadarLibs.find(([radarRepo]) => repo.toLowerCase() === radarRepo)
//     )
//     .filter(Boolean)
//     .reduce((acc, [repo, url, level]) => {
//       acc[repo] = { url, level };
//       return acc;
//     }, {});
//   console.log(JSON.stringify(data));
// })();

// Show DevUsage Data
// (() => {
//   const data = libs
//     .map(([repo]) =>
//       catalogItems.find(
//         ({ repoId }) => repo.toLowerCase() === repoId.toLowerCase()
//       )
//     )
//     .filter(Boolean)
//     .reduce((acc, { repoId, usage }) => {
//       const usage2020 = usage.slice(-1)[0].year === 2020 ? usage.pop() : null;
//       if (usage2020) {
//         acc[repoId.toLowerCase()] = usage2020.value;
//       }
//       return acc;
//     }, {});
//   console.log(JSON.stringify(data));
// })();

// fetchGoogleTrends(libs.map(([repo]) => repo))
//   .then((data) => {
//     const val = data.reduce((acc, { repo, trend }) => {
//       acc[repo] = trend;
//       return acc;
//     }, {});
//     console.log(JSON.stringify(val));
//   })
//   .catch((err) => console.log(err));

// Check repos for new names
// Promise.all(libs.map(([repoId]) => fetchRepoRealName(repoId)))
//   .then((data) => {
//     console.log(
//       data.filter((item) => item.old.toLowerCase() !== item.new.toLowerCase())
//     );
//   })
//   .catch((err) => {
//     console.log(err);
//   });

async function fetchLastMonthStars(repo) {
  // github stars new
  const response = await fetch(`http://127.0.0.1:8787/?repo=${repo}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw response;
  }

  const { items, totalCount } = await response.json();

  return { repo, march: items[0].stars, april: items[1].stars, totalCount };
}

async function fetchLastQuarterStars(repo) {
  const response = await fetch(
    `https://github-stars.moiva.workers.dev/?repo=${repo}`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    throw response;
  }

  const { items } = await response.json();
  const last = items.slice(-3);

  if (
    last[0].month !== '2021-01' ||
    last[1].month !== '2021-02' ||
    last[2].month !== '2021-03'
  ) {
    throw new Error('wrong month');
  }

  return { repo, items: last };
}

async function fetchGithubOther(repo) {
  const [github, contributors, commits] = await Promise.all([
    fetchIssues(repo),
    fetchContributors(repo),
    fetchCommits(repo),
  ]);

  return { repo, github, contributors, commits };
}

async function fetchNpmAll(repo, pkg) {
  const [npmDetails, npmReleases, npmDownloads] = await Promise.all([
    fetchNpmDetails(pkg),
    fetchNpmReleases(pkg),
    fetchNpmDownloads(pkg),
  ]);

  return { repo, pkg, npmDetails, npmReleases, npmDownloads };
}

async function fetchIssues(repo) {
  const response = await fetch(
    `https://github.moiva.workers.dev/?repo=${repo}`,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();

  return data;
}

async function fetchContributors(repo) {
  const response = await fetch(
    `https://github-contributors.moiva.workers.dev/?repo=${repo}`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    throw response;
  }

  const { items } = await response.json();

  return items.pop();
}

async function fetchCommits(repo) {
  const response = await fetch(
    `https://github-commits.moiva.workers.dev/?repo=${repo}`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    throw response;
  }

  const { items } = await response.json();

  return items
    .filter(({ week }) => {
      const date = new Date(week * 1000);
      const month = date.getUTCMonth();
      const year = date.getUTCFullYear();
      return year === 2021 && month !== 3;
    })
    .map(({ total }) => total)
    .reduce((sum, a) => sum + a, 0);
}

async function fetchNpmDetails(pkg) {
  const response = await fetch(`https://moiva.io/npm-info/${pkg}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();

  return data;
}

async function fetchNpmReleases(pkg) {
  const response = await fetch(
    `https://npm-releases.moiva.workers.dev/?pkg=${pkg}`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    throw response;
  }

  const { items } = await response.json();

  const lastQuarter = items.pop();

  if (lastQuarter.month !== '2021-03') {
    throw new Error('Wrong Release Quarter');
  }

  return lastQuarter.releases;
}

async function fetchNpmDownloads(pkg) {
  const response = await fetch(
    `https://npm-downloads.moiva.workers.dev/?pkg=${pkg}`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    throw response;
  }

  const { items } = await response.json();

  return items.filter(({ month }) => {
    return [
      '2020-10',
      '2020-11',
      '2020-12',
      '2021-01',
      '2021-02',
      '2021-03',
    ].includes(month);
  });
}

async function fetchBundleSize(repo, pkg) {
  const response = await fetch(
    `https://bundle-size.moiva.workers.dev/?pkg=${pkg}`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { repo, bundleSize: null };
    }
    throw response;
  }

  const bundleSize = await response.json();

  return { repo, bundleSize };
}

async function fetchGoogleTrends(repos) {
  const filteredRepos = getGTrendsRepos(repos).slice(0, 5);
  const reposStr = filteredRepos.join(',');
  const response = await fetch(
    `https://google-trends.moiva.workers.dev/?libs=${reposStr}&start=2020-10-01`,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    throw response;
  }

  const trends = await response.json();

  return filteredRepos.map((repo, i) => ({ repo, trend: trends.averages[i] }));
}

// USE REAL TOKEN
async function fetchRepoRealName(oldRepoId) {
  const response = await fetch(`http://api.github.com/repos/${oldRepoId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token <TOKEN>',
    },
  });
  if (!response.ok) {
    console.error('ERR', oldRepoId, response.status);
    if (response.status === 404 || response.status === 451) {
      return false;
    }
    throw response;
  }

  const { full_name } = await response.json();

  return { old: oldRepoId, new: full_name };
}

function getTechradarLibs() {
  return [
    [
      'vuejs/vue',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/vue-js',
      'ADOPT',
    ],
    [
      'facebook/react',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/react-js',
      'ADOPT',
    ],
    [
      'sveltejs/svelte',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/svelte',
      'ASSESS',
    ],
    [
      'angular/angular',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/angular',
      'TRIAL',
    ],
    [
      'angular/angular.js',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/angularjs',
      'HOLD',
    ],
    [
      'emberjs/ember.js',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/ember-js',
      'ADOPT',
    ],
    [
      'reduxjs/redux',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/redux',
      'TRIAL',
    ],
    [
      'facebookexperimental/recoil',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/recoil',
      'ASSESS',
    ],
    [
      'davidkpiano/xstate',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/xstate',
      'TRIAL',
    ],
    [
      'testing-library/react-testing-library',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/react-testing-library',
      'ADOPT',
    ],
    [
      'enzymejs/enzyme',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/enzyme',
      'HOLD',
    ],
    [
      'facebook/jest',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/jest',
      'TRIAL',
    ],
    [
      'timkindberg/jest-when',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/jest-when',
      'ADOPT',
    ],
    [
      'fastify/fastify',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/fastify',
      'TRIAL',
    ],
    [
      'immerjs/immer',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/immer',
      'TRIAL',
    ],
    [
      'immutable-js/immutable-js',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/immutable-js',
      'TRIAL',
    ],
    [
      'single-spa/single-spa',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/single-spa',
      'TRIAL',
    ],
    [
      'Microsoft/TypeScript',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/typescript',
      'ADOPT',
    ],
    [
      'BabylonJS/Babylon.js',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/babylon-js',
      'ASSESS',
    ],
    [
      'facebook/hermes',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/hermes',
      'ASSESS',
    ],
    [
      'gcanti/io-ts',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/io-ts',
      'ASSESS',
    ],
    [
      'Polymer/lit-element',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/litelement',
      `ASSESS`,
    ],
    [
      'mswjs/msw',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/mock-service-worker',
      `ASSESS`,
    ],
    [
      'vercel/swr',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/swr',
      `ASSESS`,
    ],
    ['yarnpkg/yarn', 'https://www.thoughtworks.com/radar/tools/yarn', `TRIAL`],
    [
      'npm/cli',
      'https://www.thoughtworks.com/radar/techniques/npm-for-all-the-things',
      'TRIAL',
    ],
    [
      'garris/backstopjs',
      'https://www.thoughtworks.com/radar/tools/backstopjs',
      'TRIAL',
    ],
    ['oblador/loki', 'https://www.thoughtworks.com/radar/tools/loki', 'TRIAL'],
    [
      'tailwindlabs/tailwindcss',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/tailwind-css',
      'ASSESS',
    ],
    [
      'DevExpress/testcafe',
      'https://www.thoughtworks.com/radar/tools/testcafe',
      'TRIAL',
    ],
    [
      'cypress-io/cypress',
      'https://www.thoughtworks.com/radar/tools/cypress',
      'ADOPT',
    ],
    [
      'puppeteer/puppeteer',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/puppeteer',
      'TRIAL',
    ],
    [
      'getsentry/sentry',
      'https://www.thoughtworks.com/radar/tools/sentry',
      'TRIAL',
    ],
    [
      'styled-components/styled-components',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/styled-components',
      'TRIAL',
    ],
    [
      'snowpackjs/snowpack',
      'https://www.thoughtworks.com/radar/tools/snowpack',
      'ASSESS',
    ],
    [
      'styleguidist/react-styleguidist',
      'https://www.thoughtworks.com/radar/tools/react-styleguidist',
      'ADOPT',
    ],
    ['pnpm/pnpm', 'https://www.thoughtworks.com/radar/tools/pnpm', 'ASSESS'],
    [
      'Microsoft/playwright',
      'https://www.thoughtworks.com/radar/tools/playwright',
      'ASSESS',
    ],
    [
      'parcel-bundler/parcel',
      'https://www.thoughtworks.com/radar/tools/parcel',
      'ASSESS',
    ],
    [
      'webpack/webpack',
      'https://www.thoughtworks.com/radar/tools/webpack',
      'TRIAL',
    ],
    [
      'prettier/prettier',
      'https://www.thoughtworks.com/radar/tools/prettier',
      'TRIAL',
    ],
    [
      'Netflix/pollyjs',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/polly-js',
      'ASSESS',
    ],
    [
      'nestjs/nest',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/nestjs',
      'TRIAL',
    ],
    [
      'bbyars/mountebank',
      'https://www.thoughtworks.com/radar/tools/mountebank',
      'ADOPT',
    ],
    [
      'uber/manifold',
      'https://www.thoughtworks.com/radar/tools/manifold',
      'ASSESS',
    ],
    [
      'mermaid-js/mermaid',
      'https://www.thoughtworks.com/radar/tools/mermaid',
      'TRIAL',
    ],
    [
      'laconiajs/laconia',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/laconia',
      'TRIAL',
    ],
    [
      'facebook/jscodeshift',
      'https://www.thoughtworks.com/radar/tools/jscodeshift',
      'TRIAL',
    ],
    [
      'gatsbyjs/gatsby',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/gatsby-js',
      'ASSESS',
    ],
    [
      'sideway/joi',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/joi',
      'TRIAL',
    ],
    [
      'jorgebucaran/hyperapp',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/hyperapp',
      'ASSESS',
    ],
    [
      'formium/formik',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/formik',
      'TRIAL',
    ],
    [
      'flowtype/flow-bin',
      'https://www.thoughtworks.com/radar/tools/flow',
      'ASSESS',
    ],
    [
      '11ty/eleventy',
      'https://www.thoughtworks.com/radar/tools/eleventy',
      'ASSESS',
    ],
    [
      'eslint/eslint',
      'https://www.thoughtworks.com/radar/tools/eslint',
      'ADOPT',
    ],
    [
      'clinicjs/node-clinic-bubbleprof-examples',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/clinic-js-bubbleprof',
      'ASSESS',
    ],
    [
      'commitizen/cz-cli',
      'https://www.thoughtworks.com/radar/tools/commitizen',
      'ADOPT',
    ],
    ['avajs/ava', 'https://www.thoughtworks.com/radar/tools/ava', 'TRIAL'],
    [
      'vercel/next.js',
      'https://www.thoughtworks.com/radar/languages-and-frameworks/next-js',
      'ASSESS',
    ],
  ];
}

function getGTrendsRepos(repos) {
  const gtrendsDefs = [
    ['vuejs/vue', '/g/11c0vmgx5d', 'Vue.js'], // Vue.js; type: Topic
    ['facebook/react', '/m/012l1vxv'], // Vue.js; type: Topic
    ['angular/angular', '/g/11c6w0ddw9'], // Angular; type: Web framework
    ['reduxjs/redux', '/g/11dxf0gf92'], // Redux; type: JavaScript library
    ['vuetifyjs/vuetify', 'vuetify'],
    ['twbs/bootstrap', '/m/0j671ln'],
    ['moment/moment', 'moment js', 'Moment js'],
    ['lodash/lodash', 'lodash'],
    ['jashkenas/underscore', '/m/0ndwxg_', 'Underscore.js'],
    ['chartjs/chart.js', '/g/11fqctpc5j'],
    ['d3/d3', '/m/0k2kwt4', 'D3.js'],
    ['highcharts/highcharts', '/g/11bv3xdz92'],
    ['puppeteer/puppeteer', 'puppeteer'],
    ['cypress-io/cypress', 'cypress'],
    ['nestjs/nest', 'nestjs', 'nestjs'],
    ['expressjs/express', '/m/0_v2szx', 'Express.js'],
    ['mde/ejs', 'ejs'],
    ['seleniumhq/selenium', '/m/0c828v', 'Selenium'],
    ['webpack/webpack', '/g/11clg_kyfc', 'Webpack'],
    ['eslint/eslint', '/g/11fm79ww5w', 'ESLint'],
    ['microsoft/typescript', '/m/0n50hxv', 'TypeScript'],
    ['facebook/jest', '/g/11h03gh9zq', 'Jest'],
    ['vercel/next.js', 'next js', 'next js'],
    ['flutter/flutter', '/g/11f03_rzbg', 'Flutter'],
    ['facebook/react-native', '/g/11h03gfxy9', 'React Native'],
    ['ionic-team/ionic-framework', '/g/1q6l_n0n0', 'Ionic'],
    ['mui-org/material-ui', 'material ui', 'material ui'],
    ['websockets/ws', 'ws'],
    ['reactivex/rxjs', 'rxjs'],
    ['vuejs/vuex', 'vuex'],
    ['mobxjs/mobx', 'mobx'],
    ['cucumber/cucumber-js', '/m/0c4z18h'],
    ['mochajs/mocha', 'Mocha'],
    ['jasmine/jasmine', 'jasmine'],
    ['sinonjs/sinon', 'sinon'],
    ['gatsbyjs/gatsby', 'gatsby'],
    ['nuxt/nuxt.js', '/g/11g0wgnhgc', 'Nuxt.js'],
  ];

  return repos.filter((repo) =>
    gtrendsDefs.find(
      ([gTrendRepo]) => gTrendRepo.toLowerCase() === repo.toLowerCase()
    )
  );
}
