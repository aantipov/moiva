<template>
  <div>
    <h2>Dependencies</h2>

    <div style="height: 350px">
      <canvas id="dependencies"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from 'chart.js';
import { LibraryT } from '../apis';
import { COLOR_GRAY } from '../colors';

export default defineComponent({
  name: 'Dependencies',

  props: {
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
  },

  mounted(): void {
    const ctx = document.getElementById('dependencies') as HTMLCanvasElement;
    const { libs } = this;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: libs.map((lib) => lib.name),
        datasets: [
          {
            label: 'Dependencies',
            data: libs.map((lib) => lib.dependencies.length),
            backgroundColor: COLOR_GRAY,
            borderWidth: 1,
          },
        ],
      },

      options: {
        title: {
          display: false,
          text: 'Dependencies',
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                // @ts-ignore
                precision: 0,
              },
            },
          ],
        },
      },
    });
  },
});
</script>
