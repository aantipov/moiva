<template>
  <m-chart
    title="Google Trends - "
    subtitle="Interest Over Time"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsKeywordsAliases"
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
        href="https://github.com/aantipov/moiva-catalog"
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
import { GTrendDefT } from '../../google-trends.config';
import { numbersFormatter } from '@/utils';
import { GTrendPointT } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'GTrendsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsTrends: { type: Array as () => GTrendPointT[], required: true },
    libsTrendsDefs: { type: Array as () => GTrendDefT[], required: true },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { repoToColorMap, libsTrends, libsTrendsDefs } = toRefs(props);

    const dates = computed(() =>
      libsTrends.value.map(({ time }) =>
        new Date(time * 1000).toISOString().slice(0, 10)
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      libsTrendsDefs.value.map((gtrendDef, libIndex) => ({
        label: gtrendDef.alias,
        data: libsTrends.value.map(({ value }) => value[libIndex]),
        backgroundColor: repoToColorMap.value[gtrendDef.repoId],
        borderColor: repoToColorMap.value[gtrendDef.repoId],
        pointRadius: 0,
      }))
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: {
        labels: dates.value,
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
      chartConfig,
      libsKeywordsAliases: computed<string[]>(() =>
        libsTrendsDefs.value.map((libGTrendDef) => libGTrendDef.alias)
      ),
      gTrendsLink: computed<string>(() => {
        const keywords = libsTrendsDefs.value.map(
          (gtrendDef) => gtrendDef.keyword
        );
        const datesQueryParam = encodeURIComponent('2017-01-01 2021-01-11');
        const libsQueryParam = encodeURIComponent(keywords.join(','));

        return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
      }),
    };
  },
});
</script>
