<template>
  <m-chart
    v-if="isDisplayed"
    title="NPM Downloads monthly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>NPM downloads monthly.</p>
    <p>Data source: <a href="https://www.npmjs.com/" target="_blank">NPM</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
import { NpmDownloadT } from './api';
import {
  numbersFormatter,
  getEarliestMonth,
  getPrevMonth,
  getNamesStr,
  formatPercent,
} from '@/utils';
import { enUS } from 'date-fns/locale';
import { NpmPackageT, ReadonlyLibraryT } from '@/libraryApis';
import { chartsVisibility } from '@/store/chartsVisibility';
import { npmPackagesNames } from '@/store/libraries';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends ReadonlyLibraryT {
  npmPackage: NpmPackageT;
  npmDownloads: NpmDownloadT[];
  npmDownloadsGrowth: number;
}

export default defineComponent({
  name: 'NpmDownloadsChart',

  setup() {
    watchEffect(() => {
      chartsVisibility.npmDownloads = npmPackagesNames.value.length > 0;
    });

    const filteredLibsRef = computed(
      () => librariesRR.filter((lib) => !!lib.npmDownloads) as FilteredLibT[]
    );

    // Calculate startMonth based on packages creation date
    const startMonthRef = computed(() => {
      const validCreationDates = filteredLibsRef.value
        .map((lib) => lib.npmCreationDate)
        .filter((date) => !!date) as string[];

      return getPrevMonth(getEarliestMonth(validCreationDates, '2017-01'));
    });

    const datasets = computed<ChartDataset<'line'>[]>(() =>
      filteredLibsRef.value.map((lib) => ({
        label: lib.npmPackage.name,
        data: lib.npmDownloads
          .filter(({ month }) => month >= startMonthRef.value)
          .map(({ downloads }) => downloads),
        backgroundColor: lib.color,
        borderColor: lib.color,
        pointRadius: 0,
      }))
    );

    const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
      type: 'line',
      data: {
        labels: filteredLibsRef.value.length
          ? filteredLibsRef.value[0].npmDownloads
              .map(({ month }) => month)
              .filter((month) => month >= startMonthRef.value)
          : [],
        datasets: datasets.value,
      },
      options: {
        elements: { line: { tension: 0.1 } },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: startMonthRef.value > '2019-10' ? 'month' : 'year',
              tooltipFormat: 'MMM, yyyy',
            },
            adapters: { date: { locale: enUS } },
          },
          y: { ticks: { callback: numbersFormatter.format as () => string } },
        },
      },
    }));

    const packagesNames = computed(() =>
      filteredLibsRef.value.map((lib) => lib.npmPackage.name)
    );
    const aliasesRef = computed(() =>
      filteredLibsRef.value.map((lib) => lib.alias)
    );

    const isLoadingRef = computed(
      () =>
        isLoadingLibraries.value ||
        librariesRR.filter((lib) => lib.npmDownloads === undefined).length > 0
    );

    return {
      isDisplayed: chartsVisibility.npmDownloads,
      isLoading: isLoadingRef,
      packagesNames,
      chartConfig,
      isError: computed(() => filteredLibsRef.value.length === 0),
      ariaLabel: computed<string>(() => {
        const str = filteredLibsRef.value
          .map(
            (lib) =>
              `${
                lib.alias
              } npm downloads increase on average by ${formatPercent(
                lib.npmDownloadsGrowth
              )} per month.`
          )
          .join(' ');
        return `Npm Downloads statistics for ${getNamesStr(
          aliasesRef.value
        )}. ${str}`;
      }),
      failedPackagesNames: computed<string[]>(() => {
        if (isLoadingRef.value) {
          return [];
        }
        return librariesRR
          .filter((lib) => !!lib.npmPackage && !lib.npmDownloads)
          .map((lib) => (lib.npmPackage as NpmPackageT).name);
      }),
    };
  },
});
</script>
