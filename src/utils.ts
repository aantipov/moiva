import { LibraryT, fetchNpmPackage } from './apis';
import { libsDataByName, libsNamesByCategory } from './libraries-list';

const paramName = 'compare';
const oldParamName = 'apps';
const delimiter = ' ';
const encodedDelimiter = '+';

/**
 * A function to ensure the url is valid
 * It is called only once during the initial page load
 */
function cleanupUrl(validLibsFromUrl: string[]): void {
  const Url = new URL(window.location.href);

  // Make sure the old parameter is not licked
  Url.searchParams.delete(oldParamName);

  // Do nothing if the URL doesn't have the parameter (loading root page use case)
  if (Url.searchParams.get(paramName) === null) {
    return;
  }

  // Delete the parameter if no valid libs are provided via url
  if (!validLibsFromUrl.length) {
    Url.searchParams.delete(paramName);
    window.history.replaceState(null, '', Url.href);
    return;
  }

  // Update url with the valid libs in the right order
  window.history.replaceState(null, '', constructHref(validLibsFromUrl));
}

// Update URL whenever a user selects/deselects a library
// TODO: do we need to update the document title?
export function updateUrl(selectedLibs: string[]): void {
  const Url = new URL(window.location.href);

  if (!selectedLibs.length) {
    Url.searchParams.delete(paramName);
    window.history.pushState(null, '', Url.href);
    return;
  }

  window.history.pushState(null, '', constructHref(selectedLibs));
}

export function loadDefaultLibs(): Promise<LibraryT[]> {
  const Url = new URL(window.location.href);
  const defaultLibs = Url.searchParams.get(paramName)?.split(delimiter) || [];
  const uniqDefaultLibs = [...new Set(defaultLibs)];

  const promises = uniqDefaultLibs
    .map(fetchNpmPackage)
    // just ignore any errors (and filter those packages out)
    .map((pkgPromise) => pkgPromise.catch(() => null));

  return Promise.all(promises).then((libs) => {
    const filteredLibs = libs.filter((lib) => !!lib) as LibraryT[];

    cleanupUrl(filteredLibs.map((lib) => lib.name));

    return filteredLibs;
  });
}

export function constructHref(libs: string[]): string {
  if (!libs.length) {
    return '/';
  }

  return `/?${paramName}=${[...libs].sort().join(encodedDelimiter)}`;
}

export const numbersFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});

/**
 * Make document title SEO friendly
 */
export function updateTitle(): void {
  const Url = new URL(window.location.href);
  const libs = Url.searchParams.get(paramName)?.split(delimiter) || [];
  window.document.title = getTitle(libs);
}

function getTitle(libsNames: string[]): string {
  if (!libsNames.length) {
    return 'Moiva.io - Measure and compare JavaScript libraries side by side';
  }

  const seoFriendlyNames = libsNames.map(getSeoFriendlyLibName);

  if (seoFriendlyNames.length === 1) {
    return `${seoFriendlyNames[0]}: stats and trends from NPM, GitHub, Google trends - Moiva.io`;
  }

  // Commare separated string with 'and' as a last separator
  const lastLib = seoFriendlyNames.slice(-1)[0];
  const libsStr = `${seoFriendlyNames.slice(0, -1).join(', ')} and ${lastLib}`;

  return `Compare ${libsStr} - Moiva.io`;
}

function getSeoFriendlyLibName(libName: string): string {
  if (libName === '@angular/core') {
    return 'Angular';
  }

  if (libName === '@nestjs/core') {
    return 'NestJS';
  }

  // Capitalise normal names
  if (
    libName.length > 2 &&
    !libName.includes('@') &&
    !libName.includes('/') &&
    !libName.includes('-')
  ) {
    return libName.charAt(0).toUpperCase() + libName.slice(1);
  }

  return libName;
}

interface LibForDescriptionT {
  name: string;
  description: string;
  starsCount: string;
  age: string;
  vulnerabilitiesCount: number;
  dependenciesCount: number;
  license: string;
}

export function updateMetaDescription(libs: LibForDescriptionT[]): void {
  const descr = getMetaDescription(libs);

  (document.querySelector(
    'meta[name="Description"]'
  ) as HTMLElement).setAttribute('content', descr);
}

function getMetaDescription(libs: LibForDescriptionT[]): string {
  if (!libs.length || libs.length > 1) {
    return 'Javascript libraries and frameworks comparison side by side. Visual with charts and graphs. Multiple metrics. Data from Github, NPM, Google Trends, ThoughtWorks Tech Radar, etc.';
  }

  const {
    name,
    description,
    starsCount,
    age,
    vulnerabilitiesCount,
    dependenciesCount,
    license,
  } = libs[0];
  const seoFriendlyName = getSeoFriendlyLibName(name);
  const descrCut = description.slice(0, 57);
  const seoDescrIntro = descrCut
    .toLowerCase()
    .startsWith(seoFriendlyName.toLowerCase())
    ? descrCut
    : `${seoFriendlyName}. ${descrCut}`;

  const words = seoDescrIntro.split(' ');
  const seoDescrIntroCut =
    words.length <= 7 ? seoDescrIntro : words.slice(0, 7).join(' ');

  return `${seoDescrIntroCut}... &#9733;${starsCount} stars; ${age} old; ${vulnerabilitiesCount} vulnerabilities; ${dependenciesCount} dependencies; license: ${license}...`;
}

/**
 * Get suggestions for the selected libs
 * based on the last selected lib
 *
 */
export function getSuggestions(libsNames: string[]): string[] {
  if (!libsNames.length) {
    return [];
  }

  // We should not display any suggestions if the number of selected libraries is >=5
  // So that Google Search doesn't discover long urls and display them in search results
  if (libsNames.length >= 5) {
    return [];
  }

  const lastSelectedLibData = libsDataByName[libsNames[libsNames.length - 1]];

  if (!lastSelectedLibData || lastSelectedLibData.category === 'Other') {
    return [];
  }

  return libsNamesByCategory[lastSelectedLibData.category]
    .filter((libName) => !libsNames.includes(libName))
    .slice(0, 6);
}

export function getBundlephobiaUrl(libName: string): string {
  return `https://bundlephobia.com/result?p=${encodeURIComponent(libName)}`;
}
