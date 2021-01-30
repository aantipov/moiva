<template>
  <m-chart
    title="Contributors per year"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
  >
    <p>
      This chart shows a number of developers contributed to the repository per
      year.
    </p>
    <p>Moiva uses data from Github to build the chart.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { YearContributorsT } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'ContributorsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    reposIds: { type: Array as () => string[], required: true },
    failedReposIds: { type: Array as () => string[], required: true },
    reposContributors: {
      type: Array as () => YearContributorsT[][],
      required: true,
    },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { reposIds, repoToColorMap, reposContributors } = toRefs(props);

    const datasets = computed<ChartDataSets[]>(() =>
      reposIds.value.map((repoId, repoIndex) => ({
        label: repoId,
        data: reposContributors.value[repoIndex].map(
          ({ year, contributors }) => ({
            x: year.toString(),
            y: contributors,
          })
        ),
        backgroundColor: repoToColorMap.value[repoId],
        borderColor: repoToColorMap.value[repoId],
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
      chartConfig,
    };
  },
});
</script>
