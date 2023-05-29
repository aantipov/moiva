<template>
  <ChartPresentation
    title="Contributors quarterly"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div>Developers contributed to a repository per quarter.</div>
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
import { ContributorsT } from './api';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  getFirstNonZeroValueMonth,
  getPrevQuater,
  getQuarterFirstMonthFromDate,
} from '@/utils';
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

const firstNonZeroQuarterRef = computed(() =>
  getQuarterFirstMonthFromDate(
    getFirstNonZeroValueMonth(
      filteredLibsRef.value.map((lib) => lib.contributors),
      'contributors'
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
      label: lib.repo.repoId,
      data: lib.contributors.map((item) => ({
        x:
          unitRef.value === 'quarter'
            ? (getQuarterFirstMonthFromDate(item.month) as unknown as number)
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
        time: {
          unit: unitRef.value,
          displayFormats: { quarter: 'QQQ/yy' },
        },
        min:
          unitRef.value === 'quarter'
            ? (getPrevQuater(firstNonZeroQuarterRef.value) as unknown as number)
            : (firstNonZeroQuarterRef.value as unknown as number),
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
