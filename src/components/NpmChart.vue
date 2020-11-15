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
import { appsConfigsMap } from '../../apps-config';

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
          backgroundColor: appsConfigsMap[app].npm.backgroundColor,
          borderColor: appsConfigsMap[app].npm.borderColor,
          borderWidth: 1,
        })),
      },

      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
      },
    });
  },
});
</script>
