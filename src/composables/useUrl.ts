import { watchEffect, onMounted } from 'vue';
import { constructHref } from '@/utils';
import { LibrariesReadonlyT } from '@/libraryApis';
import { isLoading, librariesRR } from '@/store/libraries';

export function useUrl(): void {
  onMounted(() => {
    // On every Library change (load, de-load) update title
    watchEffect(() => {
      // Wait until all libraries are finished loading
      if (isLoading.value) {
        return;
      }

      updateUrl(librariesRR);
    });
  });
}

// Update the URL whenever a user selects/deselects a library
function updateUrl(libraries: LibrariesReadonlyT): void {
  const Url = new URL(window.location.href);
  const originalHref = '/' + Url.search;
  const npmPackagesNames = libraries.map((library) => library.npmPackage.name);

  const newHref = constructHref(npmPackagesNames);

  if (newHref !== originalHref) {
    window.history.pushState(null, '', newHref);
  }
}
