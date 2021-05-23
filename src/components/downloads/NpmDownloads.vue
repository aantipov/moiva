<template>
  <NpmDownloadsChart
    v-if="npmPackagesNames.length"
    :is-loading="isLoading"
    :is-error="isError"
    :packages-names="successPackagesNames"
    :failed-packages-names="failedPackagesNames"
    :packages-downloads="items"
    :package-to-color-map="npmPackageToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import NpmDownloadsChart from './NpmDownloadsChart.vue';
import { fetchNpmDownloads, NpmDownloadT } from './api';
import { chartsVisibility } from '@/store/chartsVisibility';
import useChartApi from '@/composables/useChartApi';
import { getEarliestMonth, getPrevMonth } from '@/utils';
import { NpmPackageT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
  npmPackagesNames,
} from '@/store/libraries';

export default defineComponent({
  name: 'NpmDownloads',

  components: { NpmDownloadsChart },

  setup() {
    useChartApi<NpmDownloadT[]>(
      npmPackagesNames,
      isLoadingLibraries,
      fetchNpmDownloads
    );

    watchEffect(() => {
      chartsVisibility.npmDownloads = npmPackagesNames.value.length > 0;
    });

    const filteredLibsR = computed(() =>
      librariesRR.filter((lib) => !!lib.npmDownloads)
    );

    // Calculate startMonth based on packages creation date
    const startMonth = computed(() => {
      const defaultValue = '2017-01';
      const validCreationDates = filteredLibsR.value
        .map((lib) => lib.npmCreationDate)
        .filter((date) => !!date) as string[];

      if (
        !filteredLibsR.value.length ||
        validCreationDates.length < filteredLibsR.value.length
      ) {
        return defaultValue;
      }

      return getPrevMonth(getEarliestMonth(validCreationDates, defaultValue));
    });

    const isLoadingRef = computed(
      () =>
        isLoadingLibraries.value ||
        librariesRR.filter((lib) => lib.npmDownloads === undefined).length > 0
    );

    return {
      isLoading: isLoadingRef,
      isError: computed(() => filteredLibsR.value.length === 0),
      npmPackagesNames, // all items
      successPackagesNames: computed(() =>
        filteredLibsR.value.map((lib) => (lib.npmPackage as NpmPackageT).name)
      ),
      items: computed(() =>
        filteredLibsR.value.map((lib) =>
          (lib.npmDownloads as NpmDownloadT[]).filter(
            // Filter out data earlier startMonth
            ({ month }) => month >= startMonth.value
          )
        )
      ),
      filteredLibsR,
      failedPackagesNames: computed<string[]>(() => {
        if (isLoadingRef.value) {
          return [];
        }
        return librariesRR
          .filter((lib) => !!lib.npmPackage && !lib.npmDownloads)
          .map((lib) => (lib.npmPackage as NpmPackageT).name);
      }),
      npmPackageToColorMap: computed(() =>
        filteredLibsR.value.reduce((acc, lib) => {
          const pkgName = (lib.npmPackage as NpmPackageT).name;
          acc[pkgName] = lib.color;
          return acc;
        }, {} as Record<string, string>)
      ),
    };
  },
});
</script>
