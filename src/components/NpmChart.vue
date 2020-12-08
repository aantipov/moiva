<template>
  <div class="relative w-full h-full">
    <canvas id="npmDownloads"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
// @ts-ignore
import { NpmDownloadT } from '../apis';
// @ts-ignore
import { appsConfigsMap, numbersFormatter } from '../../apps-config';

export default Vue.extend({
  name: 'NpmChart',

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    downloads: {
      type: Array as () => Array<Array<NpmDownloadT>>,
      required: true,
    },
  },

  mounted() {
    const { libs, downloads } = this;
    const ctx = document.getElementById('npmDownloads') as HTMLCanvasElement;
    const categories = downloads[0].map(({ month }) => month);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: libs.map((app, key) => ({
          label: app,
          fill: false,
          data: downloads[key].map(({ downloads }) => downloads),
          backgroundColor: appsConfigsMap[app].color,
          borderColor: appsConfigsMap[app].color,
          borderWidth: 4,
          pointRadius: 0,
          pointHoverRadius: 6,
        })),
      },

      options: {
        tooltips: {
          callbacks: {
            label: (tooltipItem, data): string => {
              // @ts-ignore
              const label = data.datasets[tooltipItem.datasetIndex].label;

              // @ts-ignore
              return ` ${label}: ${Number(
                tooltipItem.yLabel
              ).toLocaleString()}`;
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
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
