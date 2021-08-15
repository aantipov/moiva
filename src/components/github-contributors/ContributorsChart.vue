<template>
  <m-chart
    title="Contributors quarterly"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Amount of developers contributed to a repository per quarter.</p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { ContributorsT } from './api';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getEarliestQuarter, getPrevQuater } from '@/utils';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  contributors: ContributorsT[];
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.contributors) as FilteredLibT[]
);

const startQuarterRef = computed(() => {
  const creationDates = filteredLibsRef.value.map((lib) => lib.repo.createdAt);

  return getPrevQuater(getEarliestQuarter(creationDates, '2017-04'));
});

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.repo.repoName,
      data: lib.contributors.map((item) => ({
        x: item.month as unknown as number,
        y: item.contributors,
      })),
      backgroundColor: lib.color,
      borderColor: lib.color,
    })),
  },

  options: {
    scales: {
      x: {
        type: 'time',
        time: {
          unit:
            filteredLibsRef.value.length && startQuarterRef.value >= '2019-10'
              ? 'quarter'
              : 'year',
        },
        min: startQuarterRef.value as unknown as number,
        adapters: { date: { locale: enUS } },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems): string => {
            const time = tooltipItems[0].parsed.x;
            return format(new Date(time - 1000000000), 'QQQ yyyy');
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

const isError = computed(() => filteredLibsRef.value.length === 0);

const reposIds = computed(() =>
  filteredLibsRef.value.map((lib) => lib.repo.repoId)
);

const failedReposIds = computed<string[]>(() => {
  return isLoadingRef.value
    ? []
    : librariesRR
        .filter((lib) => !lib.contributors)
        .map((lib) => lib.repo.repoId);
});

const ariaLabel = computed(() => {
  const str = filteredLibsRef.value
    .map(
      (lib) =>
        `${
          lib.contributors.slice(-1)[0].contributors
        } developer(s) contributed to ${lib.alias} in the previous quarter.`
    )
    .join(' ');

  return `Contributors statistics. ${str}`;
});
</script>
