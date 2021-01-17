<template>
  <m-chart
    title="Contributors per year"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
    <p>
      This chart shows a number of developers contributed to the repository per
      year.
    </p>
    <p>Moiva uses data from Github to build the chart.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { YearContributorsT } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'ContributorsChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsContributors: {
      type: Array as () => (YearContributorsT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsContributors,
      isLoadingLibsData,
      isLoading,
    } = toRefs(props);

    const filteredLibsContributors = computed<YearContributorsT[][]>(
      () =>
        libsContributors.value.filter(
          (libContributors) => !!libContributors
        ) as YearContributorsT[][]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsContributors.value[libIndex]
      )
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsContributors.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((lib, libIndex) => ({
        label: lib,
        fill: false,
        data: filteredLibsContributors.value[libIndex].map(
          ({ year, contributors }) => ({
            x: year.toString(),
            y: contributors,
          })
        ),
        backgroundColor: libToColorMap.value[lib],
        borderColor: libToColorMap.value[lib],
        borderWidth: 4,
        pointRadius: 4,
        pointHoverRadius: 7,
      }))
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { unit: 'year' } }],
          yAxes: [{}],
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
