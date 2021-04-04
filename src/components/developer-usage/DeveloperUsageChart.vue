<template>
  <m-chart
    title="Developer Usage,"
    subtitle="%"
    :is-loading="isLoading"
    :is-error="false"
    :libs-names="libsNames"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Percentage of developers using the library.</p>
    <p>
      Data are based on the
      <a href="https://stateofjs.com/" target="_blank">StateOfJS</a> and
      <a href="https://stateofcss.com/" target="_blank">StateOfCSS</a> surveys.
    </p>
    <p>The survey provides data only for a limited set of libraries.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { StateOfJSItemT } from './stateof-js-css-data';

export default defineComponent({
  name: 'DevelopersUsageChart',

  props: {
    isLoading: { type: Boolean, required: true },
    reposUsage: {
      type: Array as () => StateOfJSItemT[],
      required: true,
    },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { reposUsage, repoToColorMap } = toRefs(props);

    const years = computed(() => {
      const firstYears = reposUsage.value.map(
        (repoUsage) => repoUsage.usage[0].year
      );
      const firstYear = Math.max(2016, Math.min(...firstYears));
      return [2016, 2017, 2018, 2019, 2020].filter((year) => year >= firstYear);
    });

    const datasets = computed<ChartDataSets[]>(() =>
      reposUsage.value.map((libUsageItem) => {
        const libUsage = libUsageItem.usage.reduce((acc, item) => {
          acc[item.year] = item.value;
          return acc;
        }, {} as Record<number, number>);

        return {
          label: libUsageItem.name,
          data: years.value.map((year) => libUsage[year] || undefined),
          backgroundColor: repoToColorMap.value[libUsageItem.repoId],
          borderColor: repoToColorMap.value[libUsageItem.repoId],
        };
      })
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: {
        labels: years.value,
        datasets: datasets.value,
      },
      options: {
        spanGaps: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
                precision: 0,
                callback: (val: number): string => val + '%',
              },
            },
          ],
        },
      },
    }));

    return {
      chartConfig,
      libsNames: computed(() => reposUsage.value.map(({ name }) => name)),
      ariaLabel: computed(() => {
        const valuesStr = reposUsage.value
          .map(({ name, usage }) => `${name}: ${usage.slice(-1)[0].value}%`)
          .join(', ');
        return `Developer Usage chart. The number of developers using the library - ${valuesStr}`;
      }),
    };
  },
});
</script>
