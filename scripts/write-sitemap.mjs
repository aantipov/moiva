/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/** WRITE SITEMAP.XML */

const allLibraries = require('../src/data/libraries.json');
const libraries = allLibraries.filter((lib) => !!lib.npm);
const nonMisclibraries = allLibraries.filter(
  (lib) => !!lib.npm && lib.category !== 'misc'
);

const oneLibUrls = libraries.map((lib) => `https://moiva.io/?npm=${lib.npm}`);

const categoriesObj = nonMisclibraries.reduce((acc, lib) => {
  if (!acc[lib.category]) {
    acc[lib.category] = { categoryName: lib.category, libs: [] };
  }
  acc[lib.category].libs.push(lib);

  return acc;
}, {});
const categories = Object.values(categoriesObj);

const twoLibsUrls = categories.reduce((acc, cat) => {
  cat.libs.sort(sortLibsByNpm);

  for (let i = 0; i < cat.libs.length - 1; i++) {
    for (let j = i + 1; j < cat.libs.length; j++) {
      acc.push(`https://moiva.io/?npm=${cat.libs[i].npm}+${cat.libs[j].npm}`);
    }
  }
  return acc;
}, []);

const libsPairs = categories.reduce((acc, cat) => {
  cat.libs.sort(sortLibsByNpm);

  for (let i = 0; i < cat.libs.length - 1; i++) {
    for (let j = i + 1; j < cat.libs.length; j++) {
      acc.push([cat.libs[i].npm, cat.libs[j].npm]);
    }
  }
  return acc;
}, []);

await fs.writeJson('./libsPairs.json', libsPairs);

console.log('Two libs urls', twoLibsUrls.length);

const urls = [...oneLibUrls, ...twoLibsUrls].sort();

const urlsStr = urls.reduce((acc, url) => {
  return (
    acc +
    `  <url>
    <loc>${url}</loc>
    <lastmod>2023-06-29</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`
  );
}, '');

const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moiva.io</loc>
    <lastmod>2023-06-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://moiva.io/catalog/</loc>
    <lastmod>2023-06-29</lastmod>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://moiva.io/blog/</loc>
    <lastmod>2023-06-29</lastmod>
    <changefreq>weekly</changefreq>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-10-update/</loc>
    <lastmod>2021-10-11</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-09-update--actions-in-table-charts/</loc>
    <lastmod>2021-09-09</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-08-update-share-charts-new-suggestions/</loc>
    <lastmod>2021-08-08</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-07-update-new-metric-status/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-06-update-improved-table-view-seo-fixes/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-05-update/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/the-missing-migration-guide-from-vue-cli-to-vite/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-end-to-end-testing-frameworks/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-js-jamstack/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-js-build-tools-bundlers/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-js-testing-libraries/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-report-state-management/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-q1-state-of-js-frameworks/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-04-update-github-stars-chart/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/vercel-serverless-functions-vs-cloudflare-workers/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/2021-03-update-migration-to-cloudflare-workers/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

  <url>
    <loc>https://moiva.io/blog/universal-tool-to-evaluate-discover-compare-software/</loc>
    <lastmod>2023-06-29</lastmod>
  </url>

${urlsStr}</urlset>
`;

try {
  await fs.outputFile('./public/sitemap.xml', content);
  console.log('Sitemap generated successfully');
} catch (err) {
  console.log(err);
}

function sortLibsByNpm(libA, libB) {
  if (libA.npm < libB.npm) {
    return -1;
  }
  if (libA.npm > libB.npm) {
    return 1;
  }
  return 0;
}
