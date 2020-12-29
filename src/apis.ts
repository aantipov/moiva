import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';
import { NpmPackagedDetailsResponseT } from '../api/npm-package-detailed';
import { GithubLanguagesResponseT } from '../api/gh-languages';

const npmDownloadsCache = new Map();
const npmSuggestionsCache = new Map();
const npmPackageCache = new Map();
const npmPackageVersionsCache = new Map();
const githubCache = new Map();
const githubLanguagesCache = new Map();
const gTrendsCache = new Map();
const bphobiaCache = new Map();

export interface NpmDownloadT {
  downloads: number;
  month: string;
}

export interface BundlephobiaT {
  gzip: number;
  raw: number;
}

export interface GTrendPointT {
  formattedAxisTime: string;
  formattedTime: string;
  formattedValue: string[];
  hasData: boolean[];
  time: number;
  value: number[];
}

export interface GTrendsT {
  averages: number[];
  timelineData: GTrendPointT[];
}

export interface RepoT {
  stars: number;
  createdAt: string;
  vulnerabilitiesCount: number;
  openPRs: { totalCount: number };
  closedPRs: { totalCount: number };
  mergedPRs: { totalCount: number };
  closedIssues: { totalCount: number };
  openIssues: { totalCount: number };
}

export interface LibraryT {
  name: string;
  description: string;
  repo: string;
  version: string;
  dependencies: string[];
}

export interface SuggestionT {
  name: string;
  description: string;
  version: string;
}

interface NpmsIOSuggestionResponseT {
  package: {
    name: string;
    description: string;
    version: string;
    links: {
      repository: string;
    };
  };
  score: {
    detail: {
      popularity: number;
    };
  };
  searchScore: number;
}

interface NpmsIOPackageResponseT {
  collected: {
    metadata: {
      name: string;
      description: string;
      version: string;
      links: { repository: string };
    };
  };
}

function reportSentry(err: AxiosError, methodName: string): void {
  err.name = `UI API (${methodName})`;

  Sentry.captureException(err, {
    tags: {
      apiResponseMessage: err.response?.data?.error || '',
      apiRequestUrl: err.config?.url || '',
    },
  });
}

export function fetchNpmDownloads(lib: string): Promise<NpmDownloadT[]> {
  if (npmDownloadsCache.get(lib)) {
    return Promise.resolve(npmDownloadsCache.get(lib));
  }

  return axios
    .get(`/api/npm-downloads?lib=${lib}`)
    .then(({ data }) => {
      npmDownloadsCache.set(lib, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmDownloads');
      return Promise.reject(err);
    });
}

export function fetchRepoLanguages(
  repoUrl: string
): Promise<GithubLanguagesResponseT> {
  const repoUrlParts = repoUrl.split('/');
  const owner = repoUrlParts[3];
  const name = repoUrlParts[4];
  const key = name + '/' + owner;

  if (githubLanguagesCache.get(key)) {
    return Promise.resolve(githubLanguagesCache.get(key));
  }

  return axios
    .get(`/api/gh-languages?name=${name}&owner=${owner}`)
    .then(({ data }) => {
      githubLanguagesCache.set(key, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGithubLanguagesData');
      return Promise.reject(err);
    });
}

export function fetchGithubData(
  repoUrl: string,
  npmPackage: string
): Promise<RepoT> {
  const repoUrlParts = repoUrl.split('/');
  const owner = repoUrlParts[3];
  const name = repoUrlParts[4];
  const key = name + '/' + owner;

  if (githubCache.get(key)) {
    return Promise.resolve(githubCache.get(key));
  }

  return axios
    .get(`/api/gh?name=${name}&owner=${owner}&package=${npmPackage}`)
    .then(({ data }) => {
      githubCache.set(key, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGithubData');
      return Promise.reject(err);
    });
}

export function fetchGTrendsData(libs: string[]): Promise<GTrendsT> {
  // TODO: implement a proper cache
  const libsStr = libs.join(',');

  if (gTrendsCache.get(libsStr)) {
    return Promise.resolve(gTrendsCache.get(libsStr));
  }

  return axios
    .get(`/api/gtrends?libs=${libsStr}`)
    .then(({ data }) => {
      gTrendsCache.set(libsStr, data.default);
      return data.default;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGTrendsData');
      return Promise.reject(err);
    });
}

export function fetchBundlephobiaData(lib: string): Promise<BundlephobiaT> {
  if (bphobiaCache.get(lib)) {
    return Promise.resolve(bphobiaCache.get(lib));
  }

  return axios
    .get(`/api/bphobia?lib=${lib}`)
    .catch((err) => {
      const { code } = err.response.data;

      if (code === 'BuildError' || code === 'BlacklistedPackageError') {
        return { data: null };
      }

      return Promise.reject(err);
    })
    .then(({ data }) => {
      bphobiaCache.set(lib, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchBundlephobiaData');
      return Promise.reject(err);
    });
}

export function fetchNpmSuggestions(keyword: string): Promise<SuggestionT[]> {
  // eslint-disable-next-line
  const fetchSuggestionsFunc = true
    ? fetchNpmJSSuggestions
    : fetchNpmsIOSuggestions;

  if (!keyword || keyword.length < 2) {
    return Promise.resolve([]);
  }

  if (npmSuggestionsCache.get(keyword)) {
    return Promise.resolve(npmSuggestionsCache.get(keyword));
  }

  return fetchSuggestionsFunc(keyword)
    .then((data) => {
      npmSuggestionsCache.set(keyword, data);

      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmSuggestions');
      return Promise.reject(err);
    });
}

function fetchNpmJSSuggestions(keyword: string): Promise<SuggestionT[]> {
  return axios
    .get(`/api/npm-suggestions?q=${keyword}`)
    .then((resp) => resp.data);
}

function fetchNpmsIOSuggestions(keyword: string): Promise<SuggestionT[]> {
  return axios
    .get(`https://api.npms.io/v2/search/suggestions?q=${keyword}&size=20`)
    .then((resp) => {
      const suggestions = resp.data as NpmsIOSuggestionResponseT[];
      const data = suggestions
        .filter((lib) => !!lib.package.links.repository)
        .sort((a, b) => {
          if (b.searchScore - a.searchScore > 100) {
            return b.searchScore - a.searchScore;
          }
          return b.score.detail.popularity - a.score.detail.popularity;
        })
        .map(({ package: { name, description, version } }) => ({
          name,
          description,
          version,
        }));

      return data;
    });
}

export function fetchNpmPackage(packageName: string): Promise<LibraryT | null> {
  // eslint-disable-next-line
  const fetchPackageFunc = true ? fetchNpmJSPackage : fetchNpmsIOPackage;

  if (npmPackageCache.get(packageName)) {
    return Promise.resolve(npmPackageCache.get(packageName));
  }

  return fetchPackageFunc(packageName)
    .then((data) => {
      npmPackageCache.set(packageName, data);

      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmPackage');

      if (err?.response?.status === 404) {
        return null;
      }

      return Promise.reject(err);
    });
}

function fetchNpmJSPackage(packageName: string): Promise<LibraryT | null> {
  return axios
    .get(`/api/npm-package?lib=${packageName}`)
    .then(({ data }) => data);
}

function fetchNpmsIOPackage(packageName: string): Promise<LibraryT | null> {
  return axios
    .get(`https://api.npms.io/v2/package/${encodeURIComponent(packageName)}`)
    .then((resp) => {
      const {
        collected: {
          metadata: {
            name,
            description,
            version,
            links: { repository },
          },
        },
      } = resp.data as NpmsIOPackageResponseT;

      return {
        name,
        description,
        dependencies: [],
        version,
        repo: repository,
      };
    });
}

export type NpmPackageVersionsT = Record<string, number>;

export function fetchNpmPackageVersions(
  pkg: string
): Promise<NpmPackageVersionsT> {
  if (npmPackageVersionsCache.get(pkg)) {
    return Promise.resolve(npmPackageVersionsCache.get(pkg));
  }

  return axios
    .get(`/api/npm-package-detailed?pkg=${pkg}`)
    .then(({ data }: { data: NpmPackagedDetailsResponseT }) => {
      const result = data.versions.reduce((acc, [, year]) => {
        if (Number(year) < 2017) {
          return acc;
        }
        if (acc[year]) {
          acc[year]++;
        } else {
          acc[year] = 1;
        }
        return acc;
      }, {} as NpmPackageVersionsT);

      npmPackageVersionsCache.set(pkg, result);

      return result;
    });
}
