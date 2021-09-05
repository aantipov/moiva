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
  const quarter = getEarliestQuarter(creationDates, '2017-04');
  const prevQuarter = getPrevQuater(quarter);

  return prevQuarter >= '2017-04' ? getPrevQuater(prevQuarter) : prevQuarter;
});

type UnitT = 'quarter' | 'year';

const unitRef = computed<UnitT>(() =>
  startQuarterRef.value >= '2019-10' ? 'quarter' : 'year'
);

function getQuarterFirstMonth(month: string): string {
  const date = new Date(month);
  date.setUTCMonth(date.getUTCMonth() - 2, 1);
  return date.toISOString().slice(0, 7);
}

function getNextQuarterFirstMonth(month: string) {
  const date = new Date(month);
  date.setUTCMonth(date.getUTCMonth() + 1, 1);
  return date.toISOString().slice(0, 7);
}

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.repo.repoId,
      data: lib.contributors.map((item) => ({
        x:
          unitRef.value === 'quarter'
            ? (getQuarterFirstMonth(item.month) as unknown as number)
            : (getNextQuarterFirstMonth(item.month) as unknown as number),
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
        time: { unit: unitRef.value },
        min: startQuarterRef.value as unknown as number,
        adapters: { date: { locale: enUS } },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems): string => {
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
