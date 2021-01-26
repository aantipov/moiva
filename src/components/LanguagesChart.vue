<template>
  <m-chart
    title="Languages,"
    subtitle="%"
    :is-loading="isLoading || isLoadingLibsData"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :failed-libs-names="failedReposNames"
    :chart-config="chartConfig"
  >
    <p>
      This chart shows distribution of languages used in libraries' repostories.
    </p>
    <p>
      Calculation is based on the number of bytes of code written in each
      language.
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
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
    reposNames: { type: Array as () => string[], required: true },
  },

  setup(props) {
    const {
      libsNames,
      reposNames,
      libsLanguages,
      isLoadingLibsData,
      isLoading,
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

    const filteredReposNames = computed(() =>
      reposNames.value.filter(
        (repoName, repoIndex) => !!libsLanguages.value[repoIndex]
      )
    );

    const failedReposNames = computed(() =>
      reposNames.value.filter(
        (repoName, repoIndex) =>
          !isLoadingLibsData.value &&
          !isLoading.value &&
          !libsLanguages.value[repoIndex]
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

    const chartConfig = computed<Chart.ChartConfiguration>(() => ({
      type: 'bar',
      data: {
        labels: filteredReposNames.value,
        datasets: datasets.value,
      },
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                precision: 0,
                callback: (val: number): string => val + '%',
              },
            },
          ],
        },
      },
    }));

    return {
      failedReposNames,
      filteredLibsNames,
      chartConfig,
    };
  },
});
</script>
