<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Contributors per year</h2>

      <m-chart-info class="ml-2">
        <p>
          This chart shows a number of developers contributed to the repository
          per year.
        </p>
        <p>Moiva uses data from Github to build the chart.</p>
      </m-chart-info>

      <m-chart-info v-if="failedLibsNames.length" class="ml-2" type="WARNING">
        <div>
          Sorry, we couldn't fetch data from GitHub for the following packages:
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
        id="contributors"
      ></canvas>
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
    isLoadingLibsData: {
      type: Boolean,
      required: true,
    },
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
      type: Array as () => (YearContributorsT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsContributors,
      isLoadingLibsData,
      isLoading,
      isError,
    } = toRefs(props);

    const filteredLibsContributors = computed<YearContributorsT[][]>(() => {
      return libsContributors.value.filter(
        (libContributors) => !!libContributors
      ) as YearContributorsT[][];
    });

    const filteredLibsNames = computed(() => {
      return libsNames.value.filter(
        (libName, libIndex) => !!libsContributors.value[libIndex]
      );
    });

    const failedLibsNames = computed(() => {
      return libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsContributors.value[libIndex]
      );
    });

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((lib, libKey) => ({
        label: lib,
        fill: false,
        data: filteredLibsContributors.value[libKey].map(
          ({ year, contributors }) => ({
            x: year.toString(),
            y: contributors,
          })
        ),
        backgroundColor: libToColorMap.value[lib],
        borderColor: libToColorMap.value[lib],
        borderWidth: 4,
        pointRadius: 4,
        pointHoverRadius: 7,
      }))
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

    watch([libsContributors, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
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
