/* eslint-disable */
fs = require('fs');

const data = [
  require('../moiva-issues/catalog/frontend-frameworks'),
  require('../moiva-issues/catalog/node-frameworks'),
];

const categories = data.map((catObj) => ({
  categoryName: catObj.name,
  libs: catObj.items.map((pkg) => ({
    name: Array.isArray(pkg) ? pkg[0] : pkg,
    category: catObj.name,
    seoAlias: (Array.isArray(pkg) && pkg[1]) || null,
    framework: null,
  })),
}));

let str = '';
categories.forEach((cat) => {
  str += `\n  // ${cat.categoryName} \n`;
  cat.libs.forEach((lib) => {
    str += `  ['${lib.name}', '${lib.category}', '${lib.seoAlias}', '${lib.framework}'],\n`;
  });
});

/**
 * GENERATE LIBRARIES CATALOG
 */

const resStr = `const libraries = [${str}];

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

// Generate urls consisting of pair of libs from the same category
const twoLibsUrls = categories
  .map((cat) => {
    const libsNames = cat.libs.map((lib) => lib.name).sort();
    const categoryPairsUrls = [];

    for (let i = 0; i < libsNames.length - 1; i++) {
      for (let j = i + 1; j < libsNames.length; j++) {
        categoryPairsUrls.push(
          `https://moiva.io/?compare=${libsNames[i]}+${libsNames[j]}`
        );
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
    <lastmod>2021-01-11</lastmod>
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
