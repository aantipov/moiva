<template>
  <m-chart
    title="Recently updated issues"
    :is-loading="isLoading"
    :is-error="false"
    :libs-names="reposIds"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Amount of open/closed repository issues updated in the last 6 months</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { getSeoLibName } from '@/utils';
import { numbersFormatter } from '../utils';
import { ISSUES_COLORS } from '@/colors';
import { isLoading, reposIds, libraries } from '@/store/libraries';

export default defineComponent({
  name: 'Issues',

  setup() {
    const datasets = computed<
      [ChartDataSets, ChartDataSets, ChartDataSets, ChartDataSets]
    >(
      () =>
        [
          {
            label: 'open bugs',
            stack: '1',
            data: libraries.map(({ repo }) => repo.openBugIssues),
            backgroundColor: ISSUES_COLORS.OPEN_BUGS,
            borderWidth: 1,
          },
          {
            label: 'open others',
            stack: '1',
            data: libraries.map(
              ({ repo }) => repo.openIssues - repo.openBugIssues
            ),
            backgroundColor: ISSUES_COLORS.OPEN,
            borderWidth: 1,
          },
          {
            label: 'closed bugs',
            stack: '2',
            data: libraries.map(({ repo }) => repo.closedBugIssues),
            backgroundColor: ISSUES_COLORS.CLOSED_BUGS,
            borderWidth: 1,
          },
          {
            label: 'closed others',
            stack: '2',
            data: libraries.map(
              ({ repo }) => repo.closedIssues - repo.closedBugIssues
            ),
            backgroundColor: ISSUES_COLORS.CLOSED,
            borderWidth: 1,
          },
        ] as [ChartDataSets, ChartDataSets, ChartDataSets, ChartDataSets]
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'bar',
      data: {
        labels: libraries.map(({ repo }) => repo.repoName),
        datasets: datasets.value,
      },
      options: {
        title: { display: false, text: 'Open issues, count' },
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                precision: 0,
                callback: (val: number): string => numbersFormatter.format(val),
              },
            },
          ],
        },
      },
    }));

    return {
      chartConfig,
      isLoading,
      reposIds,
      ariaLabel: computed(() => {
        const valuesStr = reposIds.value
          .map(
            (repoId, index) =>
              `${getSeoLibName(repoId)}: ${
                (datasets.value[0].data as number[])[index]
              } ${datasets.value[0].label}, ${
                (datasets.value[1].data as number[])[index]
              } ${datasets.value[1].label}, ${
                (datasets.value[2].data as number[])[index]
              } ${datasets.value[2].label}, ${
                (datasets.value[3].data as number[])[index]
              } ${datasets.value[3].label}.`
          )
          .join(' ');

        return `Recently Updates Issues chart. The number of open/closed repository issues updated in the last 6 months. ${valuesStr}`;
      }),
    };
  },
});
</script>
