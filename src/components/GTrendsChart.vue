<template>
  <div class="relative w-full h-full">
    <canvas id="googleTrends"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import moment from 'moment';
import { GTrendPointT } from '../apis';
import { appsConfigsMap } from '../../apps-config';

export default Vue.extend({
  name: 'GTrendsChart',

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    data: {
      type: Array as () => Array<GTrendPointT>,
      required: true,
    },
  },

  mounted() {
    const { libs, data } = this;
    const ctx = document.getElementById('googleTrends') as HTMLCanvasElement;
    const categories = data.map(({ time }) =>
      new Date(time * 1000).toISOString().slice(0, 10)
    );

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: libs.map((app, key) => ({
          label: app,
          fill: false,
          data: data.map(({ value }) => value[key]),
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
              const month = tooltipItems[0].xLabel;

              return moment(month).format('ll');
            },
          },
        },
        title: {
          display: true,
          text: 'Interest Over Time',
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'year',
              },
            },
          ],
        },
      },
    });
  },
});
</script>
