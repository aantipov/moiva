<template>
  <div>
    <canvas id="npmDownloads" width="1200" height="600"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { NpmDownloadT } from './Npm.vue';
// @ts-ignore
import { appsConfigsMap, numbersFormatter } from '../../apps-config';

export default Vue.extend({
  name: 'NpmChart',

  props: {
    apps: {
      type: Array as () => string[],
      required: true,
    },
    downloads: {
      type: Array as () => Array<Array<NpmDownloadT>>,
      required: true,
    },
  },

  mounted() {
    const { apps, downloads } = this;
    const ctx = document.getElementById('npmDownloads') as HTMLCanvasElement;
    const categories = downloads[0].map(({ month }) => month);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: apps.map((app, key) => ({
          label: app,
          fill: false,
          data: downloads[key].map(({ downloads }) => downloads),
          backgroundColor: appsConfigsMap[app].color,
          borderColor: appsConfigsMap[app].color,
          borderWidth: 1,
        })),
      },

      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: (val: number): string => numbersFormatter.format(val),
              },
            },
          ],
          xAxes: [{ ticks: { fontSize: 13 } }],
        },
      },
    });
  },
});
</script>
