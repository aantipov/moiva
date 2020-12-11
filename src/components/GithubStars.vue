<template>
  <canvas id="starsCount"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { RepoT } from '../apis';
import { numbersFormatter } from '../../apps-config';
import { COLOR_GRAY } from '../colors';

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
          padding: 5,
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
