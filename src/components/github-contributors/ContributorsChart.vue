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
    <p>Amount of developers contributed to a repository per quarter.</p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
import { getSeoLibName } from '@/utils';
import { ContributorsT } from './api';
import { format } from 'date-fns';
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

    const datasets = computed<ChartDataset<'line'>[]>(() =>
      reposIds.value.map((repoId, repoIndex) => {
        const [, repoName] = repoId.split('/');
        return {
          label: repoName,
          data: reposContributors.value[repoIndex].map(
            ({ month, contributors }) => ({
              x: (month as unknown) as number,
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

    const chartConfig = computed<ChartConfiguration<'line'>>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        scales: {
          x: {
            type: 'time',
            time: { unit: unit.value },
            adapters: { date: { locale: enUS } },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems): string => {
                const time = tooltipItems[0].parsed.x;
                return format(new Date(time - 1000000000), 'QQQ yyyy');
              },
            },
          },
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
