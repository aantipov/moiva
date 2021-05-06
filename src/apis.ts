import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';

export type GithubLanguagesResponseT = Record<string, number>;

const npmDownloadsCache = new Map();
const bphobiaCache = new Map();

export interface NpmDownloadT {
  downloads: number;
  month: string;
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
    .get(`https://npm-downloads.moiva.workers.dev/?pkg=${libName}`)
    .then(({ data }) => {
      const dataWOLastMonth = data.items.slice(0, -1);
      npmDownloadsCache.set(libName, dataWOLastMonth);
      return dataWOLastMonth;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmDownloads');

      return null;
    });
}

const githubLanguagesCache = new Map();
export function fetchRepoLanguages(
  repoId: string
): Promise<GithubLanguagesResponseT | null> {
  if (githubLanguagesCache.get(repoId)) {
    return Promise.resolve(githubLanguagesCache.get(repoId));
  }

  return axios
    .get(`https://github-languages.moiva.workers.dev/?repo=${repoId}`)
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

export interface BundlephobiaT {
  gzip: number;
  raw: number;
}

export function fetchBundlephobiaData(
  pkg: string
): Promise<BundlephobiaT | null> {
  if (bphobiaCache.get(pkg)) {
    return Promise.resolve(bphobiaCache.get(pkg));
  }

  let request;

  if (pkg === 'react') {
    request = Promise.all([
      axios.get(`https://bundle-size.moiva.workers.dev/?pkg=react`),
      axios.get(`https://bundle-size.moiva.workers.dev/?pkg=react-dom`),
    ]).then(([reactData, reactDomData]) => ({
      gzip: reactData.data.gzip + reactDomData.data.gzip,
      raw: reactData.data.raw + reactDomData.data.raw,
      react: reactData.data,
      reactDom: reactDomData.data,
    }));
  } else {
    request = axios
      .get(`https://bundle-size.moiva.workers.dev/?pkg=${pkg}`)
      .then(({ data }) => data);
  }

  return request
    .then((data) => {
      bphobiaCache.set(pkg, data);
      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== 404) {
        reportSentry(err, 'fetchBundlephobiaData');
      }

      return null;
    });
}
