<template>
  <div v-show="filteredLibs.length">
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">ThoughtWorks TechRadar</h2>

      <m-chart-info class="ml-2">
        <p>
          <a
            href="https://www.thoughtworks.com/radar/languages-and-frameworks"
            target="_blank"
            >ThoughtWorks</a
          >
          data is used to build the chart.
        </p>
      </m-chart-info>
    </div>

    <div class="chart">
      <canvas id="techRadar" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { format } from 'date-fns';
import Chart, { ChartConfiguration, ChartData } from 'chart.js';
import { TRADAR_LEVELS, libsToDatadMap } from '../../techradar.config';

export default defineComponent({
  name: 'TechRadar',
  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
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
        .map((lib) => Object.keys(libsToDatadMap[lib]))
        .flat();
      return [...new Set(dates)].sort();
    },
    chartDatasets(): unknown {
      return this.filteredLibs.map((lib) => ({
        label: lib,
        fill: false,
        data: this.uniqDates.map((date) => libsToDatadMap[lib][date]),
        backgroundColor: this.libToColorMap[lib],
        borderColor: this.libToColorMap[lib],
        spanGaps: true,
        borderWidth: 4,
        lineTension: 0,
        radius: 4,
        pointHoverRadius: 7,
      }));
    },
    filteredLibs(): string[] {
      return this.libs.filter((lib) => !!libsToDatadMap[lib]);
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
  height: 350px;
}
</style>
