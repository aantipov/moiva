import {
  catalogLibraries,
  CatalogLibraryT,
  frameworksTags,
} from '@/data/index';
import { LibraryReadonlyT, LibrariesReadonlyT } from '@/libraryApis';
import { getYear, getMonth } from 'date-fns';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { subQuarters, format } from 'date-fns';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
// @ts-ignore
import { Document } from 'flexsearch';

// Init and build search index for catalog libraries
const index = new Document({
  document: {
    id: 'id',
    content: 'alias',
    tag: 'tags',
  },
});
catalogLibraries.forEach((lib) => index.add(lib));

const npmQueryParamNameLegacy = 'compare';
const npmQueryParamName = 'npm';
const githubQueryParamName = 'github';
const delimiter = ' ';
const encodedDelimiter = '+';
let hasCanonicalUrlCheckProcessed = false;

// Update the URL whenever a user selects/deselects a library
export function updateUrl(libraries: LibrariesReadonlyT): void {
  const Url = new URL(window.location.href);
  const originalHref = '/' + Url.search;
  const npmPackagesNames = [] as string[];
  const reposIds = [] as string[];

  libraries.forEach((library) => {
    if (library.npmPackage) {
      npmPackagesNames.push(library.npmPackage.name);
    } else {
      reposIds.push(library.repo.repoId);
    }
  });

  const newHref = constructHref(npmPackagesNames, reposIds);

  if (!hasCanonicalUrlCheckProcessed) {
    // Let GoogleBot know the canonical URL
    setCanonicalUrl(newHref);
    hasCanonicalUrlCheckProcessed = true;
  }

  if (newHref !== originalHref) {
    window.history.pushState(null, '', newHref);
  }
}

export function getNpmPackagesFromUrl(): string[] {
  const Url = new URL(window.location.href);
  const npmPackagesFromLegacyParameter =
    Url.searchParams.get(npmQueryParamNameLegacy)?.split(delimiter) || [];
  const npmPackages =
    Url.searchParams.get(npmQueryParamName)?.split(delimiter) || [];
  const allPackages = [...npmPackagesFromLegacyParameter, ...npmPackages];

  return [...new Set(allPackages)];
}

export function getReposIdsFromUrl(): string[] {
  const Url = new URL(window.location.href);
  const repos =
    Url.searchParams.get(githubQueryParamName)?.split(delimiter) || [];

  return [...new Set(repos)];
}

export function constructHref(
  npmPackagesNames: string[],
  reposIds: string[]
): string {
  if (!npmPackagesNames.length && !reposIds.length) {
    return '/';
  }

  const params = [];

  if (npmPackagesNames.length) {
    params.push(
      `${npmQueryParamName}=${[...npmPackagesNames]
        .sort()
        .join(encodedDelimiter)}`
    );
  }

  if (reposIds.length) {
    params.push(
      `${githubQueryParamName}=${[...reposIds].sort().join(encodedDelimiter)}`
    );
  }

  return `/?${params.join('&')}`;
}

export function getLibraryHref(library: CatalogLibraryT): string {
  if (library.npm && library.isNpmCoreArtifact) {
    return `/?${npmQueryParamName}=${library.npm}`;
  }
  return `/?${githubQueryParamName}=${library.repoId}`;
}

export const numbersFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export const convertBytesToKb = (bytes: number): number =>
  Math.round(bytes / 102.4) / 10;

export const getAge = (createdAt: string): string =>
  formatDistanceToNowStrict(new Date(createdAt));

export const getFormattedAgeFromAgeInMs = (ageInMs: number): string =>
  formatDistanceToNowStrict(new Date().getTime() - ageInMs);

export const numbersStandardFormatter = new Intl.NumberFormat('en-US', {
  notation: 'standard',
  maximumFractionDigits: 0,
});

export function formatPercent(value: number, withSign = false): string {
  const sign = withSign && value >= 0 ? '+' : '';

  return `${sign}${numbersFormatter.format(value)}%`;
}
export function formatNumber(value: number, withSign = false): string {
  const sign = withSign && value >= 0 ? '+' : '';

  return `${sign}${numbersFormatter.format(value)}`;
}

// Do not allow Google index pages with GitHub (we don't have enough data for SEO there)
// Do not allow Google to index pages with >=3 libraries
// To avoid spamming Google and the user with useless and duplicated links
export function setNoFollowTag(): void {
  const npmPackagesFromUrl = getNpmPackagesFromUrl();
  const reposIdsFromUrl = getReposIdsFromUrl();

  if (reposIdsFromUrl.length > 0 || npmPackagesFromUrl.length >= 3) {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex';
    document.head.appendChild(metaRobots);
  }
}

// Let Google Bot know the canonical URL of the page
function setCanonicalUrl(url: string): void {
  const link = document.createElement('link');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', 'https://moiva.io' + url);
  document.head.appendChild(link);
}

/**
 * Get Alias using the alias from the catalog or repository's name
 *
 */
export function getSeoLibName(repoId: string): string {
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

export function updateTitle(libraries: LibrariesReadonlyT): void {
  let title = 'Moiva.io - Discover and Compare NPM packages';

  if (libraries.length) {
    const aliases = libraries.map(({ alias }) => alias).sort();
    title = `${aliases[0]}: Stats and Trends from NPM, GitHub, ... - Moiva.io`;

    if (aliases.length > 1) {
      title = `${aliases.join(' vs ')}: Which One to Choose? - Moiva.io`;
    }
  }

  window.document.title = title;
  (
    document.querySelector('meta[name="twitter:title"]') as HTMLElement
  ).setAttribute('content', title);
}

interface LibForDescriptionT {
  alias: string;
  description: string;
  starsCount: string;
  age: string;
}

export function updateMetaDescription(libraries: LibrariesReadonlyT): void {
  let descr = `A complete side-by-side Comparison of NPM packages.
     Stats and Historical Trends - Bundle size, Downloads, GitHub Stars, License, Contributors, Releases, Commits, Developer usage, Google Trends, Vulnerabilities, Dependencies, Issues, Age and more`;

  const libs = [...libraries].sort(sortLibsByAlias).map((lib) => {
    const { description, stars, createdAt } = lib.repo;

    return {
      alias: lib.alias,
      description,
      starsCount: numbersFormatter.format(stars),
      age: formatDistanceToNowStrict(new Date(createdAt)),
    };
  });

  if (libs.length === 1) {
    descr = getSingleLibDescription(libs[0]);
  } else if (libs.length === 2) {
    descr = getTwoLibsDescription(libs[0], libs[1]);
  } else if (libs.length === 3) {
    descr = getThreeLibsDescription(libs[0], libs[1], libs[2]);
  } else if (libs.length > 3) {
    const aliasesStr = libs.map(({ alias }) => alias).join(', ');
    descr = `Compare ${aliasesStr}. Stats and Historical Trends - Bundle size, Downloads, GitHub Stars, License, Contributors, Releases, Commits, Developer usage, Google Trends, Vulnerabilities, Dependencies, Issues, Age and more`;
  }

  (
    document.querySelector('meta[name="Description"]') as HTMLElement
  ).setAttribute('content', descr);
  (
    document.querySelector('meta[name="twitter:description"]') as HTMLElement
  ).setAttribute('content', descr);
}

function getSingleLibDescription(lib: LibForDescriptionT): string {
  const { alias, description, starsCount, age } = lib;
  const seoDescrIntro = (description || '')
    .toLowerCase()
    .startsWith(alias.toLowerCase())
    ? description
    : `${alias}. ${description}`;

  const words = seoDescrIntro.split(' ');
  let seoDescrIntroCut =
    words.length <= 11 ? seoDescrIntro : words.slice(0, 11).join(' ') + '...';

  // Make sure there is a dot in the end
  if (seoDescrIntroCut.slice(-1) !== '.') {
    seoDescrIntroCut += '.';
  }

  return `${seoDescrIntroCut} 
    &#9733;${starsCount} stars, ${age} old...
    Discover alternatives and compare them side-by-side`;
}

function getTwoLibsDescription(
  libA: LibForDescriptionT,
  libB: LibForDescriptionT
): string {
  return `Compare ${libA.alias} and ${libB.alias} side-by-side. Stats and Historical Trends.
${libA.alias}: &#9733;${libA.starsCount} stars, ${libA.age} old...
${libB.alias}: &#9733;${libB.starsCount} stars, ${libB.age} old...
`;
}

function getThreeLibsDescription(
  libA: LibForDescriptionT,
  libB: LibForDescriptionT,
  libC: LibForDescriptionT
): string {
  return `Which is better ${libA.alias}, ${libB.alias}, or ${libC.alias}? Compare Stats and Trends side-by-side.
${libA.alias}: &#9733;${libA.starsCount} stars, ${libA.age} old...
${libB.alias}: &#9733;${libB.starsCount} stars, ${libB.age} old...
${libC.alias}: &#9733;${libC.starsCount} stars, ${libC.age} old...
`;
}

interface SearchResultsItemT {
  tag: string;
  result: number[];
}
interface SearchLibT {
  lib: CatalogLibraryT;
  matchedTags: string[];
  matchedTagsNumber: number; // we need it to sort found libraries
}

/**
 * Get Library suggestions for the selected libs
 * based on tags
 */
export function getSuggestions(
  selectedLibraries: LibrariesReadonlyT
): CatalogLibraryT[] {
  if (!selectedLibraries.length) {
    return [];
  }

  // Tags of selected libraries
  const tagsUsed = [
    ...new Set(selectedLibraries.map((lib) => lib.tags).flat()),
  ] as string[];

  const tagsUsedNoFrameworks = tagsUsed.filter(
    (tag) => !frameworksTags.includes(tag)
  ) as string[];
  const tagsUsedFrameworks = tagsUsed.filter((tag) =>
    frameworksTags.includes(tag)
  ) as string[];

  const tagsResults = index.search({
    tag: tagsUsedNoFrameworks,
  }) as SearchResultsItemT[];
  const keyToLibMap = new Map<number, SearchLibT>();

  tagsResults.forEach((tagResultItem) => {
    const tagLibsKeys = tagResultItem.result; // list of libs ids [0, 4, 8] (indexes in catalogLibraries)
    const tag = tagResultItem.tag;
    tagLibsKeys.forEach((libKey) => {
      if (!keyToLibMap.get(libKey)) {
        keyToLibMap.set(libKey, {
          lib: catalogLibraries[libKey],
          matchedTags: [],
          matchedTagsNumber: 0,
        });
      }
      const lib = keyToLibMap.get(libKey) as SearchLibT;
      lib.matchedTags.push(tag);
      lib.matchedTagsNumber++;
    });
  });

  const selectedLibsIds = selectedLibraries.map(
    (item) => item.catalogLibraryId
  );
  const suggestedLibs: CatalogLibraryT[] = [...keyToLibMap.values()]
    // TODO: sort libs by more specific tags, e.g. browser-automation vs testing (e2e libs)
    // TODO: sort libs by stars rate
    .sort((a, b) => b.matchedTagsNumber - a.matchedTagsNumber)
    .map((item) => item.lib)
    // filter out selected libraries
    .filter((item) => !selectedLibsIds.includes(item.id))
    // Exclude framework specific libs which do not match currently selected
    .filter(
      (lib) =>
        lib.framework === null || tagsUsedFrameworks.includes(lib.framework)
    );

  return suggestedLibs;
}

export function getBundlephobiaUrl(libName: string): string {
  return `https://bundlephobia.com/result?p=${encodeURIComponent(libName)}`;
}

export function showErrorMsg(msg: string): void {
  Swal.fire({
    title: msg,
    toast: true,
    showConfirmButton: false,
    position: 'top-right',
    showCloseButton: true,
    closeButtonHtml: '<span>×</span>',
    customClass: {
      title: 'toast-error-title',
      popup: 'toast-error-popup',
      closeButton: 'toast-error-close-btn',
    },
  });
}

function sortLibsByAlias(libA: LibraryReadonlyT, libB: LibraryReadonlyT) {
  const aliasA = libA.alias;
  const aliasB = libB.alias;
  if (aliasA < aliasB) {
    return -1;
  }
  if (aliasA > aliasB) {
    return 1;
  }
  return 0;
}

export function getNamesStr(names: string[]): string {
  const items = [...names];
  if (!items.length) {
    return '';
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return items.join(' and ');
  }
  const last = items.pop();
  return items.join(', ') + ', and ' + last;
}

export function getQuarterMonthFromDate(date: string): string {
  const dateObj = new Date(date);
  const month = dateObj.getUTCMonth();
  const year = dateObj.getUTCFullYear();
  if (month <= 2) {
    return `${year}-04`;
  }
  if (month <= 5) {
    return `${year}-07`;
  }
  if (month <= 8) {
    return `${year}-10`;
  }
  return `${year + 1}-01`;
}

export const prevQuarter = format(subQuarters(new Date(), 1), 'yyyy-QQQ');

/**
 * date argument in the format '2020-06'
 */
export function getPrevQuater(quarter: string): string {
  const quarterDate = new Date(quarter);
  quarterDate.setUTCMonth(quarterDate.getUTCMonth() - 3, 1);
  return quarterDate.toISOString().slice(0, 7);
}

export function getPrevMonth(month: string): string {
  const monthDate = new Date(month);
  monthDate.setUTCMonth(monthDate.getUTCMonth() - 1, 1);
  return monthDate.toISOString().slice(0, 7);
}

/**
 * Get the earliest date from the list of dates
 * But not earlier than the provided limitDate
 * Returns month in the ISO format, like 2020-03
 */
export function getEarliestMonth(dates: string[], limitMonth: string): string {
  limitMonth = limitMonth.slice(0, 7);
  if (!dates.length) {
    return limitMonth;
  }
  const month = dates
    .sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    })[0]
    .slice(0, 7);

  return month > limitMonth ? month : limitMonth;
}

/**
 * Get the earliest quarter month from the list of dates
 * But not earlier than the provided limitDate
 * Returns month in the ISO format, like 2020-04
 */
export function getEarliestQuarter(
  dates: string[],
  limitMonth: string
): string {
  limitMonth = limitMonth.slice(0, 7);
  if (!dates.length) {
    return limitMonth;
  }
  const month = dates
    .sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    })[0]
    .slice(0, 7);

  const quarterMonth = getQuarterMonthFromDate(month);

  return quarterMonth > limitMonth ? quarterMonth : limitMonth;
}

export function getDateRanges(since: string): string[] {
  const dates = [since];
  const cYear = getYear(new Date());
  const cMonth = getMonth(new Date());
  const maxYear = cMonth < 5 ? cYear - 1 : cYear;
  let nextYear = getYear(new Date(since)) + 1;

  while (nextYear <= maxYear) {
    dates.push(nextYear.toString());
    nextYear++;
  }
  return dates;
}

export function sanitizeHTML(text: string): string {
  const element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
}
