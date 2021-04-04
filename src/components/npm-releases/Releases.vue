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
import { defineComponent, computed, watchEffect } from 'vue';
import {
  getEarliestMonth,
  getQuarterMonthFromDate,
  getPreviousQuater,
} from '@/utils';
import { npmCreationDatesMap } from '@/store/npmCreationDates';
import ReleasesChart from './ReleasesChart.vue';
import {
  fetchNpmPackageReleases,
  creationDatesCache,
  NpmPackageReleasesT,
} from './api';
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

    // Add packages creation dates to global store
    watchEffect(() => {
      successItemsIds.value.forEach((pkg) =>
        npmCreationDatesMap.set(pkg, creationDatesCache.get(pkg))
      );
    });

    // Calculate startQuater based on packages creation date
    const startQuater = computed(() => {
      const defaultValue = '2017-01';
      const validCreationQuarters = successItemsIds.value
        .map((pkg) => npmCreationDatesMap.get(pkg))
        .filter((creationDate) => !!creationDate)
        .map((date) =>
          getPreviousQuater(getQuarterMonthFromDate(date as string))
        );

      if (
        !successItemsIds.value.length ||
        validCreationQuarters.length < successItemsIds.value.length
      ) {
        return defaultValue;
      }

      return getEarliestMonth(validCreationQuarters, defaultValue);
    });

    // Filter out data earlier startQuater
    const filteredItems = computed(() =>
      items.value.map((pkgReleases) =>
        pkgReleases.filter(({ month }) => month >= startQuater.value)
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
