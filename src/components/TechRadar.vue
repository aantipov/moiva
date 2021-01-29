<template>
  <m-chart
    v-if="tradarItemsAliases.length"
    title="ThoughtWorks TechRadar"
    :is-loading="false"
    :is-error="false"
    :libs-names="tradarItemsAliases"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
  >
    <p>
      We use
      <a
        href="https://www.thoughtworks.com/radar/languages-and-frameworks"
        target="_blank"
        >ThoughtWorks</a
      >
      data to build the chart.
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { format } from 'date-fns';
import { ChartConfiguration, ChartDataSets } from 'chart.js';
import {
  TRADAR_LEVELS,
  repoToTechRadarMap,
  TechRadarT,
} from '../../techradar.config';
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

    const uniqDates = computed<string[]>(() => {
      const dates = tradarItems.value
        .map((tradarItem) => Object.keys(tradarItem.data))
        .flat();

      return [...new Set(dates)].sort();
    });

    const datasets = computed<ChartDataSets[]>(() =>
      tradarItems.value.map(
        (tradarItem) =>
          ({
            label: tradarItem.alias,
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
    };
  },
});
</script>
