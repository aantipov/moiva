<template>
  <ChartPresentation
    title="NPM Downloads monthly"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div class="relative mb-3 flex justify-center">
        <select
          v-model="selectedSinceRef"
          name="date-range"
          class="rounded-md border border-gray-300 bg-gray-200 p-1"
        >
          <option v-for="val in sinceValues" :key="val" :value="val">
            since {{ val }}
          </option>
        </select>
      </div>

      <div class="flex justify-center">
        Data source:
        <ExternalLink class="mx-1" href="https://www.npmjs.com/" txt="NPM" />
      </div>
    </template>
  </ChartPresentation>
</template>

<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import { computed, ref, watch } from 'vue';
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
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  npmPackage: NpmPackageT;
  npmDownloads: NpmDownloadT[];
  npmDownloadsGrowth: number;
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.npmDownloads) as FilteredLibT[]
);

// Calculate startMonth based on packages creation date
const minMonthRef = computed(() => {
  const validCreationDates = filteredLibsRef.value
    .map((lib) => lib.npmCreationDate)
    .filter((date) => !!date) as string[];

  const minMonth = getEarliestMonth(validCreationDates, '2017-01');

  return minMonth === '2017-01' ? minMonth : getPrevMonth(minMonth);
});

const selectedSinceRef = ref<string>(minMonthRef.value);
const sinceValues = computed<string[]>(() => getDateRanges(minMonthRef.value));
watch(sinceValues, () => {
  selectedSinceRef.value = sinceValues.value[0];
});

// Have "datasets" separate for better animation when changing "since" date
const datasets = computed<ChartDataset<'line'>[]>(() =>
  filteredLibsRef.value.map((lib) => ({
    label: lib.npmPackage.name,
    data: lib.npmDownloads.map(({ downloads }) => downloads),
    backgroundColor: lib.color,
    borderColor: lib.color,
    pointRadius: 0,
    segment: {
      borderDash: (ctx) =>
        ctx.p1DataIndex === lib.npmDownloads.length - 1 ? [5, 5] : undefined,
    },
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
          unit: selectedSinceRef.value > '2020-10' ? 'month' : 'year',
          tooltipFormat: 'MMM, yyyy',
        },
        min: selectedSinceRef.value as unknown as number,
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

const isError = computed(() => filteredLibsRef.value.length === 0);

const ariaLabel = computed<string>(() => {
  const str = filteredLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} npm downloads increase on average by ${formatPercent(
          lib.npmDownloadsGrowth
        )} per month.`
    )
    .join(' ');
  return `Npm Downloads statistics for ${getNamesStr(
    aliasesRef.value
  )}. ${str}`;
});

const failedPackagesNames = computed<string[]>(() => {
  if (isLoadingRef.value) {
    return [];
  }
  return librariesRR
    .filter((lib) => !!lib.npmPackage && !lib.npmDownloads)
    .map((lib) => (lib.npmPackage as NpmPackageT).name);
});
</script>
