<template>
  <m-chart
    title="Languages,"
    subtitle="%"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Distribution of languages per repostory.</p>
    <p>
      Calculation is based on the number of bytes of code written in each
      language.
    </p>
    <p>Data source: <a href="https://github.com/" target="_blank">GitHub</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { getLangToColorMap } from '@/colors';
import { getSeoLibName } from '@/utils';
import { GithubLanguagesResponseT } from '@/apis';

export default defineComponent({
  name: 'LanguagesChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    reposIds: { type: Array as () => string[], required: true },
    failedReposIds: { type: Array as () => string[], required: true },
    reposLanguages: {
      type: Array as () => GithubLanguagesResponseT[],
      required: true,
    },
  },

  setup(props) {
    const { reposIds, reposLanguages } = toRefs(props);

    // Compute languages shares, counting only those which has >=10% share
    const libsLanguagesShares = computed<null | Record<string, number>[]>(
      () => {
        return reposLanguages.value.map((repoLanguages) => {
          const libBytesTotal = Object.values(repoLanguages).reduce(
            (a, b) => a + b,
            0
          );

          const libLanguagesSharesWithoutOthers = Object.entries(repoLanguages)
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
          data: (reposLanguages.value || []).map(
            (_, repoIndex) =>
              (libsLanguagesShares.value || [])[repoIndex][langName] || 0
          ),
          backgroundColor: langToColorMap.value[langName],
          borderColor: langToColorMap.value[langName],
          borderWidth: 1,
        })) as ChartDataSets[]
    );

    const chartConfig = computed<Chart.ChartConfiguration>(() => ({
      type: 'bar',
      data: {
        labels: reposIds.value.map((repoId) => {
          const [, name] = repoId.split('/');
          return name;
        }),
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
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = reposIds.value
          .map(
            (repoId, index) =>
              `${getSeoLibName(repoId)}: ${Object.keys(
                reposLanguages.value[index]
              ).join(', ')}.`
          )
          .join(' ');

        return `Languages chart. Programming languages used in the repository. ${valuesStr}`;
      }),
    };
  },
});
</script>
