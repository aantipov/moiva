<template>
  <m-chart
    title="ThoughtWorks TechRadar"
    :is-loading="false"
    :is-error="false"
    :libs-names="filteredLibsNames"
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
import { defineComponent, toRefs, computed } from 'vue';
import { format } from 'date-fns';
import { ChartConfiguration, ChartDataSets } from 'chart.js';
import { TRADAR_LEVELS, libsToDatadMap } from '../../techradar.config';

export default defineComponent({
  name: 'TechRadar',
  props: {
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { libsNames, libToColorMap } = toRefs(props);
    const filteredLibsNames = computed<string[]>(() =>
      libsNames.value.filter((libName) => !!libsToDatadMap[libName])
    );

    const uniqDates = computed<string[]>(() => {
      const dates = filteredLibsNames.value
        .map((libName) => Object.keys(libsToDatadMap[libName]))
        .flat();

      return [...new Set(dates)].sort();
    });

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map(
        (libName) =>
          ({
            label: libName,
            data: uniqDates.value.map((date) => libsToDatadMap[libName][date]),
            backgroundColor: libToColorMap.value[libName],
            borderColor: libToColorMap.value[libName],
            borderWidth: 4,
            lineTension: 0,
            radius: 4,
            pointHoverRadius: 7,
          } as ChartDataSets)
      )
    );

    function formatDate(dateStr: string): string {
      return format(new Date(dateStr), 'MMM, yyyy');
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
      filteredLibsNames,
      chartConfig,
    };
  },
});
</script>
