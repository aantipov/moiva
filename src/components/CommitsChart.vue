<template>
  <m-chart
    title="Commits per ~month"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
    <p>Moiva uses commits data from GitHub.</p>
    <p>The number of commits is aggregated by the 4 weeks interval.</p>
    <p>
      Only commits to the default repository branch are included. Merge commits
      are excluded.
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { CommitsResponseItemT } from '../../api/gh-commits';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'CommitsChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsCommits: {
      type: Array as () => (CommitsResponseItemT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libsCommits,
      libToColorMap,
      isLoadingLibsData,
      isLoading,
    } = toRefs(props);

    const filteredLibsCommits = computed<CommitsResponseItemT[][]>(
      () =>
        libsCommits.value.filter(
          (libCommits) => !!libCommits
        ) as CommitsResponseItemT[][]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsCommits.value[libIndex]
      )
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsCommits.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((libName, libIndex) => ({
        label: libName,
        data: filteredLibsCommits.value[libIndex].map(({ total, week }) => ({
          x: week,
          y: total,
        })),
        backgroundColor: libToColorMap.value[libName],
        borderColor: libToColorMap.value[libName],
        borderWidth: 4,
        pointRadius: 3,
        pointHoverRadius: 7,
      }))
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { tooltipFormat: 'PP' } }],
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
