import { watchEffect } from 'vue';
import { useTitle } from '@vueuse/core';
import { isLoading, librariesRR } from '@/store/libraries';
import { getSEOTitle } from '@/ssrHelper';

export function useDocumentTitle(): void {
  const title = useTitle();
  // On every Library change (load, de-load) update title
  watchEffect(() => {
    // Wait until all libraries are finished loading
    if (isLoading.value) {
      return;
    }

    const npmPackages = librariesRR
      .filter(({ npmPackage }) => !!npmPackage)
      .map(({ npmPackage }) => npmPackage!.name as string)
      .sort();
    title.value = getSEOTitle(npmPackages);
  });
}
