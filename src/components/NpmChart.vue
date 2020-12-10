<template>
  <div class="relative w-full h-full">
    <canvas id="npmDownloads"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import { format } from 'date-fns';
// @ts-ignore
import { NpmDownloadT } from '../apis';
// @ts-ignore
import { appsConfigsMap, numbersFormatter } from '../../apps-config';
import { enUS } from 'date-fns/locale';

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
            title: (tooltipItems): string => {
              const month = tooltipItems[0].xLabel as string;

              return format(new Date(month), 'MMM, yyyy');
            },
          },
        },
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [
            {
              type: 'time',
              time: { unit: 'year' },
            },
          ],
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
