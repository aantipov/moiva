<template>
  <NpmDownloadsChart
    :is-loading="isLoading"
    :is-error="isError"
    :packages-names="successItemsIds"
    :failed-packages-names="failedItemsIds"
    :packages-downloads="items"
    :package-to-color-map="npmPackageToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import NpmDownloadsChart from './NpmDownloadsChart.vue';
import { fetchNpmDownloads } from '@/apis';
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  npmPackagesNames,
  npmPackageToLibraryIdMap,
} from '@/store/libraries';

export default defineComponent({
  name: 'NpmDownloads',

  components: { NpmDownloadsChart },

  setup() {
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi(npmPackagesNames, isLoadingLibraries, fetchNpmDownloads);

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      items,
      failedItemsIds,
      successItemsIds,
      npmPackageToColorMap: computed(() =>
        (successItemsIds.value as string[]).reduce((acc, npmPackageName) => {
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
