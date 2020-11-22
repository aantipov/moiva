<template>
  <canvas id="issuesCount"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
// @ts-ignore
import { RepoT } from '../apis';
// @ts-ignore
import { COLOR_GREEN, COLOR_GRAY, numbersFormatter } from '../../apps-config';

export default Vue.extend({
  name: 'GithubOpenClosedIssues',

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
    const ctx1 = document.getElementById('issuesCount') as HTMLCanvasElement;

    const { apps, repos } = this;

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: apps,
        datasets: [
          {
            label: 'open',
            data: repos.map((repo) => repo.openIssues.totalCount),
            backgroundColor: COLOR_GREEN,
            borderWidth: 1,
          },
          {
            label: 'closed',
            data: repos.map((repo) => repo.closedIssues.totalCount),
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
          text: 'Issues, number',
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
