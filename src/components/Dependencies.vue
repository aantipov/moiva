<template>
  <div>
    <h2>Dependencies</h2>

    <div style="height: 350px">
      <canvas id="dependencies"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, toRefs, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
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

  setup(props) {
    const { libs } = toRefs(props);
    const labels = computed<string[]>(() => libs.value.map((lib) => lib.name));
    const datasets = computed<ChartDataSets[]>(
      () =>
        [
          {
            label: 'dependencies',
            data: libs.value.map((lib) => lib.dependencies.length),
            backgroundColor: COLOR_GRAY,
            borderWidth: 1,
          },
        ] as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('dependencies') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels.value,
          datasets: datasets.value,
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
    }

    onMounted(initChart);

    watch(libs, () => {
      (mychart as Chart).data.labels = labels.value;
      (mychart as Chart).data.datasets = datasets.value;
      (mychart as Chart).update();
    });

    return {};
  },
});
</script>
