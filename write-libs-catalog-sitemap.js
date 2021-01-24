/* eslint-disable */
fs = require('fs');

const data = [
  require('../moiva-catalog/catalog/frontend-frameworks'),
  require('../moiva-catalog/catalog/html-templating-engines'),
  require('../moiva-catalog/catalog/date-utilities'),
  require('../moiva-catalog/catalog/utilities'),
  require('../moiva-catalog/catalog/e2e-testing'),
  require('../moiva-catalog/catalog/web-sockets'),
  require('../moiva-catalog/catalog/node-frameworks'),
  require('../moiva-catalog/catalog/node-logging'),
  require('../moiva-catalog/catalog/css-frameworks'),
  require('../moiva-catalog/catalog/charts'),
  require('../moiva-catalog/catalog/vue-component-libraries'),
  require('../moiva-catalog/catalog/react-component-libraries'),
  require('../moiva-catalog/catalog/react-document-head-tags'),
  require('../moiva-catalog/catalog/state'),
  require('../moiva-catalog/catalog/api-mocks'),
  require('../moiva-catalog/catalog/aws-lambda-frameworks'),
  require('../moiva-catalog/catalog/web-components'),
  require('../moiva-catalog/catalog/visual-regression'),
  require('../moiva-catalog/catalog/static-site-generators'),
  require('../moiva-catalog/catalog/object-schema-validation'),
  require('../moiva-catalog/catalog/immutability'),
  require('../moiva-catalog/catalog/runtime-types-checks'),
  require('../moiva-catalog/catalog/react-native-android'),
  require('../moiva-catalog/catalog/graphql-clients'),
  require('../moiva-catalog/catalog/react-forms'),
  require('../moiva-catalog/catalog/static-types-checking'),
  require('../moiva-catalog/catalog/react-unit-testing'),
  require('../moiva-catalog/catalog/lint-prettify'),
  require('../moiva-catalog/catalog/css-in-js'),
  require('../moiva-catalog/catalog/node-monitoring'),
  require('../moiva-catalog/catalog/3D'),
  require('../moiva-catalog/catalog/unit-tests-runner'),
  require('../moiva-catalog/catalog/ui-dev-env'),
  require('../moiva-catalog/catalog/build-tools'),
  require('../moiva-catalog/catalog/node-runners'),
  require('../moiva-catalog/catalog/select-autocomplete'),
  require('../moiva-catalog/catalog/react-dates'),
  require('../moiva-catalog/catalog/misc'),
];

const categories = data.map((catObj) => ({
  categoryName: catObj.name,
  libs: catObj.items.map((pkg) => {
    const libCatalogData = Array.isArray(pkg) ? pkg : new Array(pkg);

    return {
      name: libCatalogData[0],
      category: catObj.name,
      seoAlias: libCatalogData[1] || null,
      framework: libCatalogData[2] || null,
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
    str += `  ['${lib.name}', '${lib.category}', ${seoAlias}, ${framework}],\n`;
  });
});

const resStr = `const libraries: [string, string, string | null, string | null][] = [${str}];

interface CatalogLibraryT {
  name: string;
  category: string;
  seoAlias: string | null;
  framework: string | null;
}

export const catalogLibsByName = libraries.reduce(
  (acc, [name, category, seoAlias, framework]) => {
    acc[name] = { name, category, seoAlias, framework };
    return acc;
  },
  {} as Record<string, CatalogLibraryT>
);

export const libsNamesByCategory = libraries.reduce(
  (acc, [libName, category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(libName);

    return acc;
  },
  {} as Record<string, string[]>
);
`;

// Generate Libraries catalog
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
  .map((lib) => `https://moiva.io/?compare=${lib.name}`);

// Generate urls consisting of pairs of libs from the same category:
// framework specific can be paired with the same framework specific
// framework specific can be paired with framework agnostic
// framework specific can not be paired with other framework specific
// framework agnostic can be paired with anything
function sortLibsByName(libA, libB) {
  if (libA.name < libB.name) {
    return -1;
  }
  if (libA.name > libB.name) {
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

    const libsSorted = cat.libs.sort(sortLibsByName);
    const categoryPairsUrls = [];

    for (let i = 0; i < libsSorted.length - 1; i++) {
      const frameworkI = libsSorted[i].framework;
      for (let j = i + 1; j < libsSorted.length; j++) {
        const frameworkJ = libsSorted[j].framework;
        if (!frameworkI || !frameworkJ || frameworkI === frameworkJ) {
          categoryPairsUrls.push(
            `https://moiva.io/?compare=${libsSorted[i].name}+${libsSorted[j].name}`
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
  const libsNames = libs.map(({ name }) => name);
  const libsAliases = libs
    .map(({ seoAlias }) => seoAlias)
    .filter((alias) => alias);
  const duplicates = [];

  duplicates.push(
    ...getDuplicatesGeneric(libsNames),
    ...getDuplicatesGeneric(libsAliases),
    // Add conflicts between aliases and names
    ...libsAliases.filter((alias) => libsNames.includes(alias))
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
  ];

  return frameworks.filter(
    (framework) => !allowedFrameworks.includes(framework)
  );
}
