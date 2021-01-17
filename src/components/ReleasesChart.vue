<template>
  <m-chart
    title="Releases per year"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
    <p>Moiva gets releases data from NPM.</p>
    <p>Major, minor and bugfix releases count.</p>
    <p>Pre-releases are not included.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { NpmPackageReleasesT } from '../apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'ReleasesChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsReleases: {
      type: Array as () => (NpmPackageReleasesT | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsReleases,
      isLoading,
      isLoadingLibsData,
    } = toRefs(props);

    const filteredLibsReleases = computed<NpmPackageReleasesT[]>(
      () =>
        libsReleases.value.filter(
          (libReleases) => !!libReleases
        ) as NpmPackageReleasesT[]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsReleases.value[libIndex]
      )
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsReleases.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((lib, libIndex) => ({
        label: lib,
        data: Object.entries(
          filteredLibsReleases.value[libIndex]
        ).map(([year, num]) => ({ x: year, y: num })),
        backgroundColor: libToColorMap.value[lib],
        borderColor: libToColorMap.value[lib],
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
