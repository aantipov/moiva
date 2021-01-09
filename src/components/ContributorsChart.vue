<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Number of Contributors</h2>

      <m-chart-info class="ml-2">
        <p>
          This chart shows a number of developers contributed to the repository
          per year.
        </p>
        <p>Moiva uses data from Github to build the chart.</p>
      </m-chart-info>
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else-if="isLoading" class="text-center p">Loading...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="contributors"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { YearContributorsT } from '@/apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'ContributorsChart',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    isError: {
      type: Boolean,
      required: true,
    },
    libsNames: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsContributors: {
      type: Array as () => YearContributorsT[][],
      required: false,
      default: null,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsContributors,
      isLoading,
      isError,
    } = toRefs(props);
    const datasets = computed<ChartDataSets[]>(
      () =>
        (libsNames.value.map((lib, libKey) => ({
          label: lib,
          fill: false,
          data: libsContributors.value
            ? libsContributors.value[libKey].map(({ year, contributors }) => ({
                x: year.toString(),
                y: contributors,
              }))
            : [],
          backgroundColor: libToColorMap.value[lib],
          borderColor: libToColorMap.value[lib],
          borderWidth: 4,
          pointRadius: 4,
          pointHoverRadius: 7,
        })) as unknown) as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('contributors') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets.value },

        options: {
          scales: {
            adapters: { date: { locale: enUS } },
            xAxes: [
              {
                type: 'time',
                time: { unit: 'year' },
              },
            ],
            yAxes: [{}],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libsNames, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {};
  },
});
</script>
