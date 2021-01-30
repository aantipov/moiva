<template>
  <m-chart
    title="Commits per ~month"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
  >
    <p>Moiva uses commits data from GitHub.</p>
    <p>The number of commits is aggregated by the 4 weeks interval.</p>
    <p>
      Only commits to the default repository branch are included. Merge commits
      are excluded.
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { CommitsResponseItemT } from '../../api/gh-commits';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'CommitsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    reposIds: { type: Array as () => string[], required: true },
    failedReposIds: { type: Array as () => string[], required: true },
    reposCommits: {
      type: Array as () => CommitsResponseItemT[][],
      required: true,
    },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { reposIds, repoToColorMap, reposCommits } = toRefs(props);

    const datasets = computed<ChartDataSets[]>(() =>
      reposIds.value.map((repoId, repoIndex) => {
        const [, repoName] = repoId.split('/');
        return {
          label: repoName,
          data: reposCommits.value[repoIndex].map(({ total, week }) => ({
            x: week,
            y: total,
          })),
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
          xAxes: [{ type: 'time', time: { tooltipFormat: 'PP' } }],
          yAxes: [{}],
        },
      },
    }));

    return { chartConfig };
  },
});
</script>
