<template>
  <m-chart
    title="NPM monthly downloads"
    :is-loading="isLoadingPackagesDownloads || isLoadingPackagesData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { format } from 'date-fns';
import { NpmDownloadT } from '../apis';
import { numbersFormatter } from '../utils';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'NpmDownloadsChart',

  props: {
    isLoadingPackagesData: { type: Boolean, required: true },
    isLoadingPackagesDownloads: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    packagesNames: { type: Array as () => string[], required: true },
    reposIds: { type: Array as () => string[], required: true },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    packagesDownloads: {
      type: Array as () => (NpmDownloadT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      packagesNames,
      reposIds,
      repoToColorMap,
      packagesDownloads,
      isLoadingPackagesDownloads,
      isLoadingPackagesData,
    } = toRefs(props);

    // Successful requests downloads
    const filteredPackagesDownloads = computed<NpmDownloadT[][]>(
      () =>
        packagesDownloads.value.filter(
          (libDownloads) => !!libDownloads
        ) as NpmDownloadT[][]
    );

    const filteredLibsNames = computed(() =>
      packagesNames.value.filter(
        (libName, libIndex) => !!packagesDownloads.value[libIndex]
      )
    );

    const filteredReposIds = computed(() =>
      reposIds.value.filter(
        (_, repoIndex) => !!packagesDownloads.value[repoIndex]
      )
    );

    const failedLibsNames = computed(() =>
      packagesNames.value.filter(
        (libName, libIndex) =>
          !isLoadingPackagesData.value &&
          !isLoadingPackagesDownloads.value &&
          !packagesDownloads.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((libName, libIndex) => ({
        label: libName,
        data: filteredPackagesDownloads.value[libIndex].map(
          ({ downloads }) => downloads
        ),
        backgroundColor: repoToColorMap.value[filteredReposIds.value[libIndex]],
        borderColor: repoToColorMap.value[filteredReposIds.value[libIndex]],
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 7,
      }))
    );

    const filteredCategories = computed<string[]>(() =>
      filteredPackagesDownloads.value.length
        ? filteredPackagesDownloads.value[0].map(({ month }) => month)
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

    return {
      failedLibsNames,
      filteredLibsNames,
      chartConfig,
    };
  },
});
</script>
