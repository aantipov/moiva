<template>
  <div>
    <h2>Github Stars</h2>

    <div v-if="isLoading" class="text-center p">Loading...</div>

    <div v-else-if="isError" class="text-center p">Something went wrong...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="starsCount"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, toRefs, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { RepoT } from '../apis';
import { numbersFormatter } from '../utils';
import { COLOR_GRAY } from '../colors';

export default defineComponent({
  name: 'GithubStars',

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
    repos: {
      type: Array as () => RepoT[],
      required: true,
    },
  },

  setup(props) {
    const { libs, repos, isLoading, isError } = toRefs(props);
    const datasets = computed<ChartDataSets[]>(
      () =>
        [
          {
            label: 'stars',
            data: repos.value.map((repo) => repo.stars),
            backgroundColor: COLOR_GRAY,
            borderWidth: 1,
          },
        ] as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('starsCount') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: libs.value,
          datasets: datasets.value,
        },

        options: {
          title: { display: false, text: 'Dependencies' },
          legend: { display: false },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  // @ts-ignore
                  precision: 0,
                  callback: (val: number): string =>
                    numbersFormatter.format(val),
                },
              },
            ],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libs, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = libs.value;
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {};
  },
});
</script>
