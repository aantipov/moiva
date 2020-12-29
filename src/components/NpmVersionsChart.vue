<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">
        Release frequency<span class="text-base">(per year)</span>
      </h2>

      <m-chart-info class="ml-2">
        <p>Major, minor and bugfix releases count.</p>
        <p>Pre-releases are not included.</p>
      </m-chart-info>
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else-if="isLoading" class="text-center p">Loading...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="npmVersions"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { NpmPackageVersionsT } from '../apis';
import { numbersFormatter } from '../utils';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'NpmVersionsChart',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    isError: {
      type: Boolean,
      required: true,
    },
    libs: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    versions: {
      type: Array as () => NpmPackageVersionsT[],
      required: false,
      default: null,
    },
  },

  setup(props) {
    const { libs, libToColorMap, versions, isLoading, isError } = toRefs(props);
    const datasets = computed<ChartDataSets[]>(
      () =>
        (libs.value.map((lib, key) => ({
          label: lib,
          fill: false,
          data: versions.value
            ? Object.entries(versions.value[key]).map(([year, num]) => ({
                x: year,
                y: num,
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
      const ctx = document.getElementById('npmVersions') as HTMLCanvasElement;

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

    watch([libs, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {};
  },
});
</script>
