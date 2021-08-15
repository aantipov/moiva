<template>
  <m-chart
    title="Commits per ~month"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Repository Commits number aggregated by 4 weeks interval.</p>
    <p>
      Only commits to the default repository branch are included. Merge commits
      are excluded.
    </p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChartConfiguration } from 'chart.js';
import {
  CommitsResponseItemT,
  getNormalisedData,
  getAggregatedCommits,
} from './api';
import { enUS } from 'date-fns/locale';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  commits: CommitsResponseItemT[];
}
interface FilteredExtLibT extends LibraryReadonlyT {
  commits: CommitsResponseItemT[];
  aggrCommits: CommitsResponseItemT[];
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.commits) as FilteredLibT[]
);

const aggregatedNormalisedCommitsRef = computed(() =>
  getAggregatedCommits(
    getNormalisedData(filteredLibsRef.value.map((lib) => lib.commits))
  )
);

const filteredExtLibsRef = computed<FilteredExtLibT[]>(() =>
  filteredLibsRef.value.map((lib, libIndex) => ({
    ...lib,
    aggrCommits: aggregatedNormalisedCommitsRef.value[libIndex],
  }))
);

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: filteredExtLibsRef.value.map((lib) => ({
      label: lib.repo.repoName,
      data: lib.aggrCommits.map(({ total, week }) => ({
        x: week,
        y: total,
      })),
      backgroundColor: lib.color,
      borderColor: lib.color,
    })),
  },
  options: {
    scales: {
      x: {
        type: 'time',
        time: { tooltipFormat: 'PP' },
        adapters: { date: { locale: enUS } },
      },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    librariesRR.filter((lib) => lib.commits === undefined).length > 0
);

const reposIds = computed(() =>
  filteredExtLibsRef.value.map((lib) => lib.repo.repoId)
);

const failedReposIds = computed<string[]>(() => {
  return isLoadingRef.value
    ? []
    : librariesRR.filter((lib) => !lib.commits).map((lib) => lib.repo.repoId);
});

const isError = computed(() => filteredLibsRef.value.length === 0);

const ariaLabel = computed(() => {
  const str = filteredExtLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} got ${
          lib.aggrCommits.slice(-1)[0].total
        } commit(s) in the last 4 weeks.`
    )
    .join(' ');

  return `Commits statistics. ${str}`;
});
</script>
