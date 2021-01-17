<template>
  <m-chart
    title="Bundle size, kB"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
    <p>
      Moiva uses data from
      <a href="https://bundlephobia.com/" target="_blank">Bundlephobia</a>
      to build this chart.
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { BundlephobiaT } from '@/apis';
import { numbersFormatter } from '@/utils';
import { COLOR_GREEN, COLOR_GRAY } from '@/colors';

const roundBytesFn = (bytes: number): number => Math.round(bytes / 102.4) / 10;

export default defineComponent({
  name: 'BundlephobiaChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libsSizes: {
      type: Array as () => (BundlephobiaT | null)[],
      required: true,
    },
  },

  setup(props) {
    const { libsNames, libsSizes, isLoading, isLoadingLibsData } = toRefs(
      props
    );

    const filteredLibsSizes = computed<BundlephobiaT[]>(
      () => libsSizes.value.filter((libSizes) => !!libSizes) as BundlephobiaT[]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter((libName, libIndex) => !!libsSizes.value[libIndex])
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsSizes.value[libIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(() => [
      {
        label: 'minified + gzipped',
        data: filteredLibsSizes.value.map((libSize) =>
          roundBytesFn(libSize.gzip)
        ),
        backgroundColor: COLOR_GREEN,
        borderWidth: 1,
      },
      {
        label: 'minified',
        data: filteredLibsSizes.value.map((libSize) =>
          roundBytesFn(libSize.raw)
        ),
        backgroundColor: COLOR_GRAY,
        borderWidth: 1,
      },
    ]);

    const bytesFormatter = (val: number) =>
      numbersFormatter.format(val) + ' kB';

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'bar',
      data: {
        labels: filteredLibsNames.value,
        datasets: datasets.value,
      },
      options: {
        tooltips: {
          callbacks: {
            label: (tooltipItem, data): string => {
              const label = (data.datasets as ChartDataSets[])[
                tooltipItem.datasetIndex as number
              ].label;

              return ` ${label}: ${Number(
                tooltipItem.yLabel
              ).toLocaleString()}kB`;
            },
          },
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, callback: bytesFormatter } }],
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
