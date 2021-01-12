<template>
  <div>
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
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else-if="isLoading" class="text-center p">Loading...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="commits"></canvas>
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
      type: Array as () => GithubCommitsResponseItemT[][],
      required: false,
      default: null,
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
    const datasets = computed<ChartDataSets[]>(
      () =>
        (libsNames.value.map((libName, key) => ({
          label: libName,
          fill: false,
          data: libsCommits.value
            ? libsCommits.value[key].map(({ total, week }) => ({
                x: week,
                y: total,
              }))
            : [],
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
