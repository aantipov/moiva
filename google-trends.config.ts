type RepoIdT = string;
type KeywordT = string;
type KeywordAliasT = string; // To display on the chart. If not provided, then RepoName is used

const gtrendsDefs: [RepoIdT, KeywordT, KeywordAliasT?][] = [
  ['vuejs/vue', '/g/11c0vmgx5d', 'Vue.js'], // Vue.js; type: Topic
  ['facebook/react', '/m/012l1vxv'], // Vue.js; type: Topic
  ['angular/angular', '/g/11c6w0ddw9'], // Angular; type: Web framework
  ['reduxjs/redux', '/g/11dxf0gf92'], // Redux; type: JavaScript library
  ['vuetifyjs/vuetify', 'vuetify'],
  ['twbs/bootstrap', '/m/0j671ln'],
  ['moment/moment', 'moment js', 'Moment js'],
  ['lodash/lodash', 'lodash'],
  ['jashkenas/underscore', '/m/0ndwxg_', 'Underscore.js'],
  ['chartjs/Chart.js', '/g/11fqctpc5j'],
  ['d3/d3', '/m/0k2kwt4', 'D3.js'],
  ['highcharts/highcharts', '/g/11bv3xdz92'],
  ['puppeteer/puppeteer', 'puppeteer'],
  ['cypress-io/cypress', 'cypress'],
  ['nestjs/nest', 'nestjs', 'nestjs'],
  ['expressjs/express', '/m/0_v2szx', 'Express.js'],
  ['mde/ejs', 'ejs'],
  ['websockets/ws', 'ws'],
];

export interface GTrendDefT {
  repoId: string;
  keyword: string;
  alias: string;
}

export const repoToGTrendDefMap = gtrendsDefs.reduce(
  (accum, [repoId, keyword, keywordAlias]) => {
    accum[repoId] = {
      repoId,
      keyword,
      alias: capitalise(keywordAlias || repoId.slice(repoId.indexOf('/') + 1)),
    };
    return accum;
  },
  {} as Record<string, GTrendDefT>
);

function capitalise(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}
