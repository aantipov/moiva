import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';
import { NpmPackagedDetailsResponseT } from '../api/npm-package-detailed';
import {
  ERROR_CODE_NO_GITHUB_DATA,
  ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING,
  ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING,
} from '@/constants';
import { GithubLanguagesResponseT } from '../api/gh-languages';
import { CommitsResponseItemT } from '../api/gh-commits';
import { GithubContributorsResponseItemT } from '../api/gh-contributors';

const npmDownloadsCache = new Map();
const npmSuggestionsCache = new Map();
const npmPackageCache = new Map();
const npmPackageVersionsCache = new Map();
const githubCache = new Map();
const githubLanguagesCache = new Map();
const githubCommitsCache = new Map();
const githubContributorsCache = new Map();
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
  closedIssues: { totalCount: number };
  closedBugIssues: { totalCount: number };
  openIssues: { totalCount: number };
  openBugIssues: { totalCount: number };
}

export interface LibraryT {
  name: string;
  description: string;
  license: string;
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
      license: string;
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
  repoUrl: string
): Promise<GithubLanguagesResponseT | null> {
  const repoUrlParts = repoUrl.split('/');
  const owner = repoUrlParts[3];
  const name = repoUrlParts[4];

  if (githubLanguagesCache.get(repoUrl)) {
    return Promise.resolve(githubLanguagesCache.get(repoUrl));
  }

  return axios
    .get(`/api/gh-languages?name=${name}&owner=${owner}`)
    .then(({ data }) => {
      githubLanguagesCache.set(repoUrl, data);
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
  repoUrl: string
): Promise<CommitsResponseItemT[] | null> {
  const repoUrlParts = repoUrl.split('/');
  const owner = repoUrlParts[3];
  const name = repoUrlParts[4];

  if (githubCommitsCache.get(repoUrl)) {
    return Promise.resolve(githubCommitsCache.get(repoUrl));
  }

  return axios
    .get<CommitsResponseItemT[]>(`/api/gh-commits?name=${name}&owner=${owner}`)
    .then(({ data }) => {
      githubCommitsCache.set(repoUrl, data);
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

export interface YearContributorsT {
  year: number;
  contributors: number;
}

export function fetchContributors(
  repoUrl: string
): Promise<YearContributorsT[] | null> {
  const repoUrlParts = repoUrl.split('/');
  const owner = repoUrlParts[3];
  const name = repoUrlParts[4];

  if (githubContributorsCache.get(repoUrl)) {
    return Promise.resolve(githubContributorsCache.get(repoUrl));
  }

  return axios
    .get<GithubContributorsResponseItemT[]>(
      `/api/gh-contributors?name=${name}&owner=${owner}`
    )
    .then(({ data: contributors }) => {
      const yearToContributorsMap = {} as Record<string, number>;

      // Fill yearToContributorsMap with data
      (contributors as GithubContributorsResponseItemT[]).forEach(
        ({ years }) => {
          years.forEach(({ year, commits }) => {
            if (!yearToContributorsMap[year]) {
              yearToContributorsMap[year] = 0;
            }

            if (commits) {
              yearToContributorsMap[year] += 1;
            }
          });
        }
      );

      // Convert yearToContributorsMap into array sorted by year
      const contributorsByYear = Object.entries(yearToContributorsMap)
        .map(([year, contributors]) => ({
          year: Number(year),
          contributors,
        }))
        .sort((c1, c2) => c1.year - c2.year);

      githubContributorsCache.set(repoUrl, contributorsByYear);

      return contributorsByYear;
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

export function fetchGithubData(
  repoUrl: string,
  npmPackage: string
): Promise<RepoT | null> {
  const repoUrlParts = repoUrl.split('/');
  const owner = repoUrlParts[3];
  const name = repoUrlParts[4];

  if (githubCache.get(repoUrl)) {
    return Promise.resolve(githubCache.get(repoUrl));
  }

  return axios
    .get<RepoT>(`/api/gh?name=${name}&owner=${owner}&pkg=${npmPackage}`)
    .then(({ data }) => {
      githubCache.set(repoUrl, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, `fetchGithubData (package: ${npmPackage})`);
      return null;
    });
}

export function fetchGTrendsData(libs: string[]): Promise<GTrendPointT[]> {
  // TODO: implement a proper cache
  const libsStr = libs.join(',');

  if (gTrendsCache.get(libsStr)) {
    return Promise.resolve(gTrendsCache.get(libsStr));
  }

  return axios
    .get(`/api/gtrends?libs=${libsStr}`)
    .then(({ data }) => {
      gTrendsCache.set(libsStr, data.default.timelineData);
      return data.default.timelineData;
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
    .then(({ data }) => data);
}

function fetchNpmsIOSuggestions(keyword: string): Promise<SuggestionT[]> {
  return axios
    .get<NpmsIOSuggestionResponseT[]>(
      `https://api.npms.io/v2/search/suggestions?q=${keyword}&size=20`
    )
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
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Do not spam Sentry with "expected" errors
      if (errorCode !== ERROR_CODE_NO_GITHUB_DATA) {
        reportSentry(err, 'fetchNpmPackage');
      }

      if (errorCode === 404) {
        return null;
      }

      return Promise.reject(errorCode);
    });
}

function fetchNpmJSPackage(packageName: string): Promise<LibraryT | null> {
  return axios
    .get(`/api/npm-package?pkg=${packageName}`)
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
            license,
            links: { repository },
          },
        },
      } = resp.data as NpmsIOPackageResponseT;

      return {
        name,
        description,
        dependencies: [],
        version,
        license,
        repo: repository,
      };
    });
}

export type NpmPackageReleasesT = Record<string, number>;

export function fetchNpmPackageReleases(
  pkg: string
): Promise<NpmPackageReleasesT | null> {
  if (npmPackageVersionsCache.get(pkg)) {
    return Promise.resolve(npmPackageVersionsCache.get(pkg));
  }

  return axios
    .get(`/api/npm-package-detailed?pkg=${pkg}`)
    .then(({ data }: { data: NpmPackagedDetailsResponseT }) => {
      // Calc release number per year
      const aggregatedMap = data.versions.reduce((acc, [, year]) => {
        if (acc[year]) {
          acc[year]++;
        } else {
          acc[year] = 1;
        }
        return acc;
      }, {} as NpmPackageReleasesT);

      // Strip all data earlier 2017 and make sure every year is present
      const res: Record<string, number> = {};
      let year = 2017;
      const currentYear = new Date().getFullYear();
      while (year <= currentYear) {
        res[year] = aggregatedMap[year] || 0;
        year++;
      }

      npmPackageVersionsCache.set(pkg, res);

      return res;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmPackageReleases');

      return null;
    });
}
