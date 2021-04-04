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
import { npmCreationDatesMap } from '@/store/npmCreationDates';
import useChartApi from '@/composables/useChartApi';
import { getEarliestMonth } from '@/utils';
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

    // Calculate startMonth based on packages creation date
    const startMonth = computed(() => {
      const defaultValue = '2017-01';
      const validCreationDates = successItemsIds.value
        .map((pkg) => npmCreationDatesMap.get(pkg))
        .filter((creationDate) => !!creationDate) as string[];

      if (
        !successItemsIds.value.length ||
        validCreationDates.length < successItemsIds.value.length
      ) {
        return defaultValue;
      }

      return getEarliestMonth(validCreationDates, defaultValue);
    });

    // Filter out data earlier startMonth
    const filteredItems = computed(() =>
      items.value.map((pkgDownloads) =>
        pkgDownloads.filter(({ month }) => month >= startMonth.value)
      )
    );

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      npmPackagesNames, // all items
      items: filteredItems,
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
