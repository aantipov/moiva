<template>
  <m-chart
    title="Developer Usage,"
    subtitle="%"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
    <p>Percentage of developers using the library.</p>
    <p>
      Data are based on the
      <a href="https://stateofjs.com/" target="_blank">State of JS</a> survey.
    </p>
    <p>The survey provides data only for a reduced set of libraries.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { format } from 'date-fns';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { StateOfJST } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'DevelopersUsageChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsData: {
      type: Array as () => (StateOfJST | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsData,
      isLoading,
      isLoadingLibsData,
    } = toRefs(props);

    const filteredLibsData = computed<StateOfJST[]>(
      () => libsData.value.filter((libData) => !!libData) as StateOfJST[]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter((libName, libIndex) => !!libsData.value[libIndex])
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsData.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((lib, libIndex) => ({
        label: lib,
        data: filteredLibsData.value[libIndex].usage.map(
          ({ percentage, year }) => ({
            x: `${year}-01-01`,
            y: percentage,
          })
        ),
        backgroundColor: libToColorMap.value[lib],
        borderColor: libToColorMap.value[lib],
      }))
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        tooltips: {
          callbacks: {
            title: (tooltipItems): string => {
              const year = tooltipItems[0].xLabel as string;
              return format(new Date(year), 'yyyy');
            },
          },
        },
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { unit: 'year' } }],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                precision: 0,
                callback: (val: number): string => val + '%',
              },
            },
          ],
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
