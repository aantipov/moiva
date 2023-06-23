import { CatalogLibraryT } from '@/data/index';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  getYear,
  getMonth,
  subQuarters,
  format,
  formatDistance,
} from 'date-fns';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const npmQueryParamNameLegacy = 'compare';
const npmQueryParamName = 'npm';
const githubQueryParamName = 'github';
const delimiter = ' ';
const encodedDelimiter = '+';

export function getNpmPackagesFromUrl(): string[] {
  const Url = new URL(window.location.href);
  const npmPackagesFromLegacyParameter =
    Url.searchParams.get(npmQueryParamNameLegacy)?.split(delimiter) || [];
  const npmPackages =
    Url.searchParams.get(npmQueryParamName)?.split(delimiter) || [];
  const allPackages = [...npmPackagesFromLegacyParameter, ...npmPackages];

  return [...new Set(allPackages)];
}

export function constructHref(npmPackagesNames: string[]): string {
  if (!npmPackagesNames.length) {
    return '/';
  }

  return `/?${npmQueryParamName}=${[...npmPackagesNames]
    .sort()
    .join(encodedDelimiter)}`;
}

export function getLibraryHref(library: CatalogLibraryT): string {
  if (library.npm && library.isNpmCoreArtifact) {
    return `/?${npmQueryParamName}=${library.npm}`;
  }
  return `/?${githubQueryParamName}=${library.repoId}`;
}

export const numbersFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
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

export function formatDateFromNow(date: string): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
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

export function sortLibsByAlias(
  libA: LibraryReadonlyT,
  libB: LibraryReadonlyT
): number {
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

// Get Quarter's first month
export function getQuarterFirstMonthFromDate(date: string): string {
  const dateObj = new Date(date);
  const month = dateObj.getUTCMonth();
  const year = dateObj.getUTCFullYear();
  if (month <= 2) {
    return `${year}-01`;
  }
  if (month <= 5) {
    return `${year}-04`;
  }
  if (month <= 8) {
    return `${year}-07`;
  }
  return `${year}-10`;
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

type LibsValues =
  | { month: string; contributors: number }
  | { month: string; releases: number };

export function getFirstNonZeroValueMonth(
  libs: LibsValues[][],
  prop: 'contributors' | 'releases'
): string {
  const defaultMonth = '2017-01';

  if (!libs.length) {
    return defaultMonth;
  }

  const months = libs.map((libValues) => {
    const nonZeroMonths = libValues
      // @ts-ignore
      .filter((libValue) => libValue[prop] > 0)
      .map((libValue) => libValue.month);
    return nonZeroMonths.length ? nonZeroMonths[0] : libValues[0].month;
  });

  // Get earliest month
  const month = months.sort()[0];
  return month > defaultMonth ? month : defaultMonth;
}
