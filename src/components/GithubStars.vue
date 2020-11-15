<template>
  <div>
    <canvas id="starsCount" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { RepoT } from './Github.vue';
// @ts-ignore
import { COLOR_GRAY } from '../../apps-config';

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
