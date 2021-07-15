import techRadarItems from './techradar.json';
import googleTrendsItems from './google-trends.json';
import readingsItems from './readings.json';
import stateofjsItems from './stateofjscss.json';
import { catalogLibraries, CatalogLibraryT } from './index';

// @ts-ignore
const libsReposIds = catalogLibraries.map((lib) => lib.repoId);

describe('ThoughtWorks Radar', () => {
  it('repos names match Catalog', () => {
    // List of TechRadar Items exceptions that are not part of Catalog (no npm package)
    const exceptionsWithoutNpm = [
      'laravel/laravel',
      'getsentry/sentry',
      'pnpm/pnpm',
      'uber/manifold',
      'backstage/backstage',
      'materializeinc/materialize',
      'apache/incubator-pinot',
      'linkedin/datahub',
      'juicedata/juicefs',
      'opstrace/opstrace',
      'vectorizedio/redpanda',
      'facebook/flipper',
      'k6io/k6',
      'mlflow/mlflow',
      'google/or-tools',
      'toniblyx/prowler',
      'microsoft/pyright',
      'getredash/redash',
      'gruntwork-io/terratest',
      'oracle/graal',
      'hashicorp/boundary',
      'imgcook/imgcook',
      'clojure/clojurescript',
      'longhorn/longhorn',
      'yelp/detect-secrets',
      'zalando/zally',
      'square/leakcanary',
      'awslabs/aws-data-wrangler',
      'tiangolo/fastapi',
      'streamlit/streamlit',
      'bunit-dev/bunit',
      'dagster-io/dagster',
      'lvgl/lvgl',
      'online-ml/river',
    ];

    techRadarItems.forEach((item) => {
      if (!exceptionsWithoutNpm.includes(item[0] as string)) {
        expect(libsReposIds).toContain(item[0]);
      }
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

describe('Catalog libraries', () => {
  it('libs have the same fields', () => {
    catalogLibraries.forEach((lib) => {
      const props = Object.entries(lib);
      const propsNames = props.map((p) => p[0]);
      expect(propsNames.length).toBe(8);
      expect(propsNames).toContain('id');
      expect(propsNames).toContain('category');
      expect(propsNames).toContain('repoId');
      expect(propsNames).toContain('npm');
      expect(propsNames).toContain('isNpmCoreArtifact');
      expect(propsNames).toContain('alias');
      expect(propsNames).toContain('tags');
      expect(propsNames).toContain('framework');
    });
  });

  it('Contain No duplicates', () => {
    const duplicates = getDuplicates(catalogLibraries);
    expect(duplicates).toEqual([]);
  });

  it('Use correct frameworks', () => {
    const frameworks = [
      ...new Set(catalogLibraries.map(({ framework }) => framework)),
    ];
    const allowedFrameworks = [
      null,
      'react',
      'vue',
      'svelte',
      'ember',
      'angular',
      'angularjs',
    ];

    frameworks.forEach(expect(allowedFrameworks).toContain);
  });

  it('all repos lowercase', () => {
    catalogLibraries
      .map((lib) => lib.repoId)
      .forEach((repoId) => expect(repoId).toBe(repoId.toLowerCase()));
  });

  it.todo('sitemap is generated for each entry');
});

function getDuplicates(libs: CatalogLibraryT[]) {
  const libsNpmNames = libs
    .map(({ npm }) => npm)
    .filter((npm) => !!npm) as string[];
  const libsReposIds = libs
    .filter(({ npm }) => !npm)
    .map(({ repoId }) => repoId);
  const libsAliases = libs.map(({ alias }) => alias);
  const duplicates = [];

  duplicates.push(
    ...getDuplicatesGeneric(libsNpmNames),
    ...getDuplicatesGeneric(libsReposIds),
    ...getDuplicatesGeneric(libsAliases)
  );

  return duplicates;
}

function getDuplicatesGeneric(items: string[]) {
  const duplicates: string[] = [];

  if (new Set(items).size < items.length) {
    const itemsMap = {} as Record<string, boolean>;

    items.forEach((item) => {
      if (itemsMap[item]) {
        duplicates.push(item);
        return;
      }
      itemsMap[item] = true;
    });
  }

  return duplicates;
}
