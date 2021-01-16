<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Recently updated issues</h2>

      <m-chart-info class="ml-2">
        <p>
          Amount of open/closed repository issues updated in the last 6 months
        </p>
      </m-chart-info>

      <m-chart-info v-if="failedLibsNames.length" class="ml-2" type="WARNING">
        <div>
          Sorry, we couldn't fetch data from GitHub for the following packages:
          <div v-for="libName in failedLibsNames" :key="libName">
            - {{ libName }}
          </div>

          Try reload the page or check later.
        </div>
      </m-chart-info>
    </div>

    <!-- Chart -->
    <div class="relative" style="height: 350px">
      <m-loader v-if="isLoading || isLoadingLibsData" />

      <div
        v-else-if="isError || !filteredLibsNames.length"
        class="chart-error-new"
      >
        <div>
          Sorry we couldn't load the data. <br />
          Try reload the page or check later
        </div>
      </div>

      <canvas
        v-show="!isError && filteredLibsNames.length"
        id="issuesCount"
      ></canvas>
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
  name: 'Issues',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    repos: { type: Array as () => (RepoT | null)[], required: true },
  },

  setup(props) {
    const { libsNames, repos, isLoadingLibsData, isLoading, isError } = toRefs(
      props
    );

    const filteredRepos = computed<RepoT[]>(
      () => repos.value.filter((repo) => !!repo) as RepoT[]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter((libName, libIndex) => !!repos.value[libIndex])
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value && !isLoading.value && !repos.value[libIndex]
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

    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('issuesCount') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
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
                  callback: (val: number): string =>
                    numbersFormatter.format(val),
                } as Chart.TickOptions,
              },
            ],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libsNames, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = filteredLibsNames.value;
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {
      failedLibsNames,
      filteredLibsNames,
    };
  },
});
</script>
