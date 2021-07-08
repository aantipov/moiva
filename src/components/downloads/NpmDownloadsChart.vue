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
    :since="since"
    :since-values="sinceValues"
    @sinceChange="onSinceChange"
  >
    <p>NPM downloads monthly.</p>
    <p>Data source: <a href="https://www.npmjs.com/" target="_blank">NPM</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect, ref } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
import { NpmDownloadT } from './api';
import {
  numbersFormatter,
  getEarliestMonth,
  getPrevMonth,
  getNamesStr,
  formatPercent,
  getDateRanges,
} from '@/utils';
import { enUS } from 'date-fns/locale';
import { NpmPackageT, LibraryReadonlyT } from '@/libraryApis';
import { chartsVisibility } from '@/store/chartsVisibility';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  npmPackage: NpmPackageT;
  npmDownloads: NpmDownloadT[];
  npmDownloadsGrowth: number;
}

export default defineComponent({
  name: 'NpmDownloadsChart',

  setup() {
    const filteredLibsRef = computed(
      () => librariesRR.filter((lib) => !!lib.npmDownloads) as FilteredLibT[]
    );

    watchEffect(() => {
      chartsVisibility.npmDownloads = filteredLibsRef.value.length > 0;
    });

    // Calculate startMonth based on packages creation date
    const minMonthRef = computed(() => {
      const validCreationDates = filteredLibsRef.value
        .map((lib) => lib.npmCreationDate)
        .filter((date) => !!date) as string[];

      const minMonth = getEarliestMonth(validCreationDates, '2017-01');

      return minMonth === '2017-01' ? minMonth : getPrevMonth(minMonth);
    });
    const selectedSinceRef = ref<string | null>(null);
    const sinceRef = computed<string>(
      () => selectedSinceRef.value || minMonthRef.value
    );

    // Have "datasets" separate for better animation when changing "since" date
    const datasets = computed<ChartDataset<'line'>[]>(() =>
      filteredLibsRef.value.map((lib) => ({
        label: lib.npmPackage.name,
        data: lib.npmDownloads.map(({ downloads }) => downloads),
        backgroundColor: lib.color,
        borderColor: lib.color,
        pointRadius: 0,
      }))
    );

    const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
      type: 'line',
      data: {
        labels: filteredLibsRef.value.length
          ? filteredLibsRef.value[0].npmDownloads.map(({ month }) => month)
          : [],
        datasets: datasets.value,
      },
      options: {
        elements: { line: { tension: 0.1 } },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: sinceRef.value > '2019-10' ? 'month' : 'year',
              tooltipFormat: 'MMM, yyyy',
            },
            min: sinceRef.value as unknown as number,
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
      isDisplayed: computed(() => chartsVisibility.npmDownloads),
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
      since: sinceRef,
      sinceValues: computed<string[]>(() => getDateRanges(minMonthRef.value)),
      onSinceChange(since: string) {
        selectedSinceRef.value = since;
      },
    };
  },
});
</script>
