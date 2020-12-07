<template>
  <canvas id="starsCount"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
// @ts-ignore
import { RepoT } from '../apis';
// @ts-ignore
import { COLOR_GRAY, numbersFormatter } from '../../apps-config';

export default Vue.extend({
  name: 'GithubStars',

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
    const ctx = document.getElementById('starsCount') as HTMLCanvasElement;
    const { libs, repos } = this;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: libs,
        datasets: [
          {
            label: 'stars',
            data: repos.map((repo) => repo.stars),
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
          text: 'Stars',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
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
