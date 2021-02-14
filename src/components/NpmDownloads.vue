<template>
  <NpmDownloadsChart
    v-if="npmPackagesNames.length"
    :is-loading="isLoading"
    :is-error="isError"
    :packages-names="successItemsIds"
    :failed-packages-names="failedItemsIds"
    :packages-downloads="items"
    :package-to-color-map="npmPackageToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import NpmDownloadsChart from './NpmDownloadsChart.vue';
import { fetchNpmDownloads, NpmDownloadT } from '@/apis';
import { chartsVisibility } from '@/store/chartsVisibility';
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
    } = useChartApi<NpmDownloadT[]>(
      npmPackagesNames,
      isLoadingLibraries,
      fetchNpmDownloads
    );

    watchEffect(() => {
      chartsVisibility.npmDownloads = npmPackagesNames.value.length > 0;
    });

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
