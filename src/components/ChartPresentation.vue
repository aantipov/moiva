<template>
  <div>
    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-center relative">
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

        <m-chart-menu v-if="canCopy" class="absolute right-2" @copy="copy" />
      </div>

      <div v-if="since" class="flex justify-center z-50">
        <select
          v-model="dateRangeSince"
          name="date-range"
          @change="onDateRangeChange"
        >
          <option v-for="val in sinceValues" :key="val" :value="val">
            since {{ val }}
          </option>
        </select>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative -mt-5" style="height: 350px">
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
        ><div>
          {{ ariaLabel }}
        </div></canvas
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, watch, PropType } from 'vue';
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
    since: {
      type: String,
      required: false,
      default: null,
    },
    sinceValues: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
  },

  emits: ['sinceChange'],

  setup(props, ctx) {
    const { isLoading, chartConfig, isError, since, sinceValues } =
      toRefs(props);
    const chartEl = ref<null | HTMLCanvasElement>(null);
    const hasInfo = ref(!!ctx.slots.default);
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

    const dateRangeSince = ref(since.value);

    watch(sinceValues, () => {
      // sinceValues list changes on adding/removing a library.
      // reset the since value
      dateRangeSince.value = sinceValues.value[0];
    });

    return {
      chartEl,
      hasInfo,
      dateRangeSince,
      onDateRangeChange(): void {
        ctx.emit('sinceChange', dateRangeSince.value);
      },
      // @ts-ignore
      canCopy: !!window.chrome,
      copy(): void {
        chartEl.value?.toBlob(async (blob) => {
          // @ts-ignore
          await navigator.clipboard.write([
            // @ts-ignore
            new ClipboardItem({ 'image/png': blob }), // eslint-disable-line
          ]);
        });
      },
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
