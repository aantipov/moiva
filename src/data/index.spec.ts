import { describe, it, expect } from 'vitest';
import techRadarItems from './techradar.json';
import googleTrendsItems from './google-trends.json';
import readingsItems from './readings.json';
import stateofjsItems from './stateofjscss.json';
import { allCatalogLibraries as catalogLibraries } from './index';

// @ts-ignore
const libsNpmNames = catalogLibraries.map((lib) => lib.npm);
const libsReposIds = catalogLibraries.map((lib) => lib.repoId);

describe('ThoughtWorks Radar', () => {
  it('npm names match Catalog', () => {
    // List of TechRadar Items exceptions that are not part of Catalog (no npm package)
    techRadarItems.forEach((item) => {
        expect(libsNpmNames).toContain(item[0]);
    });
  });
});

describe('Google Trends', () => {
  it('repos names match Catalog', () => {
    // List of Google Trends Items exceptions that are not part of Catalog (no npm package)
    const exceptionsWithoutNpm = ['laravel/laravel', 'django/django'];

    googleTrendsItems.forEach((item) => {
      if (!exceptionsWithoutNpm.includes(item[0] as string)) {
        expect(libsReposIds).toContain(item[0]);
      }
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

  it.todo('npm names match catalog');
});

describe('StateOfJS', () => {
  it('repos names match Catalog', () => {
    // List of StateOfJS Items exceptions that are not part of Catalog (no npm package).
    const exceptions = [
      'clojure/clojurescript',
      'elm/compiler',
      'graphql/graphql-spec',
      'meteor/meteor',
      'purescript/purescript',
      'reasonml/reason',
      'sass/node-sass',
    ];
    stateofjsItems.forEach((item) => {
      if (!exceptions.includes(item.repoId)) {
        expect(libsReposIds).toContain(item.repoId);
      }
    });
  });
});
