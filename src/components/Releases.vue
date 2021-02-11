<template>
  <ReleasesChart
    v-if="npmPackagesNames.length"
    :is-loading="isLoading"
    :is-error="isError"
    :packages-names="successItemsIds"
    :failed-packages-names="failedItemsIds"
    :packages-releases="items"
    :package-to-color-map="npmPackageToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ReleasesChart from './ReleasesChart.vue';
import { fetchNpmPackageReleases, NpmPackageReleasesT } from '@/apis';
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  npmPackagesNames,
  npmPackageToLibraryIdMap,
} from '@/store/libraries';

export default defineComponent({
  name: 'NpmReleases',

  components: { ReleasesChart },

  setup() {
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi<NpmPackageReleasesT[]>(
      npmPackagesNames,
      isLoadingLibraries,
      fetchNpmPackageReleases
    );

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      npmPackagesNames, // all items
      items,
      failedItemsIds,
      successItemsIds,
      npmPackageToColorMap: computed(() =>
        successItemsIds.value.reduce((acc, npmPackageName) => {
          acc[npmPackageName] =
            libraryToColorMap.value[
              npmPackageToLibraryIdMap.value[npmPackageName]
            ];
          return acc;
        }, {} as Record<string, string>)
      ),
    };
  },
});
</script>
