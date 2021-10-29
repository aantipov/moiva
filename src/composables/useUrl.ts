import { watchEffect, onMounted } from 'vue';
import { constructHref } from '@/utils';
import { LibrariesReadonlyT } from '@/libraryApis';
import { isLoading, librariesRR } from '@/store/libraries';
let hasCanonicalUrlCheckProcessed = false;

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
  const npmPackagesNames = [] as string[];
  const reposIds = [] as string[];

  libraries.forEach((library) => {
    if (library.npmPackage) {
      npmPackagesNames.push(library.npmPackage.name);
    } else {
      reposIds.push(library.repo.repoId);
    }
  });

  const newHref = constructHref(npmPackagesNames, reposIds);

  if (!hasCanonicalUrlCheckProcessed) {
    // Let GoogleBot know the canonical URL
    setCanonicalUrl(newHref);
    hasCanonicalUrlCheckProcessed = true;
  }

  if (newHref !== originalHref) {
    window.history.pushState(null, '', newHref);
  }
}

// Let Google Bot know the canonical URL of the page
function setCanonicalUrl(url: string): void {
  const link = document.createElement('link');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', 'https://moiva.io' + url);
  document.head.appendChild(link);
}
