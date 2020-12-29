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
import { GithubLanguagesResponseT } from '../../api/gh-languages';
import { COLOR_GRAY } from '../colors';

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
    libs: {
      type: Array as () => string[],
      required: true,
    },
    languages: {
      type: Array as () => null | GithubLanguagesResponseT[],
      required: false,
      default: null,
    },
  },

  setup(props) {
    const { libs, languages, isLoading, isError } = toRefs(props);
    const languagesNames = ['JavaScript', 'TypeScript', 'Other'];
    const languageColors = ['#F7E018', '#3178C6', COLOR_GRAY];
    const languageBordersColors = ['#FCD34D', '#3178C6', COLOR_GRAY];
    const libsLanguagesDistributions = computed(() =>
      libs.value.map((lib, i) => {
        if (languages.value === null) {
          return languagesNames.map(() => 0);
        }

        const bytesTotal = Object.values(languages.value[i]).reduce(
          (a, b) => a + b,
          0
        );
        const distrsByLang = languagesNames.map((langName) => {
          const distrsByLang =
            (100 * ((languages.value && languages.value[i][langName]) || 0)) /
            bytesTotal;

          return Number.parseFloat(Number(distrsByLang).toFixed(1));
        });

        // Correct value for Other category
        const allButLastTotal = distrsByLang
          .slice(0, -1)
          .reduce((a, b) => a + b, 0);

        distrsByLang[distrsByLang.length - 1] = 100 - allButLastTotal;

        return distrsByLang;
      })
    );
    const datasets = computed<ChartDataSets[]>(
      () =>
        (languagesNames.map((lang, langIndex) => ({
          label: lang,
          data: libs.value
            ? libs.value.map(
                (libName, libIndex) =>
                  libsLanguagesDistributions.value[libIndex][langIndex]
              )
            : [],
          backgroundColor: languageColors[langIndex],
          borderColor: languageBordersColors[langIndex],
          borderWidth: 1,
        })) as unknown) as ChartDataSets[]
    );
    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('languages') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: libs.value,
          datasets: datasets.value,
        },

        options: {
          scales: {
            xAxes: [
              {
                stacked: true,
              },
            ],
            yAxes: [
              {
                stacked: true,
              },
            ],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libs, languages, isLoading, isError], () => {
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
