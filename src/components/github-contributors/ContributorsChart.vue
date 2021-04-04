<template>
  <m-chart
    title="Contributors quarterly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>A number of developers contributed to the repository per quater.</p>
    <p>Moiva uses data from Github to build the chart.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { getSeoLibName } from '@/utils';
import { ContributorsT } from './api';
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

    const itemsNum = computed(() => reposIds.value.length);

    const datasets = computed<ChartDataSets[]>(() =>
      reposIds.value.map((repoId, repoIndex) => {
        const [, repoName] = repoId.split('/');
        return {
          label: repoName,
          fill: itemsNum.value === 1,
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

    const unit = computed(() => {
      if (!reposContributors.value.length) {
        return 'year';
      }
      const firstMonth = reposContributors.value[0][0].month;
      return firstMonth >= '2019-10' ? 'quarter' : 'year';
    });

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { unit: unit.value } }],
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
                reposContributors.value[index].slice(-1)[0].contributors
              }`
          )
          .join(', ');

        return `Contributors chart. The number of contributors in the previous quarter - ${valuesStr} contributors`;
      }),
    };
  },
});
</script>
