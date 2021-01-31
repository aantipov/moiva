<template>
  <m-chart
    title="NPM monthly downloads"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
  >
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { format } from 'date-fns';
import { NpmDownloadT } from '@/apis';
import { numbersFormatter } from '@/utils';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'NpmDownloadsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    packagesNames: { type: Array as () => string[], required: true },
    failedPackagesNames: { type: Array as () => string[], required: true },
    packagesDownloads: {
      type: Array as () => NpmDownloadT[][],
      required: true,
    },
    packageToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { packagesNames, packageToColorMap, packagesDownloads } = toRefs(
      props
    );

    const datasets = computed<ChartDataSets[]>(() =>
      packagesNames.value.map((packageName, packageIndex) => ({
        label: packageName,
        data: packagesDownloads.value[packageIndex].map(
          ({ downloads }) => downloads
        ),
        backgroundColor: packageToColorMap.value[packageName],
        borderColor: packageToColorMap.value[packageName],
        pointRadius: 0,
      }))
    );

    const filteredCategories = computed<string[]>(() =>
      packagesDownloads.value.length
        ? packagesDownloads.value[0].map(({ month }) => month)
        : []
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: {
        labels: filteredCategories.value,
        datasets: datasets.value,
      },
      options: {
        tooltips: {
          callbacks: {
            title: (tooltipItems): string => {
              const month = tooltipItems[0].xLabel as string;
              return format(new Date(month), 'MMM, yyyy');
            },
          },
        },
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { unit: 'year' } }],
          yAxes: [{ ticks: { callback: numbersFormatter.format } }],
        },
      },
    }));

    return { chartConfig };
  },
});
</script>
