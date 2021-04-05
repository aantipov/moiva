<template>
  <m-chart
    v-if="tradarItemsAliases.length"
    title="ThoughtWorks TechRadar"
    :is-loading="false"
    :is-error="false"
    :libs-names="tradarItemsAliases"
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
import { ChartConfiguration, ChartDataSets } from 'chart.js';
import {
  TRADAR_LEVELS,
  repoToTechRadarMap,
  TechRadarT,
} from '../../techradar.config';
import { chartsVisibility } from '@/store/chartsVisibility';
import { libraryToColorMap } from '@/store/librariesColors';
import { reposIds, repoToLibraryIdMap } from '@/store/libraries';

export default defineComponent({
  name: 'TechRadar',

  setup() {
    const tradarItems = computed<TechRadarT[]>(() =>
      reposIds.value
        .map((repoId) => repoToTechRadarMap[repoId])
        .filter((item) => !!item)
    );

    const tradarItemsAliases = computed<TechRadarT[]>(() =>
      tradarItems.value.map(
        (tradarItem) => repoToTechRadarMap[tradarItem.alias]
      )
    );

    watchEffect(() => {
      chartsVisibility.techRadar = tradarItemsAliases.value.length > 0;
    });

    const uniqDates = computed<string[]>(() => {
      const dates = tradarItems.value
        .map((tradarItem) => Object.keys(tradarItem.data))
        .flat();

      return [...new Set(dates)].sort();
    });

    const itemsNum = computed(() => tradarItems.value.length);

    const datasets = computed<ChartDataSets[]>(() =>
      tradarItems.value.map(
        (tradarItem) =>
          ({
            label: tradarItem.alias,
            fill: itemsNum.value === 1,
            data: uniqDates.value.map((date) => tradarItem.data[date]),
            backgroundColor:
              libraryToColorMap.value[
                repoToLibraryIdMap.value[tradarItem.repo]
              ],
            borderColor:
              libraryToColorMap.value[
                repoToLibraryIdMap.value[tradarItem.repo]
              ],
            spanGaps: true,
            lineTension: 0,
          } as ChartDataSets)
      )
    );

    function formatDate(dateStr: string): string {
      return format(new Date(dateStr), 'MMM yyyy');
    }

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: {
        labels: uniqDates.value,
        xLabels: uniqDates.value,
        yLabels: [...TRADAR_LEVELS, ''],
        datasets: datasets.value,
      },
      options: {
        tooltips: {
          callbacks: {
            title: (tooltipItems): string => {
              const month = tooltipItems[0].xLabel as string;
              return formatDate(month);
            },
            label: (tooltipItem, data): string => {
              const label = (data.datasets as ChartDataSets[])[
                tooltipItem.datasetIndex as number
              ].label;

              return ` ${label}: ${tooltipItem.yLabel}`;
            },
          },
        },
        scales: {
          xAxes: [{ ticks: { callback: formatDate } }],
          yAxes: [{ type: 'category', ticks: { reverse: true } }],
        },
      },
    }));

    return {
      tradarItemsAliases,
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = tradarItems.value
          .map(({ alias, data }) => {
            const vals = Object.entries(data).sort(
              (dataA, dataB) =>
                new Date(dataA[0]).getTime() - new Date(dataB[0]).getTime()
            );
            return `${alias}: ${vals.slice(-1)[0][1]}`;
          })
          .join(', ');

        return `ThoughtWorks TechRadar chart. ${valuesStr}`;
      }),
      tradarItems,
    };
  },
});
</script>
