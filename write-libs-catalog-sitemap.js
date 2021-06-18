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

const categories = categoriesRaw.map(({ name, skipSitemap, items }) => ({
  categoryName: name,
  skipSitemap,
  libs: items
    .filter((item) => !item.exclude)
    .map(
      ({
        repo,
        npm,
        isNpmCoreArtifact = true,
        framework,
        alias,
        isLegacy,
      }) => ({
        category: name,
        alias: alias || getAliasFromRepoId(repo),
        repoId: repo,
        npm: npm ?? null,
        isNpmCoreArtifact: npm ? isNpmCoreArtifact : null,
        framework: framework ?? null,
        isLegacy: !!isLegacy,
      })
    ),
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
function generateCatalogStr(full = false) {
  let str = '';

  categories.forEach((cat, catIndex) => {
    cat.libs.forEach((lib, libIndex) => {
      if (!full && lib.category === 'misc' && lib.npm === null) {
        return;
      }
      const alias = lib.alias && `"${lib.alias}"`;
      const framework = lib.framework && `"${lib.framework}"`;
      const npm = lib.npm && `"${lib.npm}"`;
      str += `  {
    "category": "${lib.category}",
    "repoId": "${lib.repoId.toLowerCase()}",
    "npm": ${npm},
    "isNpmCoreArtifact": ${lib.isNpmCoreArtifact},
    "alias": ${alias},
    "framework": ${framework},
    "isLegacy": ${lib.isLegacy}
  }`;

      if (
        catIndex !== categories.length - 1 ||
        libIndex !== cat.libs.length - 1
      ) {
        str += `,\n`;
      }
    });
  });

  return `[
${str}
]
`;
}

// Write Libraries catalog file
fs.writeFile('src/data/libraries.json', generateCatalogStr(), (err) => {
  if (err) return console.log(err);
  console.log('Libraries catalog generated successfully');
});

fs.writeFile(
  'src/data/_libraries-full.json',
  generateCatalogStr(true),
  (err) => {
    if (err) return console.log(err);
    console.log('Libraries catalog generated successfully');
  }
);

/**
 * GENERATE SITEMAP.XML
 */

// Temporarily filter out non-npm libs because we don't have enough data for SEO there
const npmCategories = categories.map((cat) => ({
  ...cat,
  libs: cat.libs.filter((lib) => !!lib.npm),
}));

const oneLibUrls = npmCategories
  .map((cat) => cat.libs)
  .flat()
  .map((lib) => {
    if (lib.npm) {
      return `https://moiva.io/?npm=${lib.npm}`;
    }

    return `https://moiva.io/?github=${lib.repoId}`;
  });

// Generate urls consisting of pairs of libs from the same category:
// - framework specific can be paired with the same framework specific
// - framework specific can be paired with framework agnostic
// - framework specific can not be paired with other framework specific
// - framework agnostic can be paired with anything

const twoLibsUrls = npmCategories
  .map((cat) => {
    // skip Misc category
    if (cat.categoryName === 'misc' || cat.skipSitemap) {
      return [];
    }

    const libsSorted = cat.libs.sort(sortLibsByNpmGithub);
    const categoryPairsUrls = [];

    for (let i = 0; i < libsSorted.length - 1; i++) {
      const frameworkI = libsSorted[i].framework;
      for (let j = i + 1; j < libsSorted.length; j++) {
        const frameworkJ = libsSorted[j].framework;
        if (!frameworkI || !frameworkJ || frameworkI === frameworkJ) {
          categoryPairsUrls.push(getLibsUrl(libsSorted[i], libsSorted[j]));
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
    <lastmod>2021-06-04</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`
  );
}, '');

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moiva.io</loc>
    <lastmod>2021-06-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://moiva.io/catalog/</loc>
    <lastmod>2021-06-04</lastmod>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://moiva.io/blog/</loc>
    <lastmod>2021-06-10</lastmod>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-06-update-improved-table-view-seo-fixes/</loc>
    <lastmod>2021-06-10</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-05-update/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/the-missing-migration-guide-from-vue-cli-to-vite/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-end-to-end-testing-frameworks/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-js-jamstack/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-js-build-tools-bundlers/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-js-testing-libraries/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-state-management/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-state-of-js-frameworks/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-04-update-github-stars-chart/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/vercel-serverless-functions-vs-cloudflare-workers/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-03-update-migration-to-cloudflare-workers/</loc>
    <lastmod>2021-06-04</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/universal-tool-to-evaluate-discover-compare-software/</loc>
    <lastmod>2021-06-04</lastmod>
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

function sortLibsByNpmGithub(libA, libB) {
  // both have npm
  if (libA.npm && libB.npm) {
    if (libA.npm < libB.npm) {
      return -1;
    }
    if (libA.npm > libB.npm) {
      return 1;
    }
    return 0;
  }

  // only one has npm
  if (libA.npm && !libB.npm) {
    return -1;
  }

  if (!libA.npm && libB.npm) {
    return 1;
  }

  // both don't have npm
  if (libA.repoId < libB.repoId) {
    return -1;
  }
  if (libA.repoId > libB.repoId) {
    return 1;
  }
  return 0;
}

function getLibsUrl(libA, libB) {
  if (libA.npm && libB.npm) {
    return `https://moiva.io/?npm=${libA.npm}+${libB.npm}`;
  }
  if (libA.npm && !libB.npm) {
    return `https://moiva.io/?npm=${libA.npm}&amp;github=${libB.repoId}`;
  }
  if (!libA.npm && libB.npm) {
    return `https://moiva.io/?npm=${libB.npm}&amp;github=${libA.repoId}`;
  }
  return `https://moiva.io/?github=${libA.repoId}+${libB.repoId}`;
}
