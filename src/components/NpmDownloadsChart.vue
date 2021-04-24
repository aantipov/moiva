<template>
  <m-chart
    title="NPM Downloads monthly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>NPM downloads monthly.</p>
    <p>Data source: <a href="https://www.npmjs.com/" target="_blank">NPM</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
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

    const itemsNum = computed(() => packagesNames.value.length);

    const datasets = computed<ChartDataset<'line'>[]>(() =>
      packagesNames.value.map((packageName, packageIndex) => ({
        label: packageName,
        fill: itemsNum.value === 1,
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

    const unit = computed(() => {
      if (!packagesDownloads.value.length) {
        return 'year';
      }
      const firstMonth = packagesDownloads.value[0][0].month;
      return firstMonth > '2019-10' ? 'month' : 'year';
    });

    const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
      type: 'line',
      data: {
        labels: filteredCategories.value,
        datasets: datasets.value,
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: { unit: unit.value },
            adapters: { date: { locale: enUS } },
          },
          y: { ticks: { callback: numbersFormatter.format as () => string } },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems): string => {
                const time = tooltipItems[0].parsed.x;
                return format(new Date(time), 'MMM, yyyy');
              },
            },
          },
        },
      },
    }));

    return {
      chartConfig,
      ariaLabel: computed(() => {
        const strings = datasets.value.map((dataset) => {
          const downloads = numbersFormatter.format(
            (dataset.data || [0]).slice(-1)[0] as number
          );
          return `${dataset.label}: ${downloads} downloads`;
        });
        return `NPM Monthly Downloads chart. ${strings.join(', ')}`;
      }),
    };
  },
});
</script>
