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
    <p>New NPM Releases quarterly.</p>
    <p>Major, minor and bugfix releases count.</p>
    <p>Pre-releases are not included.</p>
    <p>Data source: <a href="https://www.npmjs.com/" target="_blank">NPM</a></p>
  </m-chart>
</template>

<script setup lang="ts">
import { watchEffect, computed } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { NpmPackageReleasesT } from './api';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getEarliestQuarter, getPrevQuater } from '@/utils';
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

// Calculate startQuater based on packages creation date
const startQuarterRef = computed(() => {
  const validCreationDates = filteredLibsRef.value
    .map((lib) => lib.npmCreationDate)
    .filter((date) => !!date) as string[];
  const quarter = getEarliestQuarter(validCreationDates, '2017-04');
  const prevQuarter = getPrevQuater(quarter);

  return prevQuarter >= '2017-04' ? getPrevQuater(prevQuarter) : prevQuarter;
});

const unitRef = computed(() => {
  return startQuarterRef.value >= '2019-10' ? 'quarter' : 'year';
});

function getTwoMonthsEarlier(month: string): string {
  const date = new Date(month);
  date.setUTCMonth(date.getUTCMonth() - 2, 1);
  return date.toISOString().slice(0, 7);
}

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.npmPackage.name,
      data: lib.npmReleases.map((npmRelease) => ({
        x: getTwoMonthsEarlier(npmRelease.month) as unknown as number,
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
        time: { unit: unitRef.value },
        adapters: { date: { locale: enUS } },
        min: startQuarterRef.value as unknown as number,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const time = tooltipItems[0].parsed.x;
            return format(new Date(time), 'QQQ yyyy');
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
