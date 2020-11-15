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
import appsConfigs, { AppConfigT } from '../../apps-config';

const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });

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
          data: downloads[key].map(({ downloads }) => downloads),
          backgroundColor: appsConfigsMap[app].npm.backgroundColor,
          borderColor: appsConfigsMap[app].npm.borderColor,
          borderWidth: 1,
        })),
      },
    });
  },
});
</script>
