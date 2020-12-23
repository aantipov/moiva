<template>
  <canvas id="bundlephobia"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from 'chart.js';
import { BundlephobiaT } from '../apis';
import { numbersFormatter } from '../utils';
import { COLOR_GREEN, COLOR_GRAY } from '../colors';

const roundBytesFn = (bytes: number): number => Math.round(bytes / 102.4) / 10;

export default defineComponent({
  name: 'BundlephobiaChart',

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    sizes: {
      type: Array as () => BundlephobiaT[],
      required: true,
    },
  },

  mounted(): void {
    const ctx = document.getElementById('bundlephobia') as HTMLCanvasElement;
    const { libs, sizes } = this;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: libs,
        datasets: [
          {
            label: 'minified + gzipped',
            data: sizes.map((size) => roundBytesFn(size.gzip)),
            backgroundColor: COLOR_GREEN,
            borderWidth: 1,
          },
          {
            label: 'minified',
            data: sizes.map((size) => roundBytesFn(size.raw)),
            backgroundColor: COLOR_GRAY,
            borderWidth: 1,
          },
        ],
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
              ).toLocaleString()}kB`;
            },
          },
        },
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Bundle size, kB',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: (val: number): string =>
                  numbersFormatter.format(val) + 'kB',
              },
            },
          ],
        },
      },
    });
  },
});
</script>
