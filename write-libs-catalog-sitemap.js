/* eslint-disable */
fs = require('fs');

const files = fs.readdirSync('../moiva-catalog/catalog');

const categoriesRaw = files.map((file) =>
  JSON.parse(fs.readFileSync('../moiva-catalog/catalog/' + file, 'utf8'))
);

/**
 * Get Alias using the alias from the catalog or repository's name
 *
 */
function getAliasFromRepoId(repoId) {
  const [, repoName] = repoId.split('/');

  // Capitalise normal names
  if (
    repoName.length > 2 &&
    !repoName.includes('@') &&
    !repoName.includes('/') &&
    !repoName.includes('-')
  ) {
    return repoName.charAt(0).toUpperCase() + repoName.slice(1);
  }

  return repoName;
}

const categories = categoriesRaw.map(({ name, items }) => ({
  categoryName: name,
  libs: items.map(({ repo, npm, isNpmCoreArtifact, framework, alias }) => ({
    category: name,
    alias: alias || getAliasFromRepoId(repo),
    repoId: repo,
    npm: npm ?? null,
    isNpmAByProduct:
      typeof isNpmCoreArtifact === 'boolean' ? !isNpmCoreArtifact : null,
    framework: framework ?? null,
  })),
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
    const alias = lib.alias && `'${lib.alias}'`;
    const framework = lib.framework && `'${lib.framework}'`;
    const npm = lib.npm && `'${lib.npm}'`;
    str += `  { category: '${lib.category}', repoId: '${lib.repoId}', npm: ${npm}, isNpmAByProduct: ${lib.isNpmAByProduct}, alias: ${alias}, framework: ${framework} },\n`;
  });
});

const resStr = `export interface CatalogLibraryT {
  repoId: string;
  category: string;
  alias: string;
  npm?: string | null;
  isNpmAByProduct?: boolean | null;
  framework: string | null;
}

// prettier-ignore
const libraries: CatalogLibraryT[] = [${str}];


export const catalogRepoIdToLib = libraries.reduce((acc, lib) => {
  acc[lib.repoId] = lib;
  return acc;
}, {} as Record<string, CatalogLibraryT>);

// For use by npm-package api to return the correct repo for the npm package
export const catalogNpmToLib = libraries.reduce((acc, lib) => {
  if (lib.npm) {
    acc[lib.npm] = lib;
  }
  return acc;
}, {} as Record<string, CatalogLibraryT>);

export const catalogReposIdsByCategory = libraries.reduce(
  (acc, { repoId, category }) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(repoId);

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
  .map((lib) => `https://moiva.io/?npm=${lib.npm}`);

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
            `https://moiva.io/?npm=${libsSorted[i].npm}+${libsSorted[j].npm}`
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
    <lastmod>2021-03-13</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`
  );
}, '');

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moiva.io/blog</loc>
    <lastmod>2021-03-08</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-03-update-migration-to-cloudflare-workers</loc>
    <lastmod>2021-03-08</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/universal-tool-to-evaluate-discover-compare-software</loc>
    <lastmod>2021-02-17</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/</loc>
    <lastmod>2021-03-13</lastmod>
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
  // TODO: improve this logic
  const libs = categories.map(({ libs }) => libs).flat();
  const libsNpmNames = libs.map(({ npm }) => npm).filter((npm) => !!npm);
  const libsReposIds = libs.map(({ repoId }) => repoId);
  const libsAliases = libs.map(({ alias }) => alias);
  const duplicates = [];

  duplicates.push(
    ...getDuplicatesGeneric(libsNpmNames),
    ...getDuplicatesGeneric(libsReposIds),
    ...getDuplicatesGeneric(libsAliases)
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
