<template>
  <div>
    <div
      ref="triggerRef"
      class="cursor-pointer rounded-md p-1 text-gray-600 hover:bg-black/20 hover:text-black hover:shadow-md"
    >
      <m-chart-icon />
    </div>

    <div
      ref="contentRef"
      class="-mx-2 divide-y divide-gray-300 font-normal text-gray-800"
      @click="hide"
    >
      <div style="width: 500px; max-width: 100%" class="overflow-y-hidden">
        <ChartPresentation
          :is-loading="!libsNames.length"
          :libs-names="libsNames"
          :chart-config="chartConfig"
          :title="metricData.chart.title"
          popup-mode
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartPresentation from '@/components/ChartPresentation.vue';
import { computed, onMounted, ref } from 'vue';
import tippy, { Instance, roundArrow } from 'tippy.js';
import { ChartConfiguration } from 'chart.js';
import { descend, sort, path, prop } from 'ramda';
import {
  getFormattedAgeFromAgeInMs,
  numbersFormatter,
  numbersStandardFormatter,
} from '@/utils';
import { librariesRR } from '@/store/libraries';
import { MetricDataWithChartT } from '@/components/table/TableConfig';

const props = defineProps<{
  metricData: MetricDataWithChartT;
}>();

const contentRef = ref(null);
const triggerRef = ref(null);
let t: Instance;

const metricRef = computed(() => props.metricData.metric);
const metricConfigRef = computed(() => props.metricData.chart);

onMounted(() => {
  t = tippy(triggerRef.value as unknown as HTMLElement, {
    content: contentRef.value as unknown as HTMLElement,
    appendTo: () => document.body,
    trigger: 'click',
    arrow: roundArrow + roundArrow,
    delay: [0, 150],
    interactive: true,
    allowHTML: true,
    theme: 'metric-chart',
    hideOnClick: true,
  });
});

const pickDataFn = path<number>(metricConfigRef.value.path.split('.'));
const sortFn = (metricConfigRef.value.sortDirFn || descend)(pickDataFn);

const librariesSortedRR = computed(() => {
  const filteredLibraries = librariesRR.filter(
    (lib) => pickDataFn(lib) !== undefined,
  );
  // @ts-ignore
  return sort(sortFn, filteredLibraries);
});

const libsNamesRef = computed(() => librariesSortedRR.value.map(prop('alias')));
const libsDataRef = computed(() => librariesSortedRR.value.map(pickDataFn));
const libsColorsRef = computed(() =>
  librariesSortedRR.value.map(prop('color')),
);
const hide = () => t.hide();
const libsNames = libsNamesRef;

// @ts-ignore
const chartConfig = computed<ChartConfiguration<'bar'>>(() => {
  return {
    type: 'bar',
    data: {
      labels: libsNamesRef.value,
      datasets: [
        {
          data: libsDataRef.value,
          backgroundColor: libsColorsRef.value,
          borderColor: 'gray',
          borderWidth: 1,
        },
      ],
    },

    options: {
      scales: {
        y: {
          ticks: {
            precision: metricConfigRef.value.stepPrecision,
            beginAtZero: true,
            callback: (() => {
              if (metricRef.value === 'bundlesize') {
                return (val: number) => val;
              }
              if (metricRef.value === 'age') {
                return getFormattedAgeFromAgeInMs;
              }
              return numbersFormatter.format;
            })(),
          },
        },
      },

      plugins: {
        tooltip: {
          callbacks: {
            label: (context): string => {
              let val;
              if (metricConfigRef.value.percent) {
                // @ts-ignore
                val = numbersStandardFormatter.format(context.raw) + '%';
              } else if (metricRef.value === 'bundlesize') {
                val = context.raw + ' kB';
              } else if (metricRef.value === 'age') {
                // @ts-ignore
                val = getFormattedAgeFromAgeInMs(context.raw);
              } else {
                // @ts-ignore
                val = numbersStandardFormatter.format(context.raw);
              }
              return ` ${context.label}: ${val}`;
            },
          },
        },
      },
    },
  };
});
</script>

<style lang="postcss">
.tippy-box[data-theme~='metric-chart'] {
  max-width: 90vw !important;
  max-height: 80vh !important;
  padding: 0px;
  @apply border border-gray-300 bg-gray-100 shadow;
}

/* The border */
.tippy-box[data-theme~='metric-chart'] > .tippy-svg-arrow > svg:first-child {
  @apply fill-current text-gray-800;
}

/* The fill */
.tippy-box[data-theme~='metric-chart'] > .tippy-svg-arrow > svg:last-child {
  @apply fill-current text-gray-100;
}
</style>
