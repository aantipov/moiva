<template>
  <m-chart
    title="Contributors quarterly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="''"
  >
    <p>A number of developers contributed to the repository per quater.</p>
    <p>Moiva uses data from Github to build the chart.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { ContributorsT } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'ContributorsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    reposIds: { type: Array as () => string[], required: true },
    failedReposIds: { type: Array as () => string[], required: true },
    reposContributors: {
      type: Array as () => ContributorsT[][],
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
      reposIds.value.map((repoId, repoIndex) => {
        const [, repoName] = repoId.split('/');
        return {
          label: repoName,
          data: reposContributors.value[repoIndex].map(
            ({ month, contributors }) => ({
              x: month,
              y: contributors,
            })
          ),
          backgroundColor: repoToColorMap.value[repoId],
          borderColor: repoToColorMap.value[repoId],
        };
      })
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

    return { chartConfig };
  },
});
</script>
