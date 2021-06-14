// @ts-ignore
const techRadarItems = require('./techradar.json');
const googleTrendsItems = require('./google-trends.json');
const libs = require('./_libraries-full.json');
const libsReposIds = libs.map((lib) => lib.repoId);

describe('ThoughtWorks Radar', () => {
  it('repos names match Catalog', () => {
    // @ts-ignore
    techRadarItems.forEach((item) => {
      expect(libsReposIds).toContain(item[0]);
    });
  });
});

describe('Google Trends', () => {
  it('repos names match Catalog', () => {
    // @ts-ignore
    googleTrendsItems.forEach((item) => {
      expect(libsReposIds).toContain(item[0]);
    });
  });
});
