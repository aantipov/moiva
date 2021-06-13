<template>
  <m-chart
    v-if="isDisplayed"
    title="Developer Usage,"
    subtitle="%"
    :is-loading="isLoading"
    :is-error="false"
    :libs-names="libsNames"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Percentage of developers using the library.</p>
    <p>Data are provided for a limited number of libraries only.</p>
    <p>
      Data source:
      <a href="https://stateofjs.com/" target="_blank">StateOfJS</a> and
      <a href="https://stateofcss.com/" target="_blank">StateOfCSS</a> surveys
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { StateOfJSItemT } from '@/data/index';
import { LibraryReadonlyT } from '@/libraryApis';
import { librariesRR, isLoading } from '@/store/libraries';
import { chartsVisibility } from '@/store/chartsVisibility';

interface FilteredLibT extends LibraryReadonlyT {
  devUsage: StateOfJSItemT;
}

export default defineComponent({
  name: 'DevelopersUsageChart',

  setup() {
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

    return {
      isDisplayed: computed(() => chartsVisibility.developerUsage),
      isLoading,
      chartConfig,
      libsNames: computed(() =>
        filteredLibsRef.value.map((lib) => lib.devUsage.name)
      ),
      ariaLabel: computed(() => {
        const str = filteredLibsRef.value
          .map(
            (lib) =>
              `${lib.alias} is used by ${
                lib.devUsage.usage.slice(-1)[0].value
              }% of developers.`
          )
          .join(' ');
        return `Developer Usage statistics according to StateOfJS survey. ${str}`;
      }),
    };
  },
});
</script>
