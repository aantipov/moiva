import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';
import { getSeoLibName } from '@/utils';
import {
  ERROR_CODE_NO_GITHUB_DATA,
  ERROR_CODE_FETCH_GITHUB_REPO_FAILED,
} from '@/constants';
import { nanoid } from 'nanoid';
import { catalogRepoIdToLib, catalogNpmToLib } from '@/libraries-catalog';

const npmPackageCache = new Map();
const githubCache = new Map();

export interface RepoT {
  repoId: string;
  repoName: string;
  description: string;
  stars: number;
  createdAt: string;
  vulnerabilitiesCount: number;
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

export interface LibraryT {
  id: string;
  npmPackage?: NpmPackageT | null;
  isNpmAByProduct?: boolean | null;
  repo: RepoT;
  alias: string;
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

export function fetchLibraryByNpm(pkgName: string): Promise<LibraryT> {
  const library = catalogNpmToLib[pkgName] || null;
  const isNpmAByProduct = (library && library.isNpmAByProduct) || false;

  return fetchNpmPackage(pkgName).then((npmPackage) =>
    fetchGithubRepo(npmPackage.repoId).then((repo) => ({
      id: nanoid(),
      repo,
      npmPackage,
      isNpmAByProduct,
      alias: getSeoLibName(repo.repoId),
    }))
  );
}

export function fetchLibraryByRepo(repoId: string): Promise<LibraryT> {
  const library = catalogRepoIdToLib[repoId.toLowerCase()] || null;
  console.log('CATALOG', catalogRepoIdToLib);
  const isNpmAByProduct = (library && library.isNpmAByProduct) || false;
  const npmPackageName = (library && library.npm) || null;
  const fetchNpmPromise = npmPackageName
    ? fetchNpmPackage(npmPackageName)
    : Promise.resolve(null);

  return Promise.all([fetchGithubRepo(repoId), fetchNpmPromise]).then(
    ([repo, npmPackage]) => ({
      id: nanoid(),
      repo,
      npmPackage,
      isNpmAByProduct,
      alias: getSeoLibName(repo.repoId),
    })
  );
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
