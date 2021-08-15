import { DeepReadonly } from 'vue';
import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/vue';
import {
  ERROR_CODE_NO_GITHUB_DATA,
  ERROR_CODE_FETCH_GITHUB_REPO_FAILED,
} from '@/constants';
import {
  getRepoCoreNpmArtifact,
  getGithubLibraryByRepo,
  getNpmLibraryByNpm,
} from '@/data/index';
import { getLibrary, LibraryT } from '@/getLibrary';

const npmPackageCache = new Map();
const githubCache = new Map();

export interface RepoT {
  repoId: string;
  repoName: string;
  description: string;
  isArchived?: boolean; // optional for transitional period (api cache expiration)
  stars: number;
  createdAt: string;
  closedIssues: number;
  closedBugIssues: number;
  openIssues: number;
  openBugIssues: number;
  licenseInfo: {
    key: string;
    name: string;
    url: string;
  } | null;
}

export interface NpmPackageT {
  name: string;
  description: string;
  license: string;
  repoId: string;
  version: string;
  dependencies: string[];
  hasBuiltinTypes: boolean;
  hasOtherTypes: boolean;
  typesPackageName: string;
}

export type LibraryReadonlyT = DeepReadonly<LibraryT>;
export type LibrariesReadonlyT = DeepReadonly<LibraryT[]>;

export async function fetchLibraryByNpm(pkgName: string): Promise<LibraryT> {
  const catalogLibrary = getNpmLibraryByNpm(pkgName) || null;
  const npmPackage = await fetchNpmPackage(pkgName);
  const repo = await fetchGithubRepo(npmPackage.repoId);

  return getLibrary(repo, npmPackage, catalogLibrary);
}

/**
 * When fetching data by repo,
 * check in the catalog if the repo has an npm package as its Core artifact
 * otherwise try find an entry without npm
 */
export async function fetchLibraryByRepo(repoId: string): Promise<LibraryT> {
  const coreNpmLibrary = getRepoCoreNpmArtifact(repoId);
  let library;
  let fetchNpmPromise;

  if (coreNpmLibrary) {
    library = coreNpmLibrary;
    fetchNpmPromise = fetchNpmPackage(coreNpmLibrary.npm);
  } else {
    library = getGithubLibraryByRepo(repoId) || null;
    fetchNpmPromise = Promise.resolve(null);
  }

  const [repo, npmPackage] = await Promise.all([
    fetchGithubRepo(repoId),
    fetchNpmPromise,
  ]);

  return getLibrary(repo, npmPackage, library);
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

      return Promise.reject(errorCode);
    });
}

function fetchNpmJSPackage(packageName: string): Promise<NpmPackageT> {
  return axios
    .get(`https://npm-details.moiva.workers.dev/?pkg=${packageName}`)
    .then(({ data }) => {
      const catalogLibrary = getNpmLibraryByNpm(packageName);
      const repoId = catalogLibrary
        ? catalogLibrary.repoId
        : getRepoId(data.repository);

      if (!repoId) {
        return Promise.reject('NO GITHUB DATA');
      }

      return { ...data, repoId };
    });
}

interface RepT {
  type: string;
  url: string;
}

function getRepoId(repository: RepT | null): string | null {
  const hasPackageGithub =
    repository &&
    repository.type === 'git' &&
    repository.url.indexOf('github.com') !== -1;

  if (!hasPackageGithub) {
    return null;
  }

  const endRepoUrlIndex =
    (repository as RepT).url.slice(-4) === '.git' ? -4 : 400;

  const repoId = (repository as RepT).url.slice(
    (repository as RepT).url.indexOf('github.com') + 11,
    endRepoUrlIndex
  );

  return repoId;
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
