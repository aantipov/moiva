import { DeepReadonly } from 'vue';
import axios, { AxiosError } from 'axios';
// import * as Sentry from '@sentry/vue';
// TODO: SENTRY
import {
  ERROR_CODE_NO_GITHUB_DATA,
  ERROR_CODE_FETCH_GITHUB_REPO_FAILED,
} from '@/constants';
import { getNpmLibraryByNpm } from '@/data/index';
import { getLibrary, LibraryT } from '@/getLibrary';
import type { NpmInfoApiResponseT } from '@/shared-types';

const npmPackageCache = new Map();
const githubCache = new Map();

export interface RepoT {
  repoId: string;
  repoName: string;
  homepageUrl: string;
  description: string;
  isArchived?: boolean; // optional for transitional period (api cache expiration)
  stars: number;
  createdAt: string;
  lastCommitAt: string;
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

export type NpmPackageT = NpmInfoApiResponseT;

export type ReadonlyNpmPackageT = DeepReadonly<NpmPackageT>;

export type LibraryReadonlyT = DeepReadonly<LibraryT>;
export type LibrariesReadonlyT = DeepReadonly<LibraryT[]>;

export async function fetchLibraryByNpm(pkgName: string): Promise<LibraryT> {
  const catalogLibrary = getNpmLibraryByNpm(pkgName) || null;
  const npmPackage = await fetchNpmPackage(pkgName);
  const repo = await fetchGithubRepo(npmPackage.repoId);

  return getLibrary(repo, npmPackage, catalogLibrary);
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
    .get<NpmPackageT>(`/npm-info/${packageName}`)
    .then(({ data }) => data);
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

function reportSentry(
  err: AxiosError<{ error?: string }>,
  methodName: string
): void {
  err.name = `UI API (${methodName})`;

  // Sentry.captureException(err, {
  //   tags: {
  //     apiResponseMessage: err.response?.data?.error || '',
  //     apiRequestUrl: err.config?.url || '',
  //   },
  // });
}
