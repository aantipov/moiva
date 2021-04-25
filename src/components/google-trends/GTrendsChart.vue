<template>
  <m-chart
    title="Google Trends - "
    subtitle="Interest Over Time"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsKeywordsAliases"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Google Search Interest Over Time.</p>
    <p>
      Data are provided for popular libraries only. The list is manually
      curated.
    </p>
    <p>
      Feel free to submit a
      <a href="https://github.com/aantipov/moiva" target="_blank" rel="noopener"
        >request</a
      >
      to add a library.
    </p>
    <p>Data source: <a :href="gTrendsLink" target="_blank">Google Trends</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
import { GTrendDefT } from '../../../google-trends.config';
import { numbersFormatter } from '@/utils';
import { GTrendsResponseT } from './api';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'GTrendsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsTrends: {
      type: Object as () => GTrendsResponseT,
      required: true,
    },
    libsTrendsDefs: { type: Array as () => GTrendDefT[], required: true },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { repoToColorMap, libsTrends, libsTrendsDefs } = toRefs(props);

    const dates = computed(() =>
      libsTrends.value.timelineData.map(({ time }) =>
        new Date(time * 1000).toISOString().slice(0, 10)
      )
    );

    const datasets = computed<ChartDataset<'line'>[]>(() =>
      libsTrendsDefs.value.map((gtrendDef, libIndex) => ({
        label: gtrendDef.alias,
        data: libsTrends.value.timelineData.map(({ value }) => value[libIndex]),
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
        elements: { line: { tension: 0.1 } },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'year', tooltipFormat: 'MMM, yyyy' },
            adapters: { date: { locale: enUS } },
          },
          y: { ticks: { callback: numbersFormatter.format as () => string } },
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
      ariaLabel: computed(() => {
        let avgStr = '';
        if (libsTrends.value.averages.length) {
          const averages = libsTrendsDefs.value.map(({ alias }, index) => {
            return `${alias}: ${libsTrends.value.averages[index]}`;
          });
          avgStr = `Averages - ${averages.join(', ')}`;
        }
        return `Google Trends Chart - Interest over time. ${avgStr}`;
      }),
    };
  },
});
</script>
