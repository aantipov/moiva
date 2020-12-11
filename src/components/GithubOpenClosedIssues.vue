<template>
  <canvas id="issuesCount"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { RepoT } from '../apis';
import { numbersFormatter } from '../../apps-config';
import { COLOR_GRAY } from '../colors';

export default Vue.extend({
  name: 'GithubOpenClosedIssues',

  props: {
    libs: {
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

    const { libs, repos } = this;

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: libs,
        datasets: [
          {
            label: 'open',
            data: repos.map((repo) => repo.openIssues.totalCount),
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
          padding: 5,
          display: true,
          text: 'Open issues, count',
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
