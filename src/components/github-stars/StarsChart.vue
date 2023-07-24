<template>
  <ChartPresentation
    :title="isCumulative ? 'GitHub Stars' : 'New Github Stars monthly'"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :no-repo-npm-packages="noRepoNpmPackages"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div class="mb-2">
        <label>
          Cumulative
          <input v-model="isCumulative" type="checkbox" />
        </label>
      </div>

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
import { computed, ref } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { getEarliestMonth, getPrevMonth, formatNumber } from '@/utils';
import { enUS } from 'date-fns/locale';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends Omit<LibraryReadonlyT, 'starsQuery' | 'repo'> {
  starsQuery: Omit<LibraryReadonlyT['starsQuery'], 'data'> & {
    data: NonNullable<NonNullable<LibraryReadonlyT['starsQuery']>['data']>;
  };
  repo: NonNullable<LibraryReadonlyT['repo']>;
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.starsQuery?.data) as FilteredLibT[],
);

const isCumulative = ref(false);

// Calculate startMonth based on repos creation date
const startMonthRef = computed(() => {
  const validCreationDates = filteredLibsRef.value
    // assert with ! because we filter out libs without starsQuery.data which assumes repo is there
    .map((lib) => lib.repo.createdAt)
    .filter((date) => !!date) as string[];

  return getPrevMonth(getEarliestMonth(validCreationDates, '2020-01'));
});

const datasetsRef = computed(() =>
  filteredLibsRef.value.map((lib) => ({
    label: lib.repo.repoId,
    data: lib.starsQuery.data.items
      .filter((item) => item.month >= startMonthRef.value)
      .map(({ month, newStars }) => ({
        x: month as unknown as number,
        y: newStars,
      })),
    backgroundColor: lib.color,
    borderColor: lib.color,
  })),
);

const cumulativeDatasetsRef = computed(() =>
  filteredLibsRef.value.map((lib) => ({
    label: lib.repo.repoId,
    data: lib.starsQuery.data.items
      .filter((item) => item.month >= startMonthRef.value)
      .map(({ month, total }) => ({
        x: month as unknown as number,
        y: total,
      })),
    backgroundColor: lib.color,
    borderColor: lib.color,
  })),
);

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: isCumulative.value
      ? cumulativeDatasetsRef.value
      : datasetsRef.value,
  },
  options: {
    elements: {
      point: { radius: isCumulative.value ? 2 : 1 },
      line: { tension: 0.1 },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'year', tooltipFormat: 'MMM, yyyy' },
        adapters: { date: { locale: enUS } },
      },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    librariesRR.some((lib) => lib.starsQuery && lib.starsQuery.isFetching),
);

const isError = computed(() => filteredLibsRef.value.length === 0);

const ariaLabel = computed(() => {
  const valuesStr = filteredLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} stars number increase, on average, by ${formatNumber(
          lib.starsQuery.data.monthlyAvg,
        )} new stars each month.`,
    )
    .join(' ');

  return `GitHub Stars statistics. ${valuesStr}`;
});

const reposIds = computed(() =>
  filteredLibsRef.value.map((lib) => lib.repo.repoId),
);

const failedReposIds = computed<string[]>(() => {
  return isLoadingRef.value
    ? []
    : librariesRR
        .filter((lib) => lib.starsQuery?.isError)
        .map((lib) => lib.repo!.repoId);
});

const noRepoNpmPackages = computed(() =>
  librariesRR.filter((lib) => !lib.repo).map((lib) => lib.npm.name),
);
</script>
