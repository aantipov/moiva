import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';

const npmCache = new Map();
const npmSuggestionsCache = new Map();
const ghCache = new Map();
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
  openPRs: { totalCount: number };
  closedPRs: { totalCount: number };
  mergedPRs: { totalCount: number };
  closedIssues: { totalCount: number };
  openIssues: { totalCount: number };
}

export interface LibraryT {
  name: string;
  description: string;
  repo: string | null;
  npm: string;
  version: string;
  githubName: string | null;
  githubOwner: string | null;
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

export function fetchNpmData(lib: string): Promise<NpmDownloadT[]> {
  if (npmCache.get(lib)) {
    return Promise.resolve(npmCache.get(lib));
  }

  return axios
    .get(`/api/npm?lib=${lib}`)
    .then(({ data }) => {
      npmCache.set(lib, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmData');
      return Promise.reject(err);
    });
}

export function fetchGithubData(lib: LibraryT): Promise<RepoT> {
  if (ghCache.get(lib.name)) {
    return Promise.resolve(ghCache.get(lib.name));
  }

  return axios
    .get(`/api/gh?name=${lib.githubName}&owner=${lib.githubOwner}`)
    .then(({ data }) => {
      ghCache.set(lib.name, data);
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

export function fetchBundlephobiaData(lib: string): Promise<BundlephobiaT[]> {
  if (bphobiaCache.get(lib)) {
    return Promise.resolve(bphobiaCache.get(lib));
  }

  return axios
    .get(`/api/bphobia?lib=${lib}`)
    .then(({ data }) => {
      bphobiaCache.set(lib, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchBundlephobiaData');
      return Promise.reject(err);
    });
}

export interface NpmSuggestionT {
  label: string;
  value: LibraryT;
}

export interface NpmSuggestionResponseT {
  package: {
    name: string;
    description: string;
    version: string;
    links: {
      repository: string;
      npm: string;
    };
  };
  score: {
    detail: {
      popularity: number;
    };
  };
  searchScore: number;
}

export function fetchNpmSuggestions(keyword: string): Promise<LibraryT[]> {
  if (!keyword || keyword.length < 2) {
    return Promise.resolve([]);
  }

  if (npmSuggestionsCache.get(keyword)) {
    return Promise.resolve(npmSuggestionsCache.get(keyword));
  }

  return axios
    .get(`https://api.npms.io/v2/search/suggestions?q=${keyword}&size=20`)
    .then((resp) => {
      const suggestions = resp.data as NpmSuggestionResponseT[];
      const data = suggestions
        .filter((lib) => !!lib.package.links.repository)
        .sort((a, b) => {
          if (b.searchScore - a.searchScore > 100) {
            return b.searchScore - a.searchScore;
          }
          return b.score.detail.popularity - a.score.detail.popularity;
        })
        .map(({ package: packageObj }) => {
          const repoParts = (packageObj.links.repository || '').split('/');

          return {
            name: packageObj.name,
            description: packageObj.description,
            version: packageObj.version,
            npm: packageObj.links.npm,
            githubOwner: repoParts[3] || null,
            githubName: repoParts[4] || null,
            repo: packageObj.links.repository,
          };
        });

      npmSuggestionsCache.set(keyword, data);

      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmSuggestions');
      return Promise.reject(err);
    });
}

interface NpmPackageResponseT {
  collected: {
    metadata: {
      name: string;
      description: string;
      version: string;
      links: { repository: string; npm: string };
    };
  };
}

export function fetchNpmPackage(packageName: string): Promise<LibraryT | null> {
  // eslint-disable-next-line
  const fetchFunc = true ? fetchNpmJSPackage : fetchNpmsIOPackage;

  return fetchFunc(packageName).catch((err) => {
    reportSentry(err, 'fetchNpmPackage');

    if (err?.response?.status === 404) {
      return null;
    }

    return Promise.reject(err);
  });
}

function fetchNpmJSPackage(packageName: string): Promise<LibraryT | null> {
  return axios.get(`/api/npm-package?lib=${packageName}`).then(({ data }) => {
    const repoParts = (data.repo || '').split('/');

    return {
      ...data,
      githubOwner: repoParts[3] || null,
      githubName: repoParts[4] || null,
    } as LibraryT;
  });
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
            links: { repository, npm },
          },
        },
      } = resp.data as NpmPackageResponseT;

      const repoParts = (repository || '').split('/');

      return {
        name,
        description,
        version,
        npm,
        repo: repository || null,
        githubOwner: repoParts[3] || null,
        githubName: repoParts[4] || null,
      };
    });
}
