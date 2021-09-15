<template>
  <div
    class="bg-gray-100 rounded relative overflow-hidden"
    :class="{ withBorder: !hideBorder }"
  >
    <div
      v-if="!showActions || $slots.info || failedLibsNames.length"
      class="absolute top-4 right-4 z-30 flex"
    >
      <!--   Warning Icon with Failures description   -->
      <m-chart-info
        v-if="failedLibsNames.length"
        style="margin-top: -2px"
        type="WARNING"
      >
        <div>
          Sorry, we couldn't fetch data for the following packages:
          <div v-for="libName in failedLibsNames" :key="libName">
            - {{ libName }}
          </div>

          Try reload the page or check later.
        </div>
      </m-chart-info>

      <!-- Info Icon -->
      <m-chart-info v-if="$slots.info" style="margin-top: -2px">
        <slot name="info" />
      </m-chart-info>

      <m-chart-menu @copy="copy" @copyShare="copyShare" @download="download" />
    </div>

    <!-- Chart -->
    <div style="height: 350px">
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

    <!--  Timerange selector -->
    <div v-if="since" class="relative flex justify-center z-50 -mt-3 mb-5">
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

    <!--  Chart Actions -->
    <div v-if="showActions" class="flex justify-center" style="height: 50px">
      <span class="link text-center w-1/3 px-2" @click="copyShare"
        >Copy and Share (Twitter)</span
      >
      <span class="link text-center w-1/3 px-2" @click="copy"
        >Copy to Clipboard</span
      >
      <span class="link text-center w-1/3" @click="download">Download</span>
    </div>

    <!--  Footer -->
    <div
      v-if="$slots.footer || dataSourceTxt"
      class="relative text-center mb-3 -mt-3 text-gray-700"
    >
      <slot name="footer">
        <div v-if="dataSourceTxt" class="flex justify-center">
          Data source:
          <m-ext-link class="ml-1" :href="dataSourceUrl" :txt="dataSourceTxt" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, onMounted, watch } from 'vue';
import {
  Chart,
  ChartDataset,
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';
import { librariesRR } from '@/store/libraries';

interface Props {
  title?: string;
  hideLegend?: boolean;
  hideBorder?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  libsNames: string[];
  failedLibsNames?: string[];
  chartConfig: ChartConfiguration;
  ariaLabel?: string;
  since?: string;
  sinceValues?: string[];
  showActions?: boolean;
  dataSourceTxt?: string;
  dataSourceUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  hideLegend: false,
  hideBorder: false,
  isLoading: false,
  isError: false,
  failedLibsNames: () => [],
  ariaLabel: '',
  // @ts-ignore
  since: null,
  sinceValues: () => [],
  showActions: false,
  dataSourceTxt: '',
  dataSourceUrl: '',
});

const emit = defineEmits(['sinceChange']);

const chartEl = ref<null | HTMLCanvasElement>(null);
let mychart: Chart;

function enchanceChartConfig(
  chartConfig: ChartConfiguration,
  title: string
): ChartConfiguration {
  chartConfig.options = chartConfig.options || {};
  chartConfig.options.plugins = chartConfig.options.plugins || {};
  chartConfig.options.plugins.title = chartConfig.options.plugins.title || {};
  chartConfig.options.plugins.title.text = title;
  chartConfig.options.plugins.title.display = true;
  chartConfig.options.plugins.title.padding = { top: 0, bottom: 4 };
  if (props.hideLegend) {
    chartConfig.options.plugins.legend = { display: false };
    chartConfig.options.plugins.title.padding.bottom = 16;
  }
  return chartConfig;
}

function initChart(): void {
  const ctx = chartEl.value as HTMLCanvasElement;
  mychart = new Chart(ctx, enchanceChartConfig(props.chartConfig, props.title));
  fillOneLineCharts(mychart, props.chartConfig.type) && mychart.update();
}

onMounted(initChart);

watch(
  [
    toRef(props, 'chartConfig'),
    toRef(props, 'isLoading'),
    toRef(props, 'isError'),
  ],
  () => {
    if (!props.isLoading && !props.isError) {
      const chartConfig = enchanceChartConfig(props.chartConfig, props.title);
      mychart.data = chartConfig.data;
      mychart.options = chartConfig.options as ChartOptions;
      fillOneLineCharts(mychart, props.chartConfig.type);
      mychart.update();
    }
  }
);

const dateRangeSince = ref(props.since);

watch(toRef(props, 'sinceValues'), () => {
  // sinceValues list changes on adding/removing a library.
  // reset the since value
  if (props.sinceValues) {
    dateRangeSince.value = props.sinceValues[0];
  }
});

function onDateRangeChange(): void {
  emit('sinceChange', dateRangeSince.value);
}

function copy(): void {
  chartEl.value?.toBlob(async (blob) => {
    // @ts-ignore
    await navigator.clipboard.write([
      // @ts-ignore
      new ClipboardItem({ 'image/png': blob }), // eslint-disable-line
    ]);
  });
}

function copyShare(): void {
  chartEl.value?.toBlob(async (blob) => {
    // @ts-ignore
    await navigator.clipboard.write([
      // @ts-ignore
      new ClipboardItem({ 'image/png': blob }), // eslint-disable-line
    ]);

    const title = encodeURIComponent((props.title as string).replace(',', ''));
    const libsAliases = encodeURIComponent(
      librariesRR.map((lib) => lib.alias).join(' vs ')
    );
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://twitter.com/intent/tweet?text=${title}: ${libsAliases}&url=${url}`,
      '_blank'
    );
  });
}

function download(): void {
  chartEl.value?.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = (props.title as string).replace(',', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

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

<style lang="postcss">
.withBorder {
  @apply border border-gray-200;
}
</style>
