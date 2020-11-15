<template>
  <div>
    <h2>ThoughtWorks Technology Radar</h2>

    <div class="chart">
      <canvas id="techRadar" width="800" height="400" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
// @ts-ignore
import { appsConfigsMap, TRADAR_LEVELS } from '../../apps-config';

export default Vue.extend({
  name: 'TechRadar',

  props: {
    apps: {
      type: Array as () => string[],
      required: true,
    },
  },

  computed: {
    uniqDates(): string[] {
      const dates = this.apps
        .map((app) => Object.keys(appsConfigsMap[app].tradar.data))
        .flat();
      return [...new Set(dates)].sort();
    },
  },

  watch: {
    apps(): void {
      this.updateChart();
    },
  },

  mounted(): void {
    this.updateChart();
  },

  methods: {
    updateChart(): void {
      const ctx = document.getElementById('techRadar') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'line',

        data: {
          labels: this.uniqDates,
          // @ts-ignore
          xLabels: this.uniqDates,
          yLabels: TRADAR_LEVELS,
          // @ts-ignore
          datasets: this.apps.map((app) => ({
            label: app,
            fill: false,
            data: this.uniqDates.map(
              (date) => appsConfigsMap[app].tradar.data[date]
            ),
            backgroundColor: appsConfigsMap[app].color,
            borderColor: appsConfigsMap[app].color,
            spanGaps: true,
            borderWidth: 2,
            lineTension: 0,
            pointStyle: 'triangle',
            radius: 8,
          })),
        },

        options: {
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            yAxes: [{ type: 'category', ticks: { reverse: true } }],
          },
        },
      });
    },
  },
});
</script>

<style scoped lang="scss">
.chart {
  width: 800px;
  height: 400px;
  margin: 0 auto;
}
</style>
