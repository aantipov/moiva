<template>
  <m-chart
    title="New Github Stars monthly"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div>
        <label>
          Cumulative
          <input v-model="isCumulative" type="checkbox" />
        </label>
      </div>

      <div class="flex justify-center">
        Data source:
        <m-ext-link class="mx-1" href="https://github.com/" txt="GitHub" />
      </div>
    </template>
  </m-chart>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { getEarliestMonth, getPrevMonth, formatNumber } from '@/utils';
import { StarsT } from './api';
import { enUS } from 'date-fns/locale';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  stars: StarsT[];
  starsCumulate: StarsT[];
  starsNewAvg: number;
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.stars) as FilteredLibT[]
);

const filteredCumulativeLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.starsCumulate) as FilteredLibT[]
);

const isCumulative = ref(false);

const datasetsRef = computed(() =>
  filteredLibsRef.value.map((lib) => ({
    label: lib.repo.repoId,
    data: lib.stars
      .filter((item) => item.month >= startMonthRef.value)
      .map(({ month, stars }) => ({
        x: month as unknown as number,
        y: stars,
      })),
    backgroundColor: lib.color,
    borderColor: lib.color,
  }))
);

const cumulativeDatasetsRef = computed(() =>
  filteredCumulativeLibsRef.value.map((lib) => ({
    label: lib.repo.repoId,
    data: lib.starsCumulate
      .filter((item) => item.month >= startMonthRef.value)
      .map(({ month, stars }) => ({
        x: month as unknown as number,
        y: stars,
      })),
    backgroundColor: lib.color,
    borderColor: lib.color,
  }))
);

// Calculate startMonth based on repos creation date
const startMonthRef = computed(() => {
  const validCreationDates = filteredLibsRef.value
    .map((lib) => lib.repo.createdAt)
    .filter((date) => !!date) as string[];

  return getPrevMonth(getEarliestMonth(validCreationDates, '2020-01'));
});

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: isCumulative.value
      ? cumulativeDatasetsRef.value
      : datasetsRef.value,
  },
  options: {
    scales: {
      x: {
        type: 'time',
        time: { unit: 'month', tooltipFormat: 'MMM, yyyy' },
        adapters: { date: { locale: enUS } },
      },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    librariesRR.filter((lib) => lib.stars === undefined).length > 0
);

const isError = computed(() => filteredLibsRef.value.length === 0);

const ariaLabel = computed(() => {
  const valuesStr = filteredLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} stars number increase, on average, by ${formatNumber(
          lib.starsNewAvg
        )} new stars each month.`
    )
    .join(' ');

  return `GitHub Stars statistics. ${valuesStr}`;
});

const reposIds = computed(() =>
  filteredLibsRef.value.map((lib) => lib.repo.repoId)
);

const failedReposIds = computed<string[]>(() => {
  return isLoadingRef.value
    ? []
    : librariesRR.filter((lib) => !lib.stars).map((lib) => lib.repo.repoId);
});
</script>
