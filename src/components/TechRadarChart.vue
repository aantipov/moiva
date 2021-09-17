<template>
  <m-chart
    v-if="isDisplayed"
    title="ThoughtWorks TechRadar"
    :is-loading="isLoading"
    :is-error="false"
    :libs-names="tradarAliases"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
    data-source-txt="ThoughtWorks"
    data-source-url="https://www.thoughtworks.com/radar/languages-and-frameworks"
  >
    <template #info>
      <div style="min-width: 300px">
        <div>ThoughtWorks' levels definitions:</div>
        <div class="mt-1">
          <i class="underline">Adopt</i> - We feel strongly that the industry
          should be adopting these items. We use them when appropriate on our
          projects.
        </div>
        <div class="mt-1">
          <i class="underline">Trial</i> - Worth pursuing. It is important to
          understand how to build up this capability. Enterprises should try
          this technology on a project that can handle the risk.
        </div>
        <div class="mt-1">
          <i class="underline">Assess</i> - Worth exploring with the goal of
          understanding how it will affect your enterprise.
        </div>
        <div class="mt-1">
          <i class="underline">Hold</i> - Proceed with caution.
        </div>
      </div>
    </template>
  </m-chart>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { format } from 'date-fns';
import { ChartConfiguration } from 'chart.js';
import { TRADAR_LEVELS, TechRadarT, DateT } from '@/data/index';
import { chartsVisibility } from '@/store/chartsVisibility';
import { LibraryReadonlyT } from '@/libraryApis';
import { librariesRR, isLoading } from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  tradar: TechRadarT;
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.tradar) as FilteredLibT[]
);

watchEffect(() => {
  chartsVisibility.techRadar = filteredLibsRef.value.length > 0;
});

const uniqDates = computed<DateT[]>(() => {
  const dates = filteredLibsRef.value
    .map((lib) => lib.tradar.entries.map((entry) => entry.month))
    .flat();

  return [...new Set(dates)].sort() as DateT[];
});

const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
  type: 'line',
  data: {
    labels: uniqDates.value,
    yLabels: [...TRADAR_LEVELS].reverse(),
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.tradar.alias,
      data: uniqDates.value.map(
        (date) =>
          lib.tradar.entries.find((entry) => entry.month === date)?.level
      ) as unknown as number[],
      backgroundColor: lib.color,
      borderColor: lib.color,
      spanGaps: true,
      lineTension: 0,
    })),
  },

  options: {
    scales: {
      x: { ticks: { callback: formatDate as () => string } },
      y: { type: 'category', offset: true },
    },

    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems): string => {
            const month = tooltipItems[0].parsed.x;
            return formatDate(month);
          },
          label: (context): string => {
            return ` ${
              context.dataset.label
            }: ${context.formattedValue.toUpperCase()}`;
          },
        },
      },
    },
  },
}));

function formatDate(i: number): string {
  return format(new Date(uniqDates.value[i]), 'MMM yyyy');
}

function formatDate2(month: string): string {
  return format(new Date(month), 'MMMM yyyy');
}

const tradarAliases = computed<string[]>(() =>
  filteredLibsRef.value.map((lib) => lib.tradar.alias)
);

const isDisplayed = computed(() => chartsVisibility.techRadar);

const ariaLabel = computed(() => {
  const str = filteredLibsRef.value
    .map(
      ({ tradar }) =>
        `${tradar.alias} is in the ${
          tradar.entries.slice(-1)[0].level
        } ring since ${formatDate2(tradar.entries.slice(-1)[0].month)}.`
    )
    .join(' ');

  return `ThoughtWorks TechRadar data. ${str}`;
});
</script>
