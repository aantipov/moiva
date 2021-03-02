import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';
import { NpmReleasesResponseItemT } from '../api/npm-releases';
import {
  ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING,
  ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING,
} from '@/constants';
import { GithubLanguagesResponseT } from '../api/gh-languages';
import { CommitsResponseItemT } from '../api/gh-commits';
import { GithubContributorsResponseItemT } from '../api/gh-contributors';

const npmDownloadsCache = new Map();
const npmReleasesCache = new Map();
const githubLanguagesCache = new Map();
const githubCommitsCache = new Map();
const githubContributorsCache = new Map();
const gTrendsCache = new Map();
const bphobiaCache = new Map();

export type ContributorsT = GithubContributorsResponseItemT;
export type NpmPackageReleasesT = NpmReleasesResponseItemT;

export interface NpmDownloadT {
  downloads: number;
  month: string;
}

export interface BundlephobiaT {
  gzip: number;
  raw: number;
}

export interface GTrendPointT {
  time: number;
  value: number[];
}

export interface GTrendsT {
  averages: number[];
  timelineData: GTrendPointT[];
}

export function reportSentry(err: AxiosError, methodName: string): void {
  err.name = `UI API (${methodName})`;

  Sentry.captureException(err, {
    tags: {
      apiResponseMessage: err.response?.data?.error || '',
      apiRequestUrl: err.config?.url || '',
    },
  });
}

export function fetchNpmDownloads(
  libName: string
): Promise<NpmDownloadT[] | null> {
  if (npmDownloadsCache.get(libName)) {
    return Promise.resolve(npmDownloadsCache.get(libName));
  }

  return axios
    .get(`/api/npm-downloads?pkg=${libName}`)
    .then(({ data }) => {
      const dataWOLastMonth = data.slice(0, -1);
      npmDownloadsCache.set(libName, dataWOLastMonth);
      return dataWOLastMonth;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmDownloads');

      return null;
    });
}

export function fetchRepoLanguages(
  repoId: string
): Promise<GithubLanguagesResponseT | null> {
  const [owner, name] = repoId.split('/');

  if (githubLanguagesCache.get(repoId)) {
    return Promise.resolve(githubLanguagesCache.get(repoId));
  }

  return axios
    .get(`/api/gh-languages?name=${name}&owner=${owner}`)
    .then(({ data }) => {
      githubLanguagesCache.set(repoId, data);
      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      if (errorCode !== 404) {
        reportSentry(err, 'fetchGithubLanguagesData');
      }

      return null;
    });
}

export function fetchRepoCommits(
  repoId: string
): Promise<CommitsResponseItemT[] | null> {
  const [owner, name] = repoId.split('/');

  if (githubCommitsCache.get(repoId)) {
    return Promise.resolve(githubCommitsCache.get(repoId));
  }

  return axios
    .get<CommitsResponseItemT[]>(`/api/gh-commits?name=${name}&owner=${owner}`)
    .then(({ data }) => {
      githubCommitsCache.set(repoId, data);
      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING) {
        reportSentry(err, 'fetchGithubCommitsData');
      }

      return null;
    });
}

export function fetchContributors(
  repoId: string
): Promise<GithubContributorsResponseItemT[] | null> {
  const [owner, name] = repoId.split('/');

  if (githubContributorsCache.get(repoId)) {
    return Promise.resolve(githubContributorsCache.get(repoId));
  }

  return axios
    .get<GithubContributorsResponseItemT[]>(
      `/api/gh-contributors?name=${name}&owner=${owner}`
    )
    .then(({ data }) => {
      githubContributorsCache.set(repoId, data);
      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING) {
        reportSentry(err, 'fetchContributorsData');
      }

      return null;
    });
}

export function fetchGTrendsData(libs: string[]): Promise<GTrendPointT[]> {
  const libsStr = libs.join(',');

  if (gTrendsCache.get(libsStr)) {
    return Promise.resolve(gTrendsCache.get(libsStr));
  }

  return axios
    .get(`/api/gtrends?libs=${libsStr}`)
    .then(({ data }) => {
      gTrendsCache.set(libsStr, data.timelineData);
      return data.timelineData;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGTrendsData');
      return Promise.reject(err);
    });
}

export function fetchBundlephobiaData(
  libName: string
): Promise<BundlephobiaT | null> {
  if (bphobiaCache.get(libName)) {
    return Promise.resolve(bphobiaCache.get(libName));
  }

  return axios
    .get(`/api/bphobia?pkg=${libName}`)
    .then(({ data }) => {
      bphobiaCache.set(libName, data);
      return data;
    })
    .catch((err) => {
      const { error } = err.response.data;

      // Report to Sentry unexpected errors only
      if (
        !error ||
        (error.code !== 'BuildError' &&
          error.code !== 'BlacklistedPackageError')
      ) {
        reportSentry(err, 'fetchBundlephobiaData');
      }

      return null;
    });
}

export function fetchNpmPackageReleases(
  pkg: string
): Promise<NpmPackageReleasesT[] | null> {
  if (npmReleasesCache.get(pkg)) {
    return Promise.resolve(npmReleasesCache.get(pkg));
  }

  return axios
    .get(`/api/npm-releases?pkg=${pkg}`)
    .then(({ data }) => {
      npmReleasesCache.set(pkg, data);

      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmPackageReleases');

      return null;
    });
}
