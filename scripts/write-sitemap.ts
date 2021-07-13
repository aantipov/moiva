/** WRITE SITEMAP.XML */

export {};

interface LibT {
  category: string;
  repoId: string;
  npm: string | null;
  isNpmCoreArtifact: boolean | null;
  alias: string | null;
  framework: string | null;
}

interface CatT {
  categoryName: string;
  skipSitemap?: boolean;
  libs: LibT[];
}

const decoder = new TextDecoder('utf-8');
const libraries = JSON.parse(
  decoder.decode(Deno.readFileSync('./src/data/libraries.json'))
) as LibT[];
// Temporarily filter out non-npm libs because we don't have enough data for SEO there
const npmLibraries = libraries.filter((lib) => !!lib.npm);

const oneLibUrls = npmLibraries.map((lib) => {
  if (lib.npm) {
    return `https://moiva.io/?npm=${lib.npm}`;
  }

  return `https://moiva.io/?github=${lib.repoId}`;
});

const npmCategoriesObj = npmLibraries.reduce((acc, lib) => {
  if (!acc[lib.category]) {
    acc[lib.category] = { categoryName: lib.category, libs: [] };
    if (lib.category === 'Unit-Testing Libraries') {
      acc[lib.category].skipSitemap = true;
    }
  }
  acc[lib.category].libs.push(lib);

  return acc;
}, {} as Record<string, CatT>);
const npmCategories = Object.values(npmCategoriesObj);

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
    <loc>https://moiva.io/blog/2021-07-update-new-metric-status/</loc>
    <lastmod>2021-07-06</lastmod>
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

try {
  Deno.writeTextFileSync('public/sitemap.xml', content);
  console.log('Sitemap generated successfully');
} catch (err) {
  console.log(err);
}

function sortLibsByNpmGithub(libA: LibT, libB: LibT) {
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

function getLibsUrl(libA: LibT, libB: LibT) {
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
