import {
  catalogRepoIdToLib,
  catalogNpmToLib,
  catalogNpmNamesByCategory,
} from './libraries-catalog';
import { LibraryT } from '@/libraryApis';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import Swal from 'sweetalert2';

const npmQueryParamName = 'compare';
const githubQueryParamName = 'github';
const delimiter = ' ';
const encodedDelimiter = '+';

// Update the URL whenever a user selects/deselects a library
export function updateUrl(libraries: LibraryT[]): void {
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

  if (newHref !== originalHref) {
    window.history.pushState(null, '', newHref);
  }
}

export function getNpmPackagesFromUrl(): string[] {
  const Url = new URL(window.location.href);
  const npmPackages =
    Url.searchParams.get(npmQueryParamName)?.split(delimiter) || [];

  return [...new Set(npmPackages)];
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

export const numbersFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});

// Do not allow Google to index pages with >3 libraries in comparison
// To avoid spamming Google and the user with useless links
export function setNoFollowTag(): void {
  // TODO: take into account Github projects
  const Url = new URL(window.location.href);
  const libs = Url.searchParams.get(npmQueryParamName)?.split(delimiter) || [];
  if (libs.length > 3) {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex';
    document.head.appendChild(metaRobots);
  }
}

/**
 * Get Alias using the alias from the catalog or repository's name
 *
 */
export function getSeoLibName(repoId: string): string {
  if (catalogRepoIdToLib[repoId].seoAlias) {
    return catalogRepoIdToLib[repoId].seoAlias as string;
  }

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

export function updateTitle(libraries: LibraryT[]): void {
  let title =
    'Moiva.io - Measure and Compare JavaScript libraries side by side';

  if (libraries.length) {
    const aliases = libraries.map(({ alias }) => alias).sort();
    title = `${aliases[0]}: Stats and Trends from NPM, GitHub, Google Search - Moiva.io`;

    if (aliases.length > 1) {
      title = `${aliases.join(' vs ')}: Which One to Choose? - Moiva.io`;
    }
  }

  window.document.title = title;
}

interface LibForDescriptionT {
  alias: string;
  description: string;
  starsCount: string;
  age: string;
}

export function updateMetaDescription(libraries: LibraryT[]): void {
  let descr = `Which JavaScript library to use? Need to find the best alternatives?
    Compare Stats and Trends over time - Google Trends, Contributors, Releases, Commits, Developer usage, Npm Downloads, Bundle size, Vulnerabilities, Dependencies, Issues, GitHub Stars, License, Age and more`;

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
    descr = `Compare ${aliasesStr}. Stats and Trends over time - Google Trends, Contributors, Releases, Commits, Developer usage, Npm Downloads, Bundle size, Vulnerabilities, Dependencies, Issues, GitHub Stars, License, Age and more`;
  }

  (document.querySelector(
    'meta[name="Description"]'
  ) as HTMLElement).setAttribute('content', descr);
}

function getSingleLibDescription(lib: LibForDescriptionT): string {
  const { alias, description, starsCount, age } = lib;
  const seoDescrIntro = description
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
    Find the best ${alias} alternatives and compare them side by side`;
}

function getTwoLibsDescription(
  libA: LibForDescriptionT,
  libB: LibForDescriptionT
): string {
  return `Which is better ${libA.alias} or ${libB.alias}? Compare Stats and Trends side by side.
${libA.alias}: &#9733;${libA.starsCount} stars, ${libA.age} old...
${libB.alias}: &#9733;${libB.starsCount} stars, ${libB.age} old...
`;
}

function getThreeLibsDescription(
  libA: LibForDescriptionT,
  libB: LibForDescriptionT,
  libC: LibForDescriptionT
): string {
  return `Which is better ${libA.alias}, ${libB.alias}, or ${libC.alias}? Compare Stats and Trends side by side.
${libA.alias}: &#9733;${libA.starsCount} stars, ${libA.age} old...
${libB.alias}: &#9733;${libB.starsCount} stars, ${libB.age} old...
${libC.alias}: &#9733;${libC.starsCount} stars, ${libC.age} old...
`;
}

/**
 * Get NPM suggestions for the selected libs
 * based on the last selected lib
 *
 */
export function getSuggestions(npmPackagesNames: string[]): string[] {
  if (!npmPackagesNames.length) {
    return [];
  }

  // We should not display any suggestions if the number of selected libraries is >=5
  // So that Google Search doesn't discover long urls and display them in search results
  if (npmPackagesNames.length >= 5) {
    return [];
  }

  const lastSelectedLibData =
    catalogNpmToLib[npmPackagesNames[npmPackagesNames.length - 1]];

  if (!lastSelectedLibData || lastSelectedLibData.category === 'misc') {
    return [];
  }

  return catalogNpmNamesByCategory[lastSelectedLibData.category]
    .filter((libName) => !npmPackagesNames.includes(libName))
    .slice(0, 6);
}

export function getBundlephobiaUrl(libName: string): string {
  return `https://bundlephobia.com/result?p=${encodeURIComponent(libName)}`;
}

export function showErrorMsg(msg: string): void {
  Swal.fire({
    title: msg,
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    showCloseButton: true,
    closeButtonHtml: '<span>×</span>',
    customClass: {
      title: 'toast-error-title',
      popup: 'toast-error-popup',
      closeButton: 'toast-error-close-btn',
    },
  });
}

function sortLibsByAlias(libA: LibraryT, libB: LibraryT) {
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
