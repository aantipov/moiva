<template>
  <canvas id="prsCount"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
// @ts-ignore
import { RepoT } from '../apis';
// @ts-ignore
import {
  COLOR_GREEN,
  COLOR_GRAY,
  COLOR_PINK,
  numbersFormatter,
} from '../../apps-config';

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
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'PRs, number',
        },
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                callback: (val: number): string => numbersFormatter.format(val),
              },
            },
          ],
          xAxes: [{ stacked: true }],
        },
      },
    });
  },
});
</script>
