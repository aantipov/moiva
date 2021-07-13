const techRadarItems = require('./techradar.json'); // eslint-disable-line
const googleTrendsItems = require('./google-trends.json'); // eslint-disable-line
const readingsItems = require('./readings.json'); // eslint-disable-line
const stateofjsItems = require('./stateofjscss.json'); // eslint-disable-line
const libs = require('./libraries.json'); // eslint-disable-line
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

describe('Catalog libraries', () => {
  it.todo('Contain No duplicates');
  // function getDuplicates(categories) {
  //   // TODO: improve this logic
  //   const libs = categories.map(({ libs }) => libs).flat();
  //   const libsNpmNames = libs.map(({ npm }) => npm).filter((npm) => !!npm);
  //   const libsReposIds = libs
  //     .filter(({ npm }) => !npm)
  //     .map(({ repoId }) => repoId);
  //   const libsAliases = libs.map(({ alias }) => alias);
  //   const duplicates = [];

  //   duplicates.push(
  //     ...getDuplicatesGeneric(libsNpmNames),
  //     ...getDuplicatesGeneric(libsReposIds),
  //     ...getDuplicatesGeneric(libsAliases)
  //   );

  //   return duplicates;
  // }

  // function getDuplicatesGeneric(items) {
  //   const duplicates = [];

  //   if (new Set(items).size < items.length) {
  //     const itemsMap = {};

  //     items.forEach((item) => {
  //       if (itemsMap[item]) {
  //         duplicates.push(item);
  //         return;
  //       }
  //       itemsMap[item] = true;
  //     });
  //   }

  //   return duplicates;
  // }
  // const duplicates = getDuplicates(categories);
  // if (duplicates.length) {
  //   console.error(`Duplicate libraries names: ${duplicates.join('; ')}`);
  //   return;
  // }

  it.todo('Use correct frameworks');
  // function getWrongFrameworks(categories) {
  //   const libs = categories.map(({ libs }) => libs).flat();
  //   const frameworks = libs.map(({ framework }) => framework);
  //   const allowedFrameworks = [
  //     null,
  //     'react',
  //     'vue',
  //     'svelte',
  //     'ember',
  //     'angular',
  //     'angularjs',
  //   ];

  //   return frameworks.filter(
  //     (framework) => !allowedFrameworks.includes(framework)
  //   );
  // }
  // const wrongFrameworks = getWrongFrameworks(categories);
  // if (wrongFrameworks.length) {
  //   console.error(`Wrong frameworks found: ${wrongFrameworks.join('; ')}`);
  //   return;
  // }

  it.todo('all repos lowercase - Should or Not?');
});
