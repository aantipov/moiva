<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Commits per ~month</h2>

      <m-chart-info class="ml-2">
        <p>Moiva uses commits data from GitHub.</p>
        <p>The number of commits is aggregated by the 4 weeks interval.</p>
        <p>
          Only commits to the default repository branch are included. Merge
          commits are excluded.
        </p>
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

    <div class="relative" style="height: 350px">
      <m-loader v-if="isLoading || isLoadingLibsData" />

      <div v-else-if="isError || !filteredLibsNames.length" class="chart-error">
        Sorry we couldn't load the data. Try to reload the page or come later
      </div>

      <canvas
        v-show="!isError && filteredLibsNames.length"
        id="commits"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { GithubCommitsResponseItemT } from '../../api/gh-commits';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'CommitsChart',

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
    libsCommits: {
      type: Array as () => (GithubCommitsResponseItemT[] | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libsCommits,
      libToColorMap,
      isLoading,
      isError,
    } = toRefs(props);

    const filteredLibsCommits = computed<GithubCommitsResponseItemT[][]>(() => {
      return libsCommits.value.filter(
        (libCommits) => !!libCommits
      ) as GithubCommitsResponseItemT[][];
    });

    const filteredLibsNames = computed(() => {
      return libsNames.value.filter(
        (libName, libIndex) => !!libsCommits.value[libIndex]
      );
    });

    const failedLibsNames = computed(() => {
      return libsNames.value.filter(
        (libName, libIndex) => !isLoading.value && !libsCommits.value[libIndex]
      );
    });

    const datasets = computed<ChartDataSets[]>(
      () =>
        (filteredLibsNames.value.map((libName, key) => ({
          label: libName,
          fill: false,
          data: filteredLibsCommits.value[key].map(({ total, week }) => ({
            x: week,
            y: total,
          })),
          backgroundColor: libToColorMap.value[libName],
          borderColor: libToColorMap.value[libName],
          borderWidth: 4,
          pointRadius: 3,
          pointHoverRadius: 7,
        })) as unknown) as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('commits') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets.value },

        options: {
          scales: {
            adapters: { date: { locale: enUS } },
            xAxes: [
              {
                type: 'time',
                time: { tooltipFormat: 'PP' },
              },
            ],
            yAxes: [{}],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libsCommits, isLoading, isError], () => {
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
