<template>
  <div class="relative w-full h-full">
    <canvas id="googleTrends"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from 'chart.js';
import { format } from 'date-fns';
import { GTrendPointT } from '../apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'GTrendsChart',

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
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
        datasets: libs.map((lib, key) => ({
          label: lib,
          fill: false,
          data: data.map(({ value }) => value[key]),
          backgroundColor: this.libToColorMap[lib],
          borderColor: this.libToColorMap[lib],
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

              return format(new Date(month), 'PP');
            },
          },
        },
        title: { display: false },
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [
            {
              type: 'time',
              time: { unit: 'year' },
            },
          ],
        },
      },
    });
  },
});
</script>
