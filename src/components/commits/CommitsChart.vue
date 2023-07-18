<template>
  <ChartPresentation
    title="~Commits per month"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :no-repo-npm-packages="noRepoNpmPackages"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div>Repository commits aggregated by month.</div>
      <div>Count only commits to default repository branch.</div>
      <div>Merge commits excluded.</div>
      <div class="flex justify-center">
        Data source:
        <ExternalLink class="mx-1" href="https://github.com/" txt="GitHub" />
      </div>
    </template>
  </ChartPresentation>
</template>

<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import { computed } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { enUS } from 'date-fns/locale';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends Omit<LibraryReadonlyT, 'commitsQuery' | 'repo'> {
  commitsQuery: Omit<LibraryReadonlyT['commitsQuery'], 'data'> & {
    data: NonNullable<NonNullable<LibraryReadonlyT['commitsQuery']>['data']>;
  };
  repo: NonNullable<LibraryReadonlyT['repo']>;
}
const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.commitsQuery?.data) as FilteredLibT[]
);

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.repo.repoId,
      data: lib.commitsQuery.data.monthlyCommits.map(({ total, month }) => ({
        x: month,
        y: total,
      })),
      backgroundColor: lib.color,
      borderColor: lib.color,
    })),
  },
  options: {
    elements: { point: { radius: 1 }, line: { tension: 0.1 } },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'year', tooltipFormat: 'MMM yyyy' },
        adapters: { date: { locale: enUS } },
      },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    librariesRR.some((lib) => lib.commitsQuery && lib.commitsQuery.isFetching)
);

const reposIds = computed(() =>
  filteredLibsRef.value.map((lib) => lib.repo.repoId)
);

const failedReposIds = computed<string[]>(() => {
  return isLoadingRef.value
    ? []
    : librariesRR
        .filter((lib) => lib.commitsQuery?.isError)
        .map((lib) => lib.repo!.repoId);
});

const noRepoNpmPackages = computed(() =>
  librariesRR.filter((lib) => !lib.repo).map((lib) => lib.npm.name)
);

const isError = computed(() => filteredLibsRef.value.length === 0);

const ariaLabel = computed(() => {
  const str = filteredLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} got ${
          lib.commitsQuery.data.monthlyCommits.slice(-1)[0].total
        } commit(s) in the last month.`
    )
    .join(' ');

  return `Commits statistics. ${str}`;
});
</script>
