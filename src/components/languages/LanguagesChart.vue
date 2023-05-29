<template>
  <ChartPresentation
    title="Languages, %"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="reposIds"
    :failed-libs-names="failedReposIds"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div>Languages distribution per repostory.</div>
      <div>
        Calculation based on number of bytes of code written in each language.
      </div>
      <div class="flex justify-center">
        Data source:
        <ExternalLink class="mx-1" href="https://github.com/" txt="GitHub" />
      </div>
    </template>
  </ChartPresentation>
</template>

<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import { computed } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { getLangToColorMap } from '@/colors';
import { LanguagesT } from './api';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  languages: LanguagesT;
}
interface FilteredExtLibT extends LibraryReadonlyT {
  languages: LanguagesT;
  languagesShares: Record<string, number>;
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.languages) as FilteredLibT[]
);

// Compute languages shares, counting only those which has >=10% share
const filteredExtLibsRef = computed(() =>
  filteredLibsRef.value.map((lib) => {
    const bytesTotal = Object.values(lib.languages).reduce((a, b) => a + b, 0);

    const mainLanguagesShares = Object.entries(lib.languages)
      .map(([lang, langBytes]) => ({
        lang,
        langShare: (100 * langBytes) / bytesTotal,
      }))
      .filter(({ langShare }) => langShare >= 10)
      .reduce((acc, { lang, langShare }) => {
        acc[lang] = Number.parseFloat(Number(langShare).toFixed(1));
        return acc;
      }, {} as Record<string, number>);

    const othersShare =
      100 - Object.values(mainLanguagesShares).reduce((a, b) => a + b, 0);

    const languagesShares = {
      ...mainLanguagesShares,
      Others: Number.parseFloat(Number(othersShare).toFixed(1)),
    };

    return { ...lib, languagesShares } as FilteredExtLibT;
  })
);

// Compute languages names that has share >=10%
// and sort them
const languagesNames = computed<string[]>(() => {
  const languagesNamesWithDupes = filteredExtLibsRef.value
    .map((lib) => Object.keys(lib.languagesShares))
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
  getLangToColorMap(languagesNames.value)
);

const chartConfig = computed<ChartConfiguration<'bar'>>(() => ({
  type: 'bar',
  data: {
    labels: filteredLibsRef.value.map((lib) => lib.repo.repoId),
    datasets: (languagesNames.value || []).map((langName) => ({
      label: langName,
      data: filteredExtLibsRef.value.map(
        (lib) => lib.languagesShares[langName] || 0
      ),
      backgroundColor: langToColorMap.value[langName],
      borderColor: langToColorMap.value[langName],
      borderWidth: 1,
    })),
  },

  options: {
    scales: {
      x: { stacked: true },
      y: {
        max: 100,
        stacked: true,
        ticks: {
          beginAtZero: true,
          precision: 0,
          callback: (val) => val + '%',
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: (context): string => {
            return ` ${context.dataset.label}: ${context.formattedValue}%`;
          },
        },
      },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    librariesRR.filter((lib) => lib.languages === undefined).length > 0
);

const isError = computed(() => filteredLibsRef.value.length === 0);

const reposIds = computed(() =>
  filteredLibsRef.value.map((lib) => lib.repo.repoId)
);

const failedReposIds = computed<string[]>(() => {
  return isLoadingRef.value
    ? []
    : librariesRR.filter((lib) => !lib.languages).map((lib) => lib.repo.repoId);
});

const ariaLabel = computed(() => {
  const str = filteredExtLibsRef.value
    .map(
      (lib) =>
        `The following programming languages are used in ${
          lib.alias
        } repository: ${Object.entries(lib.languagesShares)
          .map(([lang, share]) => `${lang} ${share}%`)
          .join(', ')}.`
    )
    .join(' ');

  return `Repository Languages statistics. ${str}`;
});
</script>
