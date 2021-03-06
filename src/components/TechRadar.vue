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
  >
    <p>ThoughtWorks' levels definitions:</p>
    <p>
      <i>Adopt</i> - We feel strongly that the industry should be adopting these
      items. We use them when appropriate on our projects.
    </p>
    <p>
      <i>Trial</i> - Worth pursuing. It is important to understand how to build
      up this capability. Enterprises should try this technology on a project
      that can handle the risk.
    </p>
    <p>
      <i>Assess</i> - Worth exploring with the goal of understanding how it will
      affect your enterprise.
    </p>
    <p><i>Hold</i> - Proceed with caution.</p>
    <p>
      Data source:
      <a
        href="https://www.thoughtworks.com/radar/languages-and-frameworks"
        target="_blank"
        >ThoughtWorks</a
      >
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import { format } from 'date-fns';
import { ChartConfiguration } from 'chart.js';
import { TRADAR_LEVELS, TechRadarT, DateT } from '@/data/index';
import { chartsVisibility } from '@/store/chartsVisibility';
import { LibraryReadonlyT } from '@/libraryApis';
import { librariesRR, isLoading } from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  tradar: TechRadarT;
}

export default defineComponent({
  name: 'TechRadarChart',

  setup() {
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

    return {
      tradarAliases: computed<string[]>(() =>
        filteredLibsRef.value.map((lib) => lib.tradar.alias)
      ),
      isLoading,
      isDisplayed: computed(() => chartsVisibility.techRadar),
      chartConfig,
      ariaLabel: computed(() => {
        const str = filteredLibsRef.value
          .map(
            ({ tradar }) =>
              `${tradar.alias} is in the ${
                tradar.entries.slice(-1)[0].level
              } ring since ${formatDate2(tradar.entries.slice(-1)[0].month)}.`
          )
          .join(' ');

        return `ThoughtWorks TechRadar data. ${str}`;
      }),
    };
  },
});
</script>
