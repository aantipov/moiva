<template>
  <m-chart
    title="New Github Stars monthly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>New GitHub Stars monthly.</p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
import { getSeoLibName } from '@/utils';
import { StarsT } from './api';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'StarsChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    reposIds: { type: Array as () => string[], required: true },
    failedReposIds: { type: Array as () => string[], required: true },
    reposStars: {
      type: Array as () => StarsT[][],
      required: true,
    },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { reposIds, repoToColorMap, reposStars } = toRefs(props);

    const itemsNum = computed(() => reposIds.value.length);

    const datasets = computed<ChartDataset<'line'>[]>(() =>
      reposIds.value.map((repoId, repoIndex) => {
        const [, repoName] = repoId.split('/');
        return {
          label: repoName,
          fill: itemsNum.value === 1,
          data: reposStars.value[repoIndex].map(({ month, stars }) => ({
            x: (month as unknown) as number,
            y: stars,
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
          x: {
            type: 'time',
            time: { unit: 'month', tooltipFormat: 'MMM, yyyy' },
            adapters: { date: { locale: enUS } },
          },
        },
      },
    }));

    function getAverage(items: StarsT[]): number {
      const sum = items.reduce((a, b) => a + b.stars, 0);
      return Math.round(sum / items.length);
    }

    return {
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = reposIds.value
          .map(
            (repoId, index) =>
              `${getSeoLibName(repoId)}: ${getAverage(
                reposStars.value[index].slice(-3)
              )}`
          )
          .join(', ');

        return `New GitHub Stars chart. An average number of new stars repostories get monthly - ${valuesStr} stars`;
      }),
    };
  },
});
</script>
