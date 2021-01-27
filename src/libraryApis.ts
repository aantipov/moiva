import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';
import {
  ERROR_CODE_NO_GITHUB_DATA,
  ERROR_CODE_FETCH_GITHUB_REPO_FAILED,
} from '@/constants';
import { nanoid } from 'nanoid';

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
}

export interface LibraryT {
  id: string;
  npmPackage?: NpmPackageT;
  repo: RepoT;
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
  return fetchNpmPackage(pkgName).then((npmPackage) => {
    return fetchGithubRepo(npmPackage.repoId, pkgName).then((repo) => ({
      id: nanoid(),
      npmPackage,
      repo,
    }));
  });
}

function fetchGithubRepo(repoId: string, npmPackage?: string): Promise<RepoT> {
  const [owner, name] = repoId.split('/');

  if (githubCache.get(repoId)) {
    return Promise.resolve(githubCache.get(repoId));
  }

  return axios
    .get<RepoT>(`/api/gh?name=${name}&owner=${owner}&pkg=${npmPackage}`)
    .then(({ data }) => {
      githubCache.set(repoId, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, `fetchGithubRepo ${repoId} (package: ${npmPackage})`);
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
  return axios.get(`/api/npm-package?pkg=${packageName}`).then(({ data }) => {
    const repoId = data.repo.slice(data.repo.indexOf('github.com') + 11);

    return {
      ...data,
      repoId,
      repoName: repoId.slice(repoId.indexOf('/') + 1),
    };
  });
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
