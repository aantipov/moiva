<template>
  <canvas id="createdAt"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from 'chart.js';
import { RepoT } from '../apis';
import { COLOR_GRAY } from '../colors';

export default defineComponent({
  name: 'GithubAge',

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
    const ctx = document.getElementById('createdAt') as HTMLCanvasElement;
    const { libs, repos } = this;

    function getAge(date: string): number {
      const now = new Date().getTime();
      const then = new Date(date).getTime();

      return Number(((now - then) / (1000 * 3600 * 24 * 365)).toFixed(2));
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: libs,
        datasets: [
          {
            label: 'years',
            data: repos.map((repo) => getAge(repo.createdAt)),
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
          text: 'Age, years',
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true } }],
        },
      },
    });
  },
});
</script>
