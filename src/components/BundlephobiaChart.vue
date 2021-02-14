<template>
  <m-chart
    title="Bundle size,"
    subtitle="kB"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="''"
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
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    packagesNames: { type: Array as () => string[], required: true },
    failedPackagesNames: { type: Array as () => string[], required: true },
    packagesSizes: {
      type: Array as () => BundlephobiaT[],
      required: true,
    },
  },

  setup(props) {
    const { packagesNames, packagesSizes } = toRefs(props);

    const datasets = computed<ChartDataSets[]>(() => [
      {
        label: 'minified + gzipped',
        data: packagesSizes.value.map((packageSize) =>
          roundBytesFn(packageSize.gzip)
        ),
        backgroundColor: COLOR_GREEN,
        borderWidth: 1,
      },
      {
        label: 'minified',
        data: packagesSizes.value.map((packageSize) =>
          roundBytesFn(packageSize.raw)
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
        labels: packagesNames.value,
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

    return { chartConfig };
  },
});
</script>
