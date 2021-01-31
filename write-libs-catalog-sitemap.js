/* eslint-disable */
fs = require('fs');

const data = [
  require('../moiva-catalog/catalog/3D'),
  require('../moiva-catalog/catalog/api-mocks'),
  require('../moiva-catalog/catalog/aws-lambda-frameworks'),
  require('../moiva-catalog/catalog/build-tools'),
  require('../moiva-catalog/catalog/charts'),
  require('../moiva-catalog/catalog/css-frameworks'),
  require('../moiva-catalog/catalog/css-in-js'),
  require('../moiva-catalog/catalog/date-utilities'),
  require('../moiva-catalog/catalog/e2e-testing'),
  require('../moiva-catalog/catalog/frontend-frameworks'),
  require('../moiva-catalog/catalog/graphql-clients'),
  require('../moiva-catalog/catalog/html-templating-engines'),
  require('../moiva-catalog/catalog/immutability'),
  require('../moiva-catalog/catalog/lint-prettify'),
  require('../moiva-catalog/catalog/maps'),
  require('../moiva-catalog/catalog/misc'),
  require('../moiva-catalog/catalog/node-frameworks'),
  require('../moiva-catalog/catalog/node-logging'),
  require('../moiva-catalog/catalog/node-monitoring'),
  require('../moiva-catalog/catalog/node-runners'),
  require('../moiva-catalog/catalog/object-schema-validation'),
  require('../moiva-catalog/catalog/react-component-libraries'),
  require('../moiva-catalog/catalog/react-dates'),
  require('../moiva-catalog/catalog/react-document-head-tags'),
  require('../moiva-catalog/catalog/react-forms'),
  require('../moiva-catalog/catalog/react-fullstack-serverless'),
  require('../moiva-catalog/catalog/react-native-android'),
  require('../moiva-catalog/catalog/react-unit-testing'),
  require('../moiva-catalog/catalog/runtime-types-checks'),
  require('../moiva-catalog/catalog/select-autocomplete'),
  require('../moiva-catalog/catalog/state'),
  require('../moiva-catalog/catalog/static-site-generators'),
  require('../moiva-catalog/catalog/static-types-checking'),
  require('../moiva-catalog/catalog/testing-bdd'),
  require('../moiva-catalog/catalog/ui-dev-env'),
  require('../moiva-catalog/catalog/unit-tests-runner'),
  require('../moiva-catalog/catalog/utilities'),
  require('../moiva-catalog/catalog/visual-regression'),
  require('../moiva-catalog/catalog/vue-component-libraries'),
  require('../moiva-catalog/catalog/web-components'),
  require('../moiva-catalog/catalog/web-sockets'),
];

const categories = data.map((catObj) => ({
  categoryName: catObj.name,
  libs: catObj.items.map((pkg) => {
    const libCatalogData = Array.isArray(pkg) ? pkg : new Array(pkg);

    return {
      npm: libCatalogData[0],
      category: catObj.name,
      repoId: libCatalogData[1] || null,
      seoAlias: libCatalogData[2] || null,
      framework: libCatalogData[3] || null,
    };
  }),
}));

const duplicates = getDuplicates(categories);
if (duplicates.length) {
  console.error(`Duplicate libraries names: ${duplicates.join('; ')}`);
  return;
}

const wrongFrameworks = getWrongFrameworks(categories);
if (wrongFrameworks.length) {
  console.error(`Wrong frameworks found: ${wrongFrameworks.join('; ')}`);
  return;
}

/**
 * GENERATE LIBRARIES CATALOG
 */
let str = '';

categories.forEach((cat) => {
  str += `\n  // ${cat.categoryName}\n`;
  cat.libs.forEach((lib) => {
    const seoAlias = lib.seoAlias && `'${lib.seoAlias}'`;
    const framework = lib.framework && `'${lib.framework}'`;
    str += `  ['${lib.npm}', '${lib.repoId}', '${lib.category}', ${seoAlias}, ${framework}],\n`;
  });
});

const resStr = `const libraries: [string, string, string, string | null, string | null][] = [${str}];

interface CatalogLibraryT {
  npm: string;
  repoId: string;
  category: string;
  seoAlias: string | null;
  framework: string | null;
}

export const catalogRepoIdToLib = libraries.reduce(
  (acc, [npm, repoId, category, seoAlias, framework]) => {
    acc[repoId] = { npm, repoId, category, seoAlias, framework };
    return acc;
  },
  {} as Record<string, CatalogLibraryT>
);

// For use by npm-package api to return the correct repo for the npm package
export const catalogNpmToLib = libraries.reduce(
  (acc, [npm, repoId, category, seoAlias, framework]) => {
    acc[npm] = { npm, repoId, category, seoAlias, framework };
    return acc;
  },
  {} as Record<string, CatalogLibraryT>
);

export const catalogReposIdsByCategory = libraries.reduce(
  (acc, [npm, repoId, category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(repoId);

    return acc;
  },
  {} as Record<string, string[]>
);

export const catalogNpmNamesByCategory = libraries.reduce(
  (acc, [npm, repoId, category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(npm);

    return acc;
  },
  {} as Record<string, string[]>
);
`;

// Write Libraries catalog file
fs.writeFile('src/libraries-catalog.ts', resStr, (err) => {
  if (err) return console.log(err);
  console.log('Libraries catalog generated successfully');
});

/**
 * GENERATE SITEMAP.XML
 */

const oneLibUrls = categories
  .map((cat) => cat.libs)
  .flat()
  .map((lib) => `https://moiva.io/?compare=${lib.npm}`);

// Generate urls consisting of pairs of libs from the same category:
// framework specific can be paired with the same framework specific
// framework specific can be paired with framework agnostic
// framework specific can not be paired with other framework specific
// framework agnostic can be paired with anything
function sortLibsByNpmName(libA, libB) {
  if (libA.npm < libB.npm) {
    return -1;
  }
  if (libA.npm > libB.npm) {
    return 1;
  }
  return 0;
}

const twoLibsUrls = categories
  .map((cat) => {
    // skip Misc category
    if (cat.categoryName === 'misc') {
      return [];
    }

    const libsSorted = cat.libs.sort(sortLibsByNpmName);
    const categoryPairsUrls = [];

    for (let i = 0; i < libsSorted.length - 1; i++) {
      const frameworkI = libsSorted[i].framework;
      for (let j = i + 1; j < libsSorted.length; j++) {
        const frameworkJ = libsSorted[j].framework;
        if (!frameworkI || !frameworkJ || frameworkI === frameworkJ) {
          categoryPairsUrls.push(
            `https://moiva.io/?compare=${libsSorted[i].npm}+${libsSorted[j].npm}`
          );
        }
      }
    }
    return categoryPairsUrls;
  })
  .flat();

const urls = [...oneLibUrls, ...twoLibsUrls].sort();

const urlsStr = urls.reduce((acc, url) => {
  return (
    acc +
    `  <url>
    <loc>${url}</loc>
    <lastmod>2021-01-21</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`
  );
}, '');

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moiva.io/</loc>
    <lastmod>2021-01-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${urlsStr}</urlset>
`;

fs.writeFile('public/sitemap.xml', content, (err) => {
  if (err) return console.log(err);
  console.log('Sitemap generated successfully');
});

function getDuplicates(categories) {
  const libs = categories.map(({ libs }) => libs).flat();
  const libsNpmNames = libs.map(({ npm }) => npm);
  const libsReposIds = libs.map(({ repoId }) => repoId);
  const libsAliases = libs
    .map(({ seoAlias }) => seoAlias)
    .filter((alias) => alias);
  const duplicates = [];

  duplicates.push(
    ...getDuplicatesGeneric(libsNpmNames),
    ...getDuplicatesGeneric(libsReposIds),
    ...getDuplicatesGeneric(libsAliases),
    // Add conflicts between aliases and names
    ...libsAliases.filter((alias) => libsNpmNames.includes(alias))
  );

  return duplicates;
}

function getDuplicatesGeneric(items) {
  const duplicates = [];

  if (new Set(items).size < items.length) {
    const itemsMap = {};

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

function getWrongFrameworks(categories) {
  const libs = categories.map(({ libs }) => libs).flat();
  const frameworks = libs.map(({ framework }) => framework);
  const allowedFrameworks = [
    null,
    'react',
    'vue',
    'svelte',
    'ember',
    'angular',
    'angularjs',
  ];

  return frameworks.filter(
    (framework) => !allowedFrameworks.includes(framework)
  );
}
