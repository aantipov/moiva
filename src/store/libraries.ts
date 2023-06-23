import { reactive, computed, readonly, watch } from 'vue';
import { RepoT, fetchLibraryByNpm, NpmPackageT } from '@/libraryApis';
import { LibraryT } from '@/getLibrary';
import { $trimmedLibraries, $isLoading } from '@/nanostore/trimmedLibraries';

// ====== STATE ======
const librariesR = reactive<LibraryT[]>([]);
// Track Npm packages and Repos currently being loaded to avoid duplicates
const npmPackagesLoading = reactive<string[]>([]);
const reposLoading = reactive<string[]>([]);

export function sortLibraries(
  sortFn: (_a: LibraryT, _b: LibraryT) => number,
  isReverse = false
): void {
  librariesR.sort(sortFn);
  if (isReverse) {
    librariesR.reverse();
  }
}

watch(
  librariesR,
  (newLibraries) => {
    const trimmedLibraries = newLibraries.map(
      ({ id, tags, catalogLibraryId, repo, npmPackage, alias }) => ({
        id,
        tags,
        catalogLibraryId,
        repo,
        npmPackage,
        alias,
      })
    );
    $trimmedLibraries.set(trimmedLibraries);
  },
  { deep: true }
);

// ====== COMPUTED ======
// deprecated in favor of librariesRR to make the value clear - reactive readonly
export const libraries = readonly(librariesR);
export const librariesRR = libraries;
export const isLoading = computed(
  () => !!npmPackagesLoading.length || !!reposLoading.length
);
watch(isLoading, (isLoadingValue) => $isLoading.set(isLoadingValue));
export const librariesIds = computed<string[]>(() =>
  librariesR.map((lib) => lib.id)
);
const reposIdsWithDuplicates = computed<string[]>(() =>
  libraries.map((lib) => lib.repo.repoId.toLowerCase())
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
 * Selected libs category
 */
export const categoryRef = computed<string | null>(() => {
  if (!librariesR.length) {
    return null;
  }

  const categories = librariesR
    .filter((lib) => !!lib.category && lib.category !== 'misc')
    .map((lib) => lib.category);

  const uniqueCategories = [...new Set(categories)];

  if (uniqueCategories.length === 1) {
    return uniqueCategories[0];
  }

  return null;
});

/**
 * There can be libraries with duplicate repos potentially,
 * e.g. two npm packages with the same repo.
 * We take only the first repo.
 */
export const repoToLibraryIdMap = computed<Record<string, string>>(() => {
  return reposIds.value.reduce((acc, repoId) => {
    if (!acc[repoId]) {
      acc[repoId] = (
        librariesR.find(
          (lib) => lib.repo.repoId.toLowerCase() === repoId
        ) as LibraryT
      ).id;
    }

    return acc;
  }, {} as Record<string, string>);
});

export const repoIdToRepoMap = computed<Record<string, RepoT>>(() => {
  return librariesR.reduce((acc, library) => {
    const repoId = library.repo.repoId.toLowerCase();
    if (!acc[repoId]) {
      acc[repoId] = library.repo;
    }

    return acc;
  }, {} as Record<string, RepoT>);
});

export const npmPackageToLibraryIdMap = computed<Record<string, string>>(() => {
  return libraries
    .filter((lib) => !!lib.npmPackage)
    .reduce((acc, lib) => {
      acc[(lib.npmPackage as NpmPackageT).name] = lib.id;

      return acc;
    }, {} as Record<string, string>);
});

function hasLibraryADuplicate(library: LibraryT): boolean {
  return librariesR.some(
    ({ repo, npmPackage }) =>
      repo.repoId === library.repo.repoId &&
      npmPackage?.name === library.npmPackage?.name
  );
}

export async function addInitialLibrariesByNpm(
  npmPackages: string[]
): Promise<void> {
  npmPackagesLoading.push(...npmPackages);
  const libs = await Promise.all(
    npmPackages.map((pkgName) => fetchLibraryByNpm(pkgName))
  );
  librariesR.push(...libs);
  npmPackagesLoading.length = 0;
}

/**
 * Add a library via a Npm package
 */
export function addLibraryByNpmPackage(pkgName: string): Promise<void> {
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
      if (!hasLibraryADuplicate(lib)) {
        librariesR.push(lib);
      }
    })
    .finally(() =>
      npmPackagesLoading.splice(npmPackagesLoading.indexOf(pkgName), 1)
    );
}

export function removeLibrary(libraryId: string): void {
  if (librariesIds.value.length === 1) {
    window.location.assign('/');
    return;
  }
  librariesR.splice(librariesIds.value.indexOf(libraryId), 1);
}

export function removeAllLibraries(): void {
  librariesR.length = 0;
}
