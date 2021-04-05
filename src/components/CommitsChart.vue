<template>
  <m-chart
    title="Commits per ~month"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Repository Commits number aggregated by 4 weeks interval.</p>
    <p>
      Only commits to the default repository branch are included. Merge commits
      are excluded.
    </p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { getSeoLibName } from '@/utils';
import { CommitsResponseItemT } from '@/apis';
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

    const itemsNum = computed(() => reposIds.value.length);

    const datasets = computed<ChartDataSets[]>(() =>
      reposIds.value.map((repoId, repoIndex) => {
        const [, repoName] = repoId.split('/');
        return {
          label: repoName,
          fill: itemsNum.value === 1,
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

    return {
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = reposIds.value
          .map(
            (repoId, index) =>
              `${getSeoLibName(repoId)}: ${
                reposCommits.value[index].slice(-1)[0].total
              }`
          )
          .join(', ');

        return `Commits chart. The number of repository commits in the last 4 weeks - ${valuesStr} commits`;
      }),
    };
  },
});
</script>
