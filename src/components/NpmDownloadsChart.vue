<template>
  <m-chart
    title="NPM monthly downloads"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { format } from 'date-fns';
import { NpmDownloadT } from '../apis';
import { numbersFormatter } from '../utils';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'NpmDownloadsChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsDownloads: {
      type: Array as () => (NpmDownloadT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsDownloads,
      isLoading,
      isLoadingLibsData,
    } = toRefs(props);

    const filteredLibsDownloads = computed<NpmDownloadT[][]>(
      () =>
        libsDownloads.value.filter(
          (libDownloads) => !!libDownloads
        ) as NpmDownloadT[][]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsDownloads.value[libIndex]
      )
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsDownloads.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((libName, libIndex) => ({
        label: libName,
        fill: false,
        data: filteredLibsDownloads.value[libIndex].map(
          ({ downloads }) => downloads
        ),
        backgroundColor: libToColorMap.value[libName],
        borderColor: libToColorMap.value[libName],
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 7,
      }))
    );

    const filteredCategories = computed<string[]>(() =>
      filteredLibsDownloads.value.length
        ? filteredLibsDownloads.value[0].map(({ month }) => month)
        : []
    );

    const chartConfig = computed<Chart.ChartConfiguration>(() => ({
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

    return {
      failedLibsNames,
      filteredLibsNames,
      chartConfig,
    };
  },
});
</script>
