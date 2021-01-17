<template>
  <m-chart
    v-if="libsKeywords.length"
    title="Google Trends - "
    subtitle="Interest Over Time"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
  >
    <p>
      Moiva uses data from
      <a :href="gTrendsLink" target="_blank">Google Trends</a>
      to build this chart.
    </p>
    <p>
      Google Trends doesn't provide sensible data for most of the libraries. So
      we exclude those libraries altogether.
    </p>
    <p>
      If you know a library for which it makes sense to include it in this chart
      - feel free to submit an
      <a
        href="https://github.com/aantipov/moiva-issues"
        target="_blank"
        rel="noopener"
        >issue</a
      >.
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { format } from 'date-fns';
import { numbersFormatter } from '@/utils';
import { GTrendPointT } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'GTrendsChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsTrends: { type: Array as () => GTrendPointT[], required: true },
    libsKeywords: { type: Array as () => string[], required: true },
  },

  setup(props) {
    const { libsNames, libToColorMap, libsTrends, libsKeywords } = toRefs(
      props
    );

    const filteredLibsNames = computed<string[]>(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsTrends.value[libIndex]
      )
    );

    const categories = computed(() =>
      libsTrends.value.map(({ time }) =>
        new Date(time * 1000).toISOString().slice(0, 10)
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((libName, libIndex) => ({
        label: libName,
        data: libsTrends.value.map(({ value }) => value[libIndex]),
        backgroundColor: libToColorMap.value[libName],
        borderColor: libToColorMap.value[libName],
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }))
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: {
        labels: categories.value,
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
      filteredLibsNames,
      chartConfig,
      gTrendsLink: computed<string>(() => {
        const datesQueryParam = encodeURIComponent('2017-01-01 2021-01-11');
        const libsQueryParam = encodeURIComponent(libsKeywords.value.join(','));
        return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
      }),
    };
  },
});
</script>
