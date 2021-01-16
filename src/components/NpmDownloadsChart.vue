<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">NPM monthly downloads</h2>

      <m-chart-info v-if="failedLibsNames.length" class="ml-2" type="WARNING">
        <div>
          Sorry, we couldn't fetch data from NPM for the following packages:
          <div v-for="libName in failedLibsNames" :key="libName">
            - {{ libName }}
          </div>

          Try reload the page or check later.
        </div>
      </m-chart-info>
    </div>

    <!-- Chart -->
    <div class="relative" style="height: 350px">
      <m-loader v-if="isLoading || isLoadingLibsData" />

      <div
        v-else-if="isError || !filteredLibsNames.length"
        class="chart-error-new"
      >
        <div>
          Sorry we couldn't load the data. <br />
          Try reload the page or check later
        </div>
      </div>

      <canvas
        v-show="!isError && filteredLibsNames.length"
        id="npmDownloads"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { format } from 'date-fns';
import { NpmDownloadT } from '../apis';
import { numbersFormatter } from '../utils';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'NpmDownloadsChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsDownloads: {
      type: Array as () => (NpmDownloadT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsDownloads,
      isLoading,
      isLoadingLibsData,
      isError,
    } = toRefs(props);

    const filteredLibsDownloads = computed<NpmDownloadT[][]>(() => {
      return libsDownloads.value.filter(
        (libDownloads) => !!libDownloads
      ) as NpmDownloadT[][];
    });

    const filteredLibsNames = computed(() => {
      return libsNames.value.filter(
        (libName, libIndex) => !!libsDownloads.value[libIndex]
      );
    });

    const failedLibsNames = computed(() => {
      return libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsDownloads.value[libIndex]
      );
    });

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((libName, libIndex) => ({
        label: libName,
        fill: false,
        data: filteredLibsDownloads.value[libIndex].map(
          ({ downloads }) => downloads
        ),
        backgroundColor: libToColorMap.value[libName],
        borderColor: libToColorMap.value[libName],
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 7,
      }))
    );

    let mychart: Chart | undefined;

    const filteredCategories = computed<string[]>(() => {
      return filteredLibsDownloads.value.length
        ? filteredLibsDownloads.value[0].map(({ month }) => month)
        : [];
    });

    function initChart(): void {
      const ctx = document.getElementById('npmDownloads') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: filteredCategories.value,
          datasets: datasets.value,
        },

        options: {
          tooltips: {
            callbacks: {
              title: (tooltipItems): string => {
                const month = tooltipItems[0].xLabel as string;

                return format(new Date(month), 'MMM, yyyy');
              },
            },
          },
          scales: {
            adapters: { date: { locale: enUS } },
            xAxes: [{ type: 'time', time: { unit: 'year' } }],
            yAxes: [{ ticks: { callback: numbersFormatter.format } }],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libsDownloads, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = filteredCategories.value;
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {
      failedLibsNames,
      filteredLibsNames,
    };
  },
});
</script>
