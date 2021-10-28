import { watchEffect } from 'vue';
import { useTitle } from '@vueuse/core';
import { LibrariesReadonlyT } from '@/libraryApis';
import { isLoading, librariesRR } from '@/store/libraries';

export function useDocumentTitle(): void {
  const title = useTitle();
  // On every Library change (load, de-load) update title
  watchEffect(() => {
    // Wait until all libraries are finished loading
    if (isLoading.value) {
      return;
    }

    title.value = getTitle(librariesRR);
  });
}

function getTitle(libraries: LibrariesReadonlyT): string {
  if (!libraries.length) {
    return 'Moiva.io - Discover and Compare NPM packages';
  }

  if (libraries.length === 1) {
    return `${libraries[0].alias}: Stats and Trends from NPM, GitHub, ... - Moiva.io`;
  }

  const aliases = libraries.map(({ alias }) => alias).sort();

  return `${aliases.join(' vs ')}: Which One to Choose? - Moiva.io`;
}
