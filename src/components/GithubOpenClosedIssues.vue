<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Recent Issues</h2>

      <m-chart-info class="ml-2">
        <p>
          Amount of open/closed repository issues updated in the last 6 months
        </p>
      </m-chart-info>
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else-if="isLoading" class="text-center p">Loading...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="issuesCount"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, toRefs, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { RepoT } from '../apis';
import { numbersFormatter } from '../utils';
import { ISSUES_COLORS } from '@/colors';

export default defineComponent({
  name: 'GithubOpenClosedIssues',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    isError: {
      type: Boolean,
      required: true,
    },
    libs: {
      type: Array as () => string[],
      required: true,
    },
    repos: {
      type: Array as () => RepoT[],
      required: true,
    },
  },

  setup(props) {
    const { libs, repos, isLoading, isError } = toRefs(props);
    const datasets = computed<ChartDataSets[]>(
      () =>
        [
          {
            label: 'open bugs',
            stack: '1',
            data: repos.value.map((repo) => repo.openBugIssues.totalCount),
            backgroundColor: ISSUES_COLORS.OPEN_BUGS,
            borderWidth: 1,
          },
          {
            label: 'open others',
            stack: '1',
            data: repos.value.map(
              (repo) =>
                repo.openIssues.totalCount - repo.openBugIssues.totalCount
            ),
            backgroundColor: ISSUES_COLORS.OPEN,
            borderWidth: 1,
          },
          {
            label: 'closed bugs',
            stack: '2',
            data: repos.value.map((repo) => repo.closedBugIssues.totalCount),
            backgroundColor: ISSUES_COLORS.CLOSED_BUGS,
            borderWidth: 1,
          },
          {
            label: 'closed others',
            stack: '2',
            data: repos.value.map(
              (repo) =>
                repo.closedIssues.totalCount - repo.closedBugIssues.totalCount
            ),
            backgroundColor: ISSUES_COLORS.CLOSED,
            borderWidth: 1,
          },
        ] as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('issuesCount') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: libs.value,
          datasets: datasets.value,
        },

        options: {
          title: { display: false, text: 'Open issues, count' },
          // legend: { display: false },
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                  // @ts-ignore
                  precision: 0,
                  callback: (val: number): string =>
                    numbersFormatter.format(val),
                },
              },
            ],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libs, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = libs.value;
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {};
  },
});
</script>
