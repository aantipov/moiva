<template>
  <m-chart
    title="Google Search Interest"
    :is-loading="isLoadingRef"
    :is-error="isError"
    :libs-names="libsKeywordsAliases"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <template #footer>
      <div class="relative mb-3 flex justify-center">
        <select
          v-model="selectedSinceRef"
          name="date-range"
          class="rounded-md border border-gray-300 bg-gray-200 p-1"
        >
          <option v-for="val in sinceValues" :key="val" :value="val">
            since {{ val }}
          </option>
        </select>
      </div>

      <div class="flex justify-center">
        Data source:
        <m-ext-link class="mx-1" :href="gTrendsLink" txt="Google Trends" />
      </div>
    </template>
  </m-chart>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { GTrendDefT, GOOGLE_TRENDS_LIBS_LIMIT } from '@/data/index';
import { numbersFormatter, getDateRanges } from '@/utils';
import { LibGTrendsT } from './api';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  googleTrendsDef: GTrendDefT;
  googleTrends: LibGTrendsT;
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.googleTrends) as FilteredLibT[]
);

// Calculate startMonth based on packages creation date
const minMonthRef = computed(() => {
  if (filteredLibsRef.value.length) {
    const date = new Date(
      1000 * Number(filteredLibsRef.value[0].googleTrends.timeline[0].time)
    );
    return format(date, 'yyyy-MM');
  }

  return '2017-01';
});

const selectedSinceRef = ref<string>(minMonthRef.value);
const sinceValues = computed<string[]>(() => getDateRanges(minMonthRef.value));
watch(sinceValues, () => {
  selectedSinceRef.value = sinceValues.value[0];
});

// Have "datasets" separate for better animation when changing "since" date
const datasets = computed<ChartDataset<'line'>[]>(() =>
  filteredLibsRef.value.map((lib) => ({
    label: lib.googleTrendsDef.alias,
    data: lib.googleTrends.timeline.map((tl) => tl.value),
    backgroundColor: lib.color,
    borderColor: lib.color,
    pointRadius: 0,
  }))
);

const chartConfig = computed<ChartConfiguration>(() => ({
  type: 'line',
  data: {
    labels: filteredLibsRef.value.length
      ? filteredLibsRef.value[0].googleTrends.timeline.map(
          (tl) => Number(tl.time) * 1000
        )
      : [],
    datasets: datasets.value,
  },
  options: {
    elements: { line: { tension: 0.1 } },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: selectedSinceRef.value > '2019-10' ? 'month' : 'year',
          tooltipFormat: 'MMM, yyyy',
        },
        min: selectedSinceRef.value as unknown as number,
        adapters: { date: { locale: enUS } },
      },
      y: { ticks: { callback: numbersFormatter.format as () => string } },
    },
  },
}));

const isLoadingRef = computed(
  () =>
    isLoadingLibraries.value ||
    (librariesRR.filter(
      (lib) => !!lib.googleTrendsDef && lib.googleTrends === undefined
    ).length > 0 &&
      librariesRR.filter((lib) => !!lib.googleTrends).length <
        GOOGLE_TRENDS_LIBS_LIMIT)
);

const isError = computed(() => filteredLibsRef.value.length === 0);

const libsKeywordsAliases = computed<string[]>(() =>
  filteredLibsRef.value.map((lib) => lib.googleTrendsDef.alias)
);

const gTrendsLink = computed<string>(() => {
  const keywords = filteredLibsRef.value.map(
    (lib) => lib.googleTrendsDef.keyword
  );
  const datesQueryParam = encodeURIComponent(
    '2017-01-01 ' + format(new Date(), 'yyyy-MM-dd')
  );
  const libsQueryParam = encodeURIComponent(keywords.join(','));

  return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
});

const ariaLabel = computed(() => {
  if (filteredLibsRef.value.length === 1) {
    return `Google Search Interest statistics for ${filteredLibsRef.value[0].alias}`;
  }
  if (filteredLibsRef.value.length > 1) {
    const prefix = `Google Search Interest statistics. The average relative values - `;
    const averages = filteredLibsRef.value.map((lib) => {
      return `${lib.googleTrendsDef.alias}: ${lib.googleTrends.average}%`;
    });
    return `${prefix}${averages.join(', ')}`;
  }
  return '';
});
</script>
