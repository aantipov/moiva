<template>
  <div class="bg-gray-100 pt-2">
    <div
      v-if="showActions"
      class="flex justify-center mx-2 relative z-10 -mb-4"
    >
      <span class="link text-center w-1/3 px-2" @click="copyShare"
        >Copy and Share (Twitter)</span
      >
      <span class="link text-center w-1/3 px-2" @click="copy"
        >Copy to Clipboard</span
      >
      <span class="link text-center w-1/3" @click="download">Download</span>
    </div>

    <div v-if="title && showTitle" class="relative z-10 -mb-5">
      <!-- Header -->
      <div class="flex items-center justify-center relative">
        <h3 class="my-0">
          {{ title }}
          <span class="text-base">{{ subtitle }}</span>
        </h3>

        <m-chart-info v-if="$slots.default" class="ml-2"><slot /></m-chart-info>

        <m-chart-info v-if="failedLibsNames.length" class="ml-2" type="WARNING">
          <div>
            Sorry, we couldn't fetch data for the following packages:
            <div v-for="libName in failedLibsNames" :key="libName">
              - {{ libName }}
            </div>

            Try reload the page or check later.
          </div>
        </m-chart-info>

        <m-chart-menu
          class="absolute right-2"
          @copy="copy"
          @copyShare="copyShare"
          @download="download"
        />
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
        ><div>
          {{ ariaLabel }}
        </div></canvas
      >
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
  showTitle?: boolean;
  subtitle?: string;
  isLoading?: boolean;
  isError?: boolean;
  libsNames: string[];
  failedLibsNames?: string[];
  chartConfig: ChartConfiguration;
  ariaLabel?: string;
  since?: string;
  sinceValues?: string[];
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showTitle: true,
  subtitle: '',
  isLoading: false,
  isError: false,
  failedLibsNames: () => [],
  ariaLabel: '',
  // @ts-ignore
  since: null,
  sinceValues: () => [],
  showActions: false,
});

const emit = defineEmits(['sinceChange']);

const chartEl = ref<null | HTMLCanvasElement>(null);
let mychart: Chart;

function initChart(): void {
  const ctx = chartEl.value as HTMLCanvasElement;
  mychart = new Chart(ctx, props.chartConfig);
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
      mychart.data = props.chartConfig.data;
      mychart.options = props.chartConfig.options as ChartOptions;
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
