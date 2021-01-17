<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">
        {{ title }}
        <span class="text-base">{{ subtitle }}</span>
      </h2>

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

      <canvas v-show="!isError && libsNames.length" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, watch } from 'vue';
import Chart from 'chart.js';

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
      type: Object as () => Chart.ChartConfiguration,
      required: true,
    },
  },

  setup(props, { slots }) {
    const { isLoading, chartConfig, isError } = toRefs(props);
    const chartEl = ref<null | HTMLCanvasElement>(null);
    const hasInfo = ref(!!slots.default);
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = chartEl.value as HTMLCanvasElement;
      mychart = new Chart(ctx, chartConfig.value);
    }

    onMounted(initChart);

    watch([chartConfig, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = chartConfig.value.data?.labels;
        // @ts-ignore
        (mychart as Chart).data.xLabels = chartConfig.value.data?.xLabels;
        // @ts-ignore
        (mychart as Chart).data.yLabels = chartConfig.value.data?.yLabels;
        (mychart as Chart).data.datasets = chartConfig.value.data?.datasets;
        (mychart as Chart).update();
      }
    });

    return {
      chartEl,
      hasInfo,
    };
  },
});
</script>
