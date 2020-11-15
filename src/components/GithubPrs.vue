<template>
  <div>
    <canvas id="prsCount" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { RepoT } from './Github.vue';
// @ts-ignore
import { COLOR_GREEN, COLOR_GRAY, COLOR_PINK } from '../../apps-config';

export default Vue.extend({
  name: 'GithubPrs',

  props: {
    apps: {
      type: Array as () => string[],
      required: true,
    },
    repos: {
      type: Array as () => RepoT[],
      required: true,
    },
  },

  mounted(): void {
    const ctx = document.getElementById('prsCount') as HTMLCanvasElement;
    const { apps, repos } = this;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: apps,
        datasets: [
          {
            label: 'open',
            data: repos.map((repo) => repo.openPRs.totalCount),
            backgroundColor: COLOR_GREEN,
            borderWidth: 1,
          },
          {
            label: 'closed',
            data: repos.map((repo) => repo.closedPRs.totalCount),
            backgroundColor: COLOR_PINK,
            borderWidth: 1,
          },
          {
            label: 'merged',
            data: repos.map((repo) => repo.mergedPRs.totalCount),
            backgroundColor: COLOR_GRAY,
            borderWidth: 1,
          },
        ],
      },

      options: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'PRs, number',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          yAxes: [{ stacked: true, ticks: { beginAtZero: true } }],
          xAxes: [{ stacked: true }],
        },
      },
    });
  },
});
</script>

<style scoped lang="scss">
.chart-list {
  display: flex;
  flex-wrap: wrap;
}
.chart {
  width: 400px;
  height: 400px;
  margin: 20px auto;
}
</style>
