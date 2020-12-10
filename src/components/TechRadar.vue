<template>
  <div>
    <h2>ThoughtWorks TechRadar</h2>

    <div class="relative chart">
      <div
        v-if="!filteredLibs.length"
        class="h-full pt-40 text-2xl text-red-600 bg-gray-200"
      >
        <div class="flex justify-center">No Data</div>
        <div class="flex justify-center">for selected libraries</div>
      </div>

      <canvas v-show="filteredLibs.length" id="techRadar" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { format } from 'date-fns';
import Chart, { ChartConfiguration, ChartData } from 'chart.js';
// @ts-ignore
import { appsConfigsMap, TRADAR_LEVELS, TechRadarT } from '../../apps-config';

export default Vue.extend({
  name: 'TechRadar',
  props: {
    libs: {
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
      const dates = this.filteredLibs
        .map((lib) =>
          Object.keys((appsConfigsMap[lib].tradar as TechRadarT).data)
        )
        .flat();
      return [...new Set(dates)].sort();
    },
    chartDatasets(): any {
      return this.filteredLibs.map((lib) => ({
        label: lib,
        fill: false,
        data: this.uniqDates.map(
          (date) => (appsConfigsMap[lib].tradar as TechRadarT).data[date]
        ),
        backgroundColor: appsConfigsMap[lib].color,
        borderColor: appsConfigsMap[lib].color,
        spanGaps: true,
        borderWidth: 3,
        lineTension: 0,
        radius: 6,
        pointHoverRadius: 10,
      }));
    },
    filteredLibs(): string[] {
      return this.libs.filter((lib) => !!appsConfigsMap[lib].tradar);
    },
  },

  watch: {
    libs(): void {
      if (this.filteredLibs.length) {
        this.updateChart();
      }
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
            callbacks: {
              title: (tooltipItems): string => {
                const month = tooltipItems[0].xLabel as string;

                return format(new Date(month), 'MMM, yyyy');
              },
              label: (tooltipItem, data): string => {
                // @ts-ignore
                const label = data.datasets[tooltipItem.datasetIndex].label;

                // @ts-ignore
                return ` ${label}: ${tooltipItem.yLabel}`;
              },
            },
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  callback(value): string {
                    return format(new Date(value), 'MMM, yyyy');
                  },
                },
              },
            ],
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
