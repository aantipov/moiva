<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center">
      <h3 class="my-0">
        {{ title }}
        <span class="text-base">{{ subtitle }}</span>
      </h3>

      <m-chart-info v-if="hasInfo" class="ml-2"><slot /></m-chart-info>

      <m-chart-info v-if="failedLibsNames.length" class="ml-2" type="WARNING">
        <div>
          Sorry, we couldn't fetch data for the following packages:
          <div v-for="libName in failedLibsNames" :key="libName">
            - {{ libName }}
          </div>

          Try reload the page or check later.
        </div>
      </m-chart-info>
    </div>

    <!-- Chart -->
    <div class="relative" style="height: 350px">
      <m-loader v-if="isLoading" />

      <div v-else-if="isError || !libsNames.length" class="chart-error-new">
        <div>
          Sorry we couldn't load the data. <br />
          Try reload the page or check later
        </div>
      </div>

      <canvas
        v-show="!isError && libsNames.length"
        ref="chartEl"
        role="img"
        :aria-label="ariaLabel"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, watch } from 'vue';
import {
  Chart,
  ChartData,
  ChartDataset,
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';

export default defineComponent({
  name: 'ChartPresentation',

  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: false, default: '' },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    failedLibsNames: { type: Array as () => string[], required: true },
    chartConfig: {
      type: Object as () => ChartConfiguration,
      required: true,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
  },

  setup(props, { slots }) {
    const { isLoading, chartConfig, isError } = toRefs(props);
    const chartEl = ref<null | HTMLCanvasElement>(null);
    const hasInfo = ref(!!slots.default);
    let mychart: Chart;

    function initChart(): void {
      const ctx = chartEl.value as HTMLCanvasElement;
      mychart = new Chart(ctx, chartConfig.value as ChartConfiguration);
      fillOneLineCharts(mychart, chartConfig.value.type) && mychart.update();
    }

    onMounted(initChart);

    watch([chartConfig, isLoading, isError], () => {
      const { data, options, type } = chartConfig.value;

      if (!isLoading.value && !isError.value) {
        mychart.data = data as ChartData;
        mychart.options = options as ChartOptions;
        fillOneLineCharts(mychart, type);
        mychart.update();
      }
    });

    return {
      chartEl,
      hasInfo,
    };
  },
});

/**
 * Make sure one line charts are always filled.
 * Returns true if changes were made.
 * Otherwise returns false.
 */
function fillOneLineCharts(chart: Chart, type: string): boolean {
  const { datasets } = chart.data;
  if (type === 'line' && datasets.length) {
    (datasets[0] as ChartDataset<'line'>).fill =
      datasets.length > 1 ? false : 'origin';
    return true;
  }
  return false;
}
</script>
