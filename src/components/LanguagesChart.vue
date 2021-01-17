<template>
  <div>
    <!-- Header -->
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

      <m-chart-info v-if="failedLibsNames.length" class="ml-2" type="WARNING">
        <div>
          Sorry, we couldn't fetch data for the following packages:
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
        id="languages"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { getLangToColorMap } from '@/colors';
import { GithubLanguagesResponseT } from '../../api/gh-languages';

export default defineComponent({
  name: 'LanguagesChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libsLanguages: {
      type: Array as () => (GithubLanguagesResponseT | null)[],
      required: true,
    },
  },

  setup(props) {
    const {
      libsNames,
      libsLanguages,
      isLoadingLibsData,
      isLoading,
      isError,
    } = toRefs(props);

    const filteredLibsLanguages = computed<GithubLanguagesResponseT[]>(
      () =>
        libsLanguages.value.filter(
          (libsLanguages) => !!libsLanguages
        ) as GithubLanguagesResponseT[]
    );

    const filteredLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsLanguages.value[libIndex]
      )
    );

    const failedLibsNames = computed(() =>
      libsNames.value.filter(
        (libName, libIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsLanguages.value[libIndex]
      )
    );

    // Compute languages shares, counting only those which has >=10% share
    const libsLanguagesShares = computed<null | Record<string, number>[]>(
      () => {
        return filteredLibsLanguages.value.map((libLangs) => {
          const libBytesTotal = Object.values(libLangs).reduce(
            (a, b) => a + b,
            0
          );

          const libLanguagesSharesWithoutOthers = Object.entries(libLangs)
            .map(([lang, langBytes]) => ({
              lang,
              langShare: (100 * langBytes) / libBytesTotal,
            }))
            .filter(({ langShare }) => langShare >= 10)
            .reduce((acc, { lang, langShare }) => {
              acc[lang] = Number.parseFloat(Number(langShare).toFixed(1));
              return acc;
            }, {} as Record<string, number>);

          const othersShare =
            100 -
            Object.values(libLanguagesSharesWithoutOthers).reduce(
              (a, b) => a + b,
              0
            );

          const libLanguagesShares = {
            ...libLanguagesSharesWithoutOthers,
            Others: Number.parseFloat(Number(othersShare).toFixed(1)),
          };

          return (libLanguagesShares as unknown) as Record<string, number>;
        });
      }
    );

    // Compute langauges names that has share >=10%
    // and sort them
    const languagesNames = computed<null | string[]>(() => {
      if (!libsLanguagesShares.value) {
        return null;
      }

      const languagesNamesWithDupes = libsLanguagesShares.value
        .map((libLangsShares) => Object.keys(libLangsShares))
        .flat();

      // Deduplicate languages
      const items = [...new Set(languagesNamesWithDupes)];

      // Sort languages so that JavaScript/TypeScript are the first ones, Others is the last
      const tsIndex = items.indexOf('TypeScript');
      if (tsIndex !== -1) {
        items.splice(tsIndex, 1);
        items.unshift('TypeScript');
      }

      const jsIndex = items.indexOf('JavaScript');
      if (jsIndex !== -1) {
        items.splice(jsIndex, 1);
        items.unshift('JavaScript');
      }
      const othersIndex = items.indexOf('Others');
      if (othersIndex !== -1) {
        items.splice(othersIndex, 1);
        items.push('Others');
      }

      return items;
    });

    const langToColorMap = computed<Record<string, string>>(() =>
      getLangToColorMap(languagesNames.value || [])
    );

    const datasets = computed<ChartDataSets[]>(
      () =>
        (languagesNames.value || []).map((langName) => ({
          label: langName,
          data: (filteredLibsNames.value || []).map(
            (libName, libIndex) =>
              (libsLanguagesShares.value || [])[libIndex][langName] || 0
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
          labels: filteredLibsNames.value,
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
        (mychart as Chart).data.labels = filteredLibsNames.value;
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
