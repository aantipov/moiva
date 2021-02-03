import { reactive, computed, readonly } from 'vue';
import {
  LibraryT,
  fetchLibraryByRepo,
  fetchLibraryByNpm,
  NpmPackageT,
} from '@/libraryApis';

// ====== STATE ======
const librariesR = reactive<LibraryT[]>([]);
// Track Npm packages and Repos currently being loaded to avoid duplicates
const npmPackagesLoading = reactive<string[]>([]);
const reposLoading = reactive<string[]>([]);

// ====== COMPUTED ======
export const libraries = readonly(librariesR);
export const isLoading = computed(
  () => !!npmPackagesLoading.length || !!reposLoading.length
);
export const librariesIds = computed<string[]>(() =>
  librariesR.map((lib) => lib.id)
);
const reposIdsWithDuplicates = computed<string[]>(() =>
  libraries.map((lib) => lib.repo.repoId)
);
export const reposIds = computed<string[]>(() => [
  ...new Set(reposIdsWithDuplicates.value),
]);
export const npmPackagesNames = computed<string[]>(() =>
  libraries
    .filter((lib) => !!lib.npmPackage)
    .map((lib) => (lib.npmPackage as NpmPackageT).name)
);
/**
 * There can be libraries with duplicate repos potentially,
 * e.g. two npm packages with the same repo.
 * We take only the first repo.
 */
export const repoToLibraryIdMap = computed<Record<string, string>>(() => {
  return reposIds.value.reduce((acc, repoId) => {
    if (!acc[repoId]) {
      acc[repoId] = (librariesR.find(
        (lib) => lib.repo.repoId === repoId
      ) as LibraryT).id;
    }

    return acc;
  }, {} as Record<string, string>);
});

export const npmPackageToLibraryIdMap = computed<Record<string, string>>(() => {
  return libraries
    .filter((lib) => !!lib.npmPackage)
    .reduce((acc, lib) => {
      acc[(lib.npmPackage as NpmPackageT).name] = lib.id;

      return acc;
    }, {} as Record<string, string>);
});

/**
 * Add a library via a Github repository
 */
export function addLibraryByRepo(repoId: string): Promise<void> {
  // TODO: make sure there is only one pair (npmName, repoId)
  if (!repoId || reposLoading.includes(repoId)) {
    return Promise.resolve();
  }

  reposLoading.push(repoId);

  return fetchLibraryByRepo(repoId)
    .then((lib) => {
      librariesR.push(lib);
    })
    .finally(() => reposLoading.splice(reposLoading.indexOf(repoId), 1));
}

/**
 * Add a library via a Npm package
 */
export function addLibraryByNpmPackage(pkgName: string): Promise<void> {
  // TODO: make sure there is only one pair (npmName, repoId)
  if (
    !pkgName ||
    npmPackagesNames.value.includes(pkgName) ||
    npmPackagesLoading.includes(pkgName)
  ) {
    return Promise.resolve();
  }

  npmPackagesLoading.push(pkgName);

  return fetchLibraryByNpm(pkgName)
    .then((lib) => {
      librariesR.push(lib);
    })
    .finally(() =>
      npmPackagesLoading.splice(npmPackagesLoading.indexOf(pkgName), 1)
    );
}

export function removeLibrary(libraryId: string): void {
  librariesR.splice(librariesIds.value.indexOf(libraryId), 1);
}
