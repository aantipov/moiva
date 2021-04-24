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
    <p>Amount of open/closed repository issues updated in the last 6 months.</p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { ChartDataset, ChartConfiguration } from 'chart.js';
import { getSeoLibName } from '@/utils';
import { numbersFormatter } from '../utils';
import { ISSUES_COLORS } from '@/colors';
import { isLoading, reposIds, libraries } from '@/store/libraries';

export default defineComponent({
  name: 'Issues',

  setup() {
    const datasets = computed<
      [
        ChartDataset<'bar'>,
        ChartDataset<'bar'>,
        ChartDataset<'bar'>,
        ChartDataset<'bar'>
      ]
    >(() => [
      {
        label: 'open bugs',
        stack: '1',
        data: libraries.map(({ repo }) => repo.openBugIssues),
        backgroundColor: ISSUES_COLORS.OPEN_BUGS,
        borderColor: ISSUES_COLORS.OPEN_BUGS_DARK,
        borderWidth: 1,
      },
      {
        label: 'open others',
        stack: '1',
        data: libraries.map(({ repo }) => repo.openIssues - repo.openBugIssues),
        backgroundColor: ISSUES_COLORS.OPEN,
        borderColor: ISSUES_COLORS.OPEN_DARK,
        borderWidth: 1,
      },
      {
        label: 'closed bugs',
        stack: '2',
        data: libraries.map(({ repo }) => repo.closedBugIssues),
        backgroundColor: ISSUES_COLORS.CLOSED_BUGS,
        borderColor: ISSUES_COLORS.CLOSED_BUGS_DARK,
        borderWidth: 1,
      },
      {
        label: 'closed others',
        stack: '2',
        data: libraries.map(
          ({ repo }) => repo.closedIssues - repo.closedBugIssues
        ),
        backgroundColor: ISSUES_COLORS.CLOSED,
        borderColor: ISSUES_COLORS.CLOSED_DARK,
        borderWidth: 1,
      },
    ]);

    const chartConfig = computed<ChartConfiguration<'bar'>>(() => ({
      type: 'bar',
      data: {
        labels: libraries.map(({ repo }) => repo.repoName),
        datasets: datasets.value,
      },
      options: {
        title: { display: false, text: 'Open issues, count' },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: {
              beginAtZero: true,
              precision: 0,
              callback: (val) => numbersFormatter.format(val as number),
            },
          },
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
