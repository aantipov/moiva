import { computed } from 'vue';
import { reposIds, librariesRR } from '@/store/libraries';
import { repoToGTrendDefMap, StateOfJSItemT } from '@/data/index';
import { LibraryReadonlyT } from '@/libraryApis';

interface FilteredDevUsageLibT extends LibraryReadonlyT {
  readonly devUsage: StateOfJSItemT;
}

export function useChartsVisibility() {
  return {
    npmDownloads: computed(
      () => librariesRR.filter((lib) => !!lib.npmDownloads).length > 0
    ),
    googleTrends: computed(
      () =>
        reposIds.value.filter((repoId) => !!repoToGTrendDefMap[repoId]).length >
        0
    ),
    developerUsage: computed(() => {
      const filteredLibs = librariesRR.filter(
        (lib) => !!lib.devUsage
      ) as FilteredDevUsageLibT[];

      return (
        filteredLibs.length > 0 &&
        !(
          filteredLibs.length === 1 &&
          filteredLibs[0].devUsage.usage.length === 1
        )
      );
    }),
    npmReleases: computed(
      () => librariesRR.filter((lib) => !!lib.npmReleases).length > 0
    ),
    techRadar: computed(
      () => librariesRR.filter((lib) => !!lib.tradar).length > 0
    ),
  };
}
