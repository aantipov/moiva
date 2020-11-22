<template>
  <div>
    <h2>ThoughtWorks TechRadar</h2>

    <div class="relative chart">
      <canvas id="techRadar" />
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
        radius: 6,
        pointHoverRadius: 10,
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
          maintainAspectRatio: false,
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
  height: 400px;
}
</style>
