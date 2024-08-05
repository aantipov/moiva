import { type DeepReadonly } from 'vue';
import axios, { AxiosError } from 'axios';
// import * as Sentry from '@sentry/vue';
// TODO: SENTRY
import { ERROR_CODE_NO_GITHUB_DATA } from '@/constants';
import { getNpmLibraryByNpm } from '@/data/index';
import { getLibrary, type LibraryT } from '@/getLibrary';
import type { NpmInfoApiResponseT } from '@/shared-types';

const npmPackageCache = new Map();

export type RepoT = NpmInfoApiResponseT['repo'];
export type NpmPackageT = NpmInfoApiResponseT['npm'];
export type ReadonlyNpmPackageT = DeepReadonly<NpmPackageT>;

export type LibraryReadonlyT = DeepReadonly<LibraryT>;
export type LibrariesReadonlyT = DeepReadonly<LibraryT[]>;

export async function fetchLibraryByNpm(pkgName: string): Promise<LibraryT> {
  const catalogLibrary = getNpmLibraryByNpm(pkgName) || null;
  const npmPackage = await fetchNpmPackage(pkgName);

  return getLibrary(npmPackage, catalogLibrary);
}

function fetchNpmPackage(packageName: string): Promise<NpmInfoApiResponseT> {
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

function fetchNpmJSPackage(packageName: string): Promise<NpmInfoApiResponseT> {
  return axios
    .get<NpmInfoApiResponseT>(`/npm-info/${encodeURIComponent(packageName)}`)
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
  methodName: string,
): void {
  err.name = `UI API (${methodName})`;

  // Sentry.captureException(err, {
  //   tags: {
  //     apiResponseMessage: err.response?.data?.error || '',
  //     apiRequestUrl: err.config?.url || '',
  //   },
  // });
}
