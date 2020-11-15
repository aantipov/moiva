<template>
  <div>
    <canvas id="starsCount" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { RepoT } from './Github.vue';

export default Vue.extend({
  name: 'GithubStars',

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
    const ctx = document.getElementById('starsCount') as HTMLCanvasElement;
    const { apps, repos } = this;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: apps,
        datasets: [
          {
            label: 'Github stars',
            data: repos.map((repo) => repo.stars),
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [{ ticks: { beginAtZero: true } }],
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
