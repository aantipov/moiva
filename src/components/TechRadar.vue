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
import Chart, { ChartConfiguration, ChartData } from 'chart.js';
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

  data() {
    return {
      chart: (null as unknown) as Chart,
    };
  },

  computed: {
    uniqDates(): string[] {
      const dates = this.apps
        .map((app) => Object.keys(appsConfigsMap[app].tradar.data))
        .flat();
      return [...new Set(dates)].sort();
    },
    chartDatasets(): any {
      return this.apps.map((app) => ({
        label: app,
        fill: false,
        data: this.uniqDates.map(
          (date) => appsConfigsMap[app].tradar.data[date]
        ),
        backgroundColor: appsConfigsMap[app].color,
        borderColor: appsConfigsMap[app].color,
        spanGaps: true,
        borderWidth: 3,
        lineTension: 0,
        pointStyle: 'triangle',
        radius: 8,
      }));
    },
  },

  watch: {
    apps(): void {
      this.updateChart();
    },
  },

  mounted(): void {
    this.initChart();
  },

  methods: {
    updateChart(): void {
      this.chart.data = {
        labels: this.uniqDates,
        xLabels: this.uniqDates,
        yLabels: TRADAR_LEVELS,
        datasets: this.chartDatasets,
      } as ChartData;

      this.chart.update();
    },

    initChart(): void {
      const ctx = document.getElementById('techRadar') as HTMLCanvasElement;

      this.chart = new Chart(ctx, {
        type: 'line',

        data: {
          labels: this.uniqDates,
          xLabels: this.uniqDates,
          yLabels: TRADAR_LEVELS,
          datasets: this.chartDatasets,
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
      } as ChartConfiguration);
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
