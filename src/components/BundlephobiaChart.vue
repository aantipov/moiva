<template>
  <m-chart
    title="Bundle size,"
    subtitle="kB"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Bundle size per NPM package.</p>
    <p v-if="moreInfo">{{ moreInfo }}</p>
    <p>
      Data source:
      <a href="https://bundlephobia.com/" target="_blank">Bundlephobia</a>
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

    return {
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = packagesNames.value
          .map(
            (name, index) =>
              `${name}: ${roundBytesFn(packagesSizes.value[index].gzip)}Kb`
          )
          .join(', ');
        return `Bundle Size chart. The size of libraries (minified and gzipped) - ${valuesStr}`;
      }),
      moreInfo: computed(() => {
        const reactIndex = packagesNames.value.indexOf('react');
        if (reactIndex !== -1) {
          const reactPkg = packagesSizes.value[reactIndex];
          // @ts-ignore
          const reactSize = roundBytesFn(reactPkg.react.gzip);
          // @ts-ignore
          const reactDomSize = roundBytesFn(reactPkg.reactDom.gzip);
          return `React's size is comprised of 2 packages - react and react-dom. React: ${reactSize}kB (minified + gzipped). React-dom: ${reactDomSize}kB (minified + gzipped)`;
        }
        return null;
      }),
    };
  },
});
</script>
