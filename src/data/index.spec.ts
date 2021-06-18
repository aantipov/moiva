const techRadarItems = require('./techradar.json'); // eslint-disable-line
const googleTrendsItems = require('./google-trends.json'); // eslint-disable-line
const readingsItems = require('./readings.json'); // eslint-disable-line
const stateofjsItems = require('./stateofjscss.json'); // eslint-disable-line
const libs = require('./_libraries-full.json'); // eslint-disable-line
// @ts-ignore
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

describe('Readings', () => {
  it('repos names match Catalog', () => {
    // @ts-ignore
    readingsItems.forEach((item) => {
      // @ts-ignore
      item.repos.forEach((repoId) => {
        expect(libsReposIds).toContain(repoId);
      });
    });
  });
});

describe('StateOfJS', () => {
  it('repos names match Catalog', () => {
    // @ts-ignore
    stateofjsItems.forEach((item) => {
      expect(libsReposIds).toContain(item.repoId);
    });
  });
});
