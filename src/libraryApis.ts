import axios, { AxiosError } from 'axios';
import { computed } from 'vue';
import * as Sentry from '@sentry/browser';
import { getSeoLibName } from '@/utils';
import {
  ERROR_CODE_NO_GITHUB_DATA,
  ERROR_CODE_FETCH_GITHUB_REPO_FAILED,
} from '@/constants';
import { nanoid } from 'nanoid';
import {
  catalogRepoIdToLib,
  catalogNpmToLib,
  CatalogLibraryT,
} from '@/libraries-catalog';
import { DeepReadonly } from 'ts-essentials';
import { TechRadarT, repoToTechRadarMap } from '@/techradar.config';
import {
  ContributorsT,
  cacheR as contributorsMapR,
} from '@/components/github-contributors/api';
import {
  NpmPackageReleasesT,
  cacheR as npmReleasesMapR,
} from '@/components/npm-releases/api';
import {
  CommitsResponseItemT,
  cacheR as commitsMapR,
} from '@/components/commits/api';
import {
  NpmDownloadT,
  cacheR as npmDownloadsMapR,
} from '@/components/downloads/api';
import {
  LibGTrendsT,
  cacheR as googleTrendsMapR,
} from '@/components/google-trends/api';
import {
  repoIdToDataMap as repoIdToDevUsageDataMap,
  StateOfJSItemT,
} from '@/components/developer-usage/stateof-js-css-data';
import {
  BundlephobiaT,
  cacheR as bundlesizeMapR,
} from '@/components/bundle-size/api';
import { StarsT, cacheR as starsMapR } from '@/components/github-stars/api';

const npmPackageCache = new Map();
const githubCache = new Map();

export interface RepoT {
  repoId: string;
  repoName: string;
  description: string;
  stars: number;
  createdAt: string;
  closedIssues: number;
  closedBugIssues: number;
  openIssues: number;
  openBugIssues: number;
}

export interface NpmPackageT {
  name: string;
  description: string;
  license: string;
  repo: string;
  repoId: string;
  repoName: string;
  version: string;
  dependencies: string[];
  hasBuiltinTypes: boolean;
  hasOtherTypes: boolean;
  typesPackageName: string;
}

type LibCommitsT = CommitsResponseItemT[] | null | undefined;
type LibNpmDownloadsT = NpmDownloadT[] | null | undefined;
type LibBundleSizeT = BundlephobiaT | null | undefined;
type LibStarsT = StarsT[] | null | undefined;

export interface LibraryT {
  id: string;
  npmPackage?: NpmPackageT | null;
  category?: string | null;
  isNpmAByProduct?: boolean | null;
  repo: RepoT;
  alias: string;
  tradar: TechRadarT | null;
  contributors: ContributorsT[] | null | undefined; // null for errors, undefined for not loaded yet
  npmReleases: NpmPackageReleasesT[] | null | undefined;
  npmDownloads: LibNpmDownloadsT;
  npmDownloadsGrowth: number | null | undefined;
  commits: LibCommitsT;
  googleTrends: LibGTrendsT | undefined;
  devUsage: StateOfJSItemT | undefined;
  bundlesize: LibBundleSizeT;
  stars: LibStarsT;
}

export type ReadonlyLibraryT = DeepReadonly<LibraryT>;

export async function fetchLibraryByNpm(pkgName: string): Promise<LibraryT> {
  const library = catalogNpmToLib[pkgName] || null;
  const npmPackage = await fetchNpmPackage(pkgName);
  const repo = await fetchGithubRepo(npmPackage.repoId);

  return getLibrary(repo, npmPackage, library);
}

export async function fetchLibraryByRepo(repoId: string): Promise<LibraryT> {
  const library = catalogRepoIdToLib[repoId.toLowerCase()] || null;
  const npmPackageName = (library && library.npm) || null;
  const fetchNpmPromise = npmPackageName
    ? fetchNpmPackage(npmPackageName)
    : Promise.resolve(null);

  const [repo, npmPackage] = await Promise.all([
    fetchGithubRepo(repoId),
    fetchNpmPromise,
  ]);

  return getLibrary(repo, npmPackage, library);
}

function getLibrary(
  repo: RepoT,
  npmPackage: NpmPackageT | null,
  library: CatalogLibraryT
): LibraryT {
  const isNpmAByProduct = (library && library.isNpmAByProduct) || false;
  const category = (library && library.category) || null;

  return {
    id: nanoid(),
    repo,
    npmPackage,
    category,
    isNpmAByProduct,
    alias: getSeoLibName(repo.repoId),
    tradar: repoToTechRadarMap[repo.repoId] || null,
    // Use @ts-ignore because the Computed Ref will eventually become Reactive and then Typescript will start arguing
    // @ts-ignore
    contributors: computed(() => contributorsMapR.get(repo.repoId)),
    // @ts-ignore
    npmReleases: computed(() =>
      npmPackage ? npmReleasesMapR.get(npmPackage.name) : null
    ),
    // @ts-ignore
    npmDownloads: computed(() =>
      npmPackage ? npmDownloadsMapR.get(npmPackage.name) : null
    ),
    npmDownloadsGrowth: (computed(() => {
      if (!npmPackage) {
        return null;
      }
      const npmDownloads = npmDownloadsMapR.get(npmPackage.name);
      if (!npmDownloads) {
        return undefined;
      }

      const downloads = npmDownloads.map((val) => val.downloads);
      const last = downloads.slice(-1)[0];
      const first = downloads.slice(-6, -5)[0];

      if (!first || !last) {
        return null;
      }

      return 100 * (Math.pow(last / first, 1 / 6) - 1);
    }) as unknown) as number | undefined | null,
    // @ts-ignore
    stars: computed(() => starsMapR.get(repo.repoId.toLowerCase())),
    // @ts-ignore
    bundlesize: computed(() =>
      npmPackage ? bundlesizeMapR.get(npmPackage.name) : null
    ),
    devUsage: repoIdToDevUsageDataMap[repo.repoId],
    // @ts-ignore
    googleTrends: computed(() => googleTrendsMapR.get(repo.repoId)),
    // @ts-ignore
    commits: computed(() => commitsMapR.get(repo.repoId)),
  };
}

function fetchGithubRepo(repoId: string): Promise<RepoT> {
  if (githubCache.get(repoId)) {
    return Promise.resolve(githubCache.get(repoId));
  }

  return axios
    .get<RepoT>(`https://github.moiva.workers.dev/?repo=${repoId}`)
    .then(({ data }) => {
      githubCache.set(repoId, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, `fetchGithubRepo ${repoId}`);
      return Promise.reject(ERROR_CODE_FETCH_GITHUB_REPO_FAILED);
    });
}

function fetchNpmPackage(packageName: string): Promise<NpmPackageT> {
  const fetchPackageFunc = fetchNpmJSPackage; // Another alternative: fetchNpmsIOPackage;

  if (npmPackageCache.get(packageName)) {
    return Promise.resolve(npmPackageCache.get(packageName));
  }

  return fetchPackageFunc(packageName)
    .then((data) => {
      npmPackageCache.set(packageName, {
        ...data,
        hasOtherTypes: false,
        typesPackageName: '',
      });

      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Do not spam Sentry with "expected" errors
      if (errorCode !== ERROR_CODE_NO_GITHUB_DATA) {
        reportSentry(err, 'fetchNpmPackage');
      }

      return Promise.reject(errorCode);
    });
}

function fetchNpmJSPackage(packageName: string): Promise<NpmPackageT> {
  return axios
    .get(`https://npm-details.moiva.workers.dev/?pkg=${packageName}`)
    .then(({ data }) => {
      const repoData = getRepoData(packageName, data.repository);

      if (!repoData) {
        return Promise.reject('NO GITHUB DATA');
      }

      return {
        ...data,
        ...repoData,
      };
    });
}

interface RepT {
  type: string;
  url: string;
}

function getRepoData(
  packageName: string,
  repository: null | RepT
): null | { repo: string; repoId: string; repoName: string } {
  const lib = catalogNpmToLib[packageName];
  const hasCatalogLibGithub = lib && lib.repoId;
  const hasPackageGithub =
    repository &&
    repository.type === 'git' &&
    repository.url.indexOf('github.com') !== -1;

  if (!hasCatalogLibGithub && !hasPackageGithub) {
    return null;
  }

  let repoUrl: string;
  let repoId: string;

  if (hasCatalogLibGithub) {
    repoUrl = `https://github.com/${lib.repoId}`;
    repoId = lib.repoId;
  } else {
    const endRepoUrlIndex =
      (repository as RepT).url.slice(-4) === '.git' ? -4 : 400;

    repoUrl =
      'https://' +
      (repository as RepT).url.slice(
        (repository as RepT).url.indexOf('github.com'),
        endRepoUrlIndex
      );
    repoId = repoUrl.slice(repoUrl.indexOf('github.com') + 11);
  }

  return {
    repo: repoUrl,
    repoId,
    repoName: repoId.slice(repoId.indexOf('/') + 1),
  };
}

// interface NpmsIOPackageResponseT {
//   collected: {
//     metadata: {
//       name: string;
//       description: string;
//       license: string;
//       version: string;
//       links: { repository: string };
//     };
//   };
// }

// function fetchNpmsIOPackage(packageName: string): Promise<NpmPackageT> {
//   return axios
//     .get(`https://api.npms.io/v2/package/${encodeURIComponent(packageName)}`)
//     .then((resp) => {
//       const {
//         collected: {
//           metadata: {
//             name,
//             description,
//             version,
//             license,
//             links: { repository },
//           },
//         },
//       } = resp.data as NpmsIOPackageResponseT;
//
//       const repoId = repository.slice(repository.indexOf('github.com') + 11);
//
//       return {
//         name,
//         description,
//         dependencies: [],
//         version,
//         license,
//         repo: repository,
//         repoId,
//         repoName: repoId.slice(repoId.indexOf('/') + 1),
//       };
//     });
// }

function reportSentry(err: AxiosError, methodName: string): void {
  err.name = `UI API (${methodName})`;

  Sentry.captureException(err, {
    tags: {
      apiResponseMessage: err.response?.data?.error || '',
      apiRequestUrl: err.config?.url || '',
    },
  });
}
