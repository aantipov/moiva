<template>
  <div>
    <div ref="triggerRef" class="px-1 cursor-pointer">
      <m-chart-icon class="text-gray-600 hover:text-black" />
    </div>

    <div
      ref="contentRef"
      class="text-gray-800 font-normal -mx-2 divide-gray-300 divide-y"
      @click="hide"
    >
      <div style="width: 500px; max-width: 100%; height: 350px">
        <div v-if="!libsNames.length">
          <m-loader-new class="items-center" />
        </div>

        <m-chart
          v-else
          :libs-names="libsNames"
          :chart-config="chartConfig"
          :title="metricData.chart.title"
          :show-title="false"
          show-actions
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const metric = props.metricData.metric;
const metricConfig = props.metricData.chart as MetricDataChartT;

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

const pickDataFn = path<number>(metricConfig.path.split('.'));
const sortFn = (metricConfig.sortDirFn || descend)(pickDataFn);

const librariesSortedRR = computed(() => {
  const filteredLibraries = librariesRR.filter(
    (lib) => pickDataFn(lib) !== undefined
  );
  // @ts-ignore
  return sort(sortFn, filteredLibraries);
});

const libsNamesRef = computed(() => librariesSortedRR.value.map(prop('alias')));
const libsDataRef = computed(() => librariesSortedRR.value.map(pickDataFn));
const libsColorsRef = computed(() =>
  librariesSortedRR.value.map(prop('color'))
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
            beginAtZero: true,
            callback: (() => {
              if (metric === 'bundlesize') {
                return (val: number) => val;
              }
              if (metric === 'age') {
                return getFormattedAgeFromAgeInMs;
              }
              return numbersFormatter.format;
            })(),
          },
        },
      },

      plugins: {
        legend: { display: false },
        title: {
          text: metricConfig.title,
          display: true,
          padding: { top: 0, bottom: 25 },
        },
        tooltip: {
          callbacks: {
            label: (context): string => {
              let val;
              if (metricConfig.percent) {
                // @ts-ignore
                val = numbersStandardFormatter.format(context.raw) + '%';
              } else if (metric === 'bundlesize') {
                val = context.raw + ' kB';
              } else if (metric === 'age') {
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
  @apply bg-gray-50 border-gray-200 border shadow;
}

/* The border */
.tippy-box[data-theme~='metric-chart'] > .tippy-svg-arrow > svg:first-child {
  @apply fill-current text-gray-800;
}

/* The fill */
.tippy-box[data-theme~='metric-chart'] > .tippy-svg-arrow > svg:last-child {
  @apply fill-current text-gray-50;
}
</style>
