<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Languages, %</h2>

      <m-chart-info class="ml-2">
        <p>
          This chart shows distribution of languages used in libraries'
          repostories.
        </p>
        <p>
          Calculation is based on the number of bytes of code written in each
          language.
        </p>
      </m-chart-info>
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else-if="isLoading" class="text-center p">Loading...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="languages"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { getLangToColorMap } from '../colors';

export default defineComponent({
  name: 'LanguagesChart',

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
    libsLanguagesShares: {
      type: Array as () => null | Record<string, number>[],
      required: false,
      default: null,
    },
    languagesNames: {
      type: Array as () => null | string[],
      required: false,
      default: null,
    },
  },

  setup(props) {
    const {
      libsNames,
      isLoading,
      isError,
      libsLanguagesShares,
      languagesNames,
    } = toRefs(props);
    const langToColorMap = computed<Record<string, string>>(() =>
      getLangToColorMap(languagesNames.value || [])
    );

    const datasets = computed<ChartDataSets[]>(
      () =>
        (languagesNames.value || []).map((langName) => ({
          label: langName,
          data: (libsNames.value || []).map(
            (libName, libIndex) =>
              // @ts-ignore
              libsLanguagesShares.value[libIndex][langName] || 0
          ),
          backgroundColor: langToColorMap.value[langName],
          borderColor: langToColorMap.value[langName],
          borderWidth: 1,
        })) as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('languages') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: libsNames.value,
          datasets: datasets.value,
        },

        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libsNames, languagesNames, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = libsNames.value;
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {};
  },
});
</script>
