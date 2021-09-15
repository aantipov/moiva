<template>
  <m-chart
    v-if="isDisplayed"
    title="NPM Releases quarterly"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div>Major, minor and bugfix releases count.</div>
      <div>Pre-releases are not included.</div>
      <div class="flex justify-center">
        Data source:
        <m-ext-link class="mx-1" href="https://www.npmjs.com/" txt="NPM" />
      </div>
    </template>
  </m-chart>
</template>

<script setup lang="ts">
import { watchEffect, computed } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { NpmPackageReleasesT } from './api';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  getFirstNonZeroValueMonth,
  getPrevQuater,
  getQuarterFirstMonthFromDate,
} from '@/utils';
import { NpmPackageT, LibraryReadonlyT } from '@/libraryApis';
import { chartsVisibility } from '@/store/chartsVisibility';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  npmPackage: NpmPackageT;
  npmReleases: NpmPackageReleasesT[];
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.npmReleases) as FilteredLibT[]
);

watchEffect(() => {
  chartsVisibility.npmReleases = filteredLibsRef.value.length > 0;
});

const firstNonZeroQuarterRef = computed(() =>
  getQuarterFirstMonthFromDate(
    getFirstNonZeroValueMonth(
      filteredLibsRef.value.map((lib) => lib.npmReleases),
      'releases'
    )
  )
);

const unitRef = computed<'quarter' | 'year'>(() =>
  firstNonZeroQuarterRef.value >= '2019-10' ? 'quarter' : 'year'
);

function getNextQuarterFirstMonth(month: string) {
  const date = new Date(month);
  date.setUTCMonth(date.getUTCMonth() + 1, 1);
  return date.toISOString().slice(0, 7);
}

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.npmPackage.name,
      data: lib.npmReleases.map((npmRelease) => ({
        x:
          unitRef.value === 'quarter'
            ? (getQuarterFirstMonthFromDate(
                npmRelease.month
              ) as unknown as number)
            : (getNextQuarterFirstMonth(npmRelease.month) as unknown as number),
        y: npmRelease.releases,
      })),
      backgroundColor: lib.color,
      borderColor: lib.color,
    })),
  },

  options: {
    normalized: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: unitRef.value,
          displayFormats: { quarter: 'QQQ/yy' },
        },
        adapters: { date: { locale: enUS } },
        min:
          unitRef.value === 'quarter'
            ? (getPrevQuater(firstNonZeroQuarterRef.value) as unknown as number)
            : (firstNonZeroQuarterRef.value as unknown as number),
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const time = tooltipItems[0].parsed.x;
            const date = new Date(time);
            if (unitRef.value !== 'quarter') {
              // For better represesentation the month in 'year' mode was shift to the next quarter first month
              // Hence, we need to revert it to the original quarter
              date.setUTCMonth(date.getUTCMonth() - 1, 1);
            }
            return format(date, 'QQQ yyyy');
          },
        },
      },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    librariesRR.filter((lib) => lib.npmReleases === undefined).length > 0
);

const isDisplayed = computed(() => chartsVisibility.npmReleases);

const packagesNames = computed(() =>
  filteredLibsRef.value.map((lib) => lib.npmPackage.name)
);

const isError = computed(() => filteredLibsRef.value.length === 0);

const failedPackagesNames = computed<string[]>(() => {
  if (isLoadingRef.value) {
    return [];
  }
  return librariesRR
    .filter((lib) => !!lib.npmPackage && !lib.npmReleases)
    .map((lib) => (lib.npmPackage as NpmPackageT).name);
});

const ariaLabel = computed(() => {
  const str = filteredLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} had ${
          lib.npmReleases.slice(-1)[0].releases
        } npm releases in the previous quarter.`
    )
    .join(' ');
  return `NPM Releases statistics. ${str}`;
});
</script>
