<template>
  <m-chart
    title="Recently updated issues"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedLibsNames"
    :chart-config="chartConfig"
  >
    <p>Amount of open/closed repository issues updated in the last 6 months</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { RepoT } from '../apis';
import { numbersFormatter } from '../utils';
import { ISSUES_COLORS } from '@/colors';

export default defineComponent({
  name: 'Issues',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    reposNames: { type: Array as () => string[], required: true },
    repos: { type: Array as () => (RepoT | null)[], required: true },
  },

  setup(props) {
    const { reposNames, repos, isLoadingLibsData, isLoading } = toRefs(props);

    const filteredRepos = computed<RepoT[]>(
      () => repos.value.filter((repo) => !!repo) as RepoT[]
    );

    const filteredLibsNames = computed(() =>
      filteredRepos.value.map(({ repoName }) => repoName)
    );

    const failedLibsNames = computed(() =>
      reposNames.value.filter(
        (reposNames, repoIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !repos.value[repoIndex]
      )
    );

    const datasets = computed<ChartDataSets[]>(
      () =>
        [
          {
            label: 'open bugs',
            stack: '1',
            data: filteredRepos.value.map(
              (repo) => repo.openBugIssues.totalCount
            ),
            backgroundColor: ISSUES_COLORS.OPEN_BUGS,
            borderWidth: 1,
          },
          {
            label: 'open others',
            stack: '1',
            data: filteredRepos.value.map(
              (repo) =>
                repo.openIssues.totalCount - repo.openBugIssues.totalCount
            ),
            backgroundColor: ISSUES_COLORS.OPEN,
            borderWidth: 1,
          },
          {
            label: 'closed bugs',
            stack: '2',
            data: filteredRepos.value.map(
              (repo) => repo.closedBugIssues.totalCount
            ),
            backgroundColor: ISSUES_COLORS.CLOSED_BUGS,
            borderWidth: 1,
          },
          {
            label: 'closed others',
            stack: '2',
            data: filteredRepos.value.map(
              (repo) =>
                repo.closedIssues.totalCount - repo.closedBugIssues.totalCount
            ),
            backgroundColor: ISSUES_COLORS.CLOSED,
            borderWidth: 1,
          },
        ] as ChartDataSets[]
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'bar',
      data: {
        labels: filteredLibsNames.value,
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
      failedLibsNames,
      filteredLibsNames,
      chartConfig,
    };
  },
});
</script>
