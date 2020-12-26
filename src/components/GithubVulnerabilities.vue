<template>
  <canvas id="vulnerabilities"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from 'chart.js';
import { RepoT } from '../apis';
import { numbersFormatter } from '../utils';
import { COLOR_GRAY } from '../colors';

export default defineComponent({
  name: 'GithubVulnerabilities',

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
    const ctx = document.getElementById('vulnerabilities') as HTMLCanvasElement;
    const { libs, repos } = this;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: libs,
        datasets: [
          {
            label: 'open+closed',
            data: repos.map((repo) => repo.vulnerabilitiesCount),
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
          text: 'Vulnerabilities (open + closed)',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                // @ts-ignore
                precision: 0,
                callback: (val: number): string => numbersFormatter.format(val),
              },
            },
          ],
        },
      },
    });
  },
});
</script>
