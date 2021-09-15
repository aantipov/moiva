<template>
  <m-chart
    v-if="isDisplayed"
    title="Developer Usage, %"
    :is-loading="isLoading"
    :is-error="false"
    :libs-names="libsNames"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div>Percentage of developers using the library.</div>
      <div class="flex justify-center">
        Data source:
        <m-ext-link
          class="mx-1"
          href="https://stateofjs.com/"
          txt="StateOfJS"
        />
        and
        <m-ext-link
          class="mx-1"
          href="https://stateofcss.com/"
          txt="StateOfCSS"
        />
        surveys
      </div>
    </template>
  </m-chart>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { StateOfJSItemT } from '@/data/index';
import { LibraryReadonlyT } from '@/libraryApis';
import { librariesRR, isLoading } from '@/store/libraries';
import { chartsVisibility } from '@/store/chartsVisibility';

interface FilteredLibT extends LibraryReadonlyT {
  devUsage: StateOfJSItemT;
}
const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.devUsage) as FilteredLibT[]
);

watchEffect(() => {
  chartsVisibility.developerUsage =
    filteredLibsRef.value.length > 0 &&
    !(
      filteredLibsRef.value.length === 1 &&
      filteredLibsRef.value[0].devUsage.usage.length === 1
    );
});

const chartConfig = computed<ChartConfiguration>(() => ({
  type: 'line',
  data: {
    datasets: filteredLibsRef.value.map((lib) => ({
      label: lib.devUsage.name,
      data: lib.devUsage.usage.map((usageItem) => ({
        x: usageItem.year.toString() as unknown as number,
        y: usageItem.value,
      })),
      spanGaps: true,
      backgroundColor: lib.color,
      borderColor: lib.color,
    })),
  },

  options: {
    normalized: true,
    scales: {
      x: {
        type: 'time',
        time: { unit: 'year' },
      },
      y: {
        ticks: {
          beginAtZero: false,
          precision: 0,
          callback: (val): string => val + '%',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context): string => {
            return ` ${context.dataset.label}: ${context.formattedValue}%`;
          },
        },
      },
    },
  },
}));

const isDisplayed = computed(() => chartsVisibility.developerUsage);

const libsNames = computed(() =>
  filteredLibsRef.value.map((lib) => lib.devUsage.name)
);

const ariaLabel = computed(() => {
  const str = filteredLibsRef.value
    .map(
      (lib) =>
        `${lib.alias} is used by ${
          lib.devUsage.usage.slice(-1)[0].value
        }% of developers.`
    )
    .join(' ');
  return `Developer Usage statistics according to StateOfJS survey. ${str}`;
});
</script>
