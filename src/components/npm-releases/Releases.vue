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
import { getQuarterMonthFromDate, getPreviousQuater } from '@/utils';
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
      const validCreationDates = successItemsIds.value
        .map((pkg) => npmCreationDatesMap.get(pkg))
        .filter((creationDate) => !!creationDate);

      if (
        !successItemsIds.value.length ||
        validCreationDates.length < successItemsIds.value.length
      ) {
        return defaultValue;
      }

      const earliestCreationDate = (validCreationDates as string[])
        .sort((a, b) => {
          if (a > b) {
            return 1;
          } else if (a < b) {
            return -1;
          } else {
            return 0;
          }
        })[0]
        .slice(0, 7);

      const earliestQuater = getPreviousQuater(
        getQuarterMonthFromDate(earliestCreationDate)
      );

      return defaultValue > earliestQuater ? defaultValue : earliestQuater;
    });

    // Filter out data earlier startQuater
    const filteredItems = computed(() =>
      items.value.map((pkgReleases) =>
        pkgReleases.filter(({ month }) => month >= startQuater.value)
      )
    );

    return {
      startQuater,
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
