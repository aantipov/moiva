<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Vulnerabilities</h2>

      <m-chart-info class="ml-2">
        <p>Both open and closed vulnerabilities are included.</p>
        <p>
          <a
            href="https://github.com/advisories?query=ecosystem%3Anpm"
            target="_blank"
            >Github</a
          >
          data is used to build the chart.
        </p>
        <p>
          Another good resource to check for vulnerabilities is
          <a href="https://snyk.io/vuln/?type=npm" target="_blank">Snyk</a>
        </p>
      </m-chart-info>
    </div>

    <div v-if="isLoading" class="text-center p">Loading...</div>

    <div v-else-if="isError" class="text-center p">Something went wrong...</div>

    <div v-show="!isLoading && !isError" style="height: 350px">
      <canvas id="vulnerabilities"></canvas>
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
  name: 'GithubVulnerabilities',

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
            label: 'vulnerabilities',
            data: repos.value.map((repo) => repo.vulnerabilitiesCount),
            backgroundColor: COLOR_GRAY,
            borderWidth: 1,
          },
        ] as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById(
        'vulnerabilities'
      ) as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: libs.value,
          datasets: datasets.value,
        },

        options: {
          title: { display: false, text: 'Vulnerabilities (open + closed)' },
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
