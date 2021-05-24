<template>
  <m-chart
    title="New Github Stars monthly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>New GitHub Stars monthly.</p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
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
  starsNewAvg: number;
}

export default defineComponent({
  name: 'StarsChart',

  setup() {
    const filteredLibsRef = computed(
      () => librariesRR.filter((lib) => !!lib.stars) as FilteredLibT[]
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
        datasets: filteredLibsRef.value.map((lib) => ({
          label: lib.repo.repoName,
          data: lib.stars
            .filter((item) => item.month >= startMonthRef.value)
            .map(({ month, stars }) => ({
              x: (month as unknown) as number,
              y: stars,
            })),
          backgroundColor: lib.color,
          borderColor: lib.color,
        })),
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

    return {
      isError: computed(() => filteredLibsRef.value.length === 0),
      isLoading: isLoadingRef,
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = filteredLibsRef.value
          .map(
            (lib) =>
              `${
                lib.alias
              } stars number increase, on average, by ${formatNumber(
                lib.starsNewAvg
              )} new stars each month.`
          )
          .join(' ');

        return `GitHub Stars statistics. ${valuesStr}`;
      }),
      reposIds: computed(() =>
        filteredLibsRef.value.map((lib) => lib.repo.repoId)
      ),
      failedReposIds: computed<string[]>(() => {
        if (isLoadingRef.value) {
          return [];
        }
        return librariesRR
          .filter((lib) => !lib.stars)
          .map((lib) => lib.repo.repoId);
      }),
    };
  },
});
</script>
