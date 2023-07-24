<template>
  <ChartPresentation
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
        <ExternalLink class="mx-1" :href="gTrendsLink" txt="Google Trends" />
      </div>
    </template>
  </ChartPresentation>
</template>

<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import { computed, ref, watch } from 'vue';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { numbersFormatter, getDateRanges } from '@/utils';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends Omit<LibraryReadonlyT, 'googleTrends'> {
  readonly googleTrends: NonNullable<LibraryReadonlyT['googleTrends']>;
}
interface FilteredLibWithDataT extends Omit<FilteredLibT, 'googleTrends'> {
  readonly googleTrends: Omit<FilteredLibT['googleTrends'], 'data'> & {
    readonly data: NonNullable<FilteredLibT['googleTrends']['data']>;
  };
}

const filteredLibsRef = computed(
  () => librariesRR.filter((lib) => !!lib.googleTrends) as FilteredLibT[],
);

const filteredLibsWithDataRef = computed(
  () =>
    librariesRR.filter(
      (lib) => !!lib.googleTrends?.data,
    ) as FilteredLibWithDataT[],
);

// Calculate startMonth based on packages creation date
const minMonthRef = computed(() => {
  if (filteredLibsWithDataRef.value.length) {
    const date = new Date(
      1000 *
        Number(
          filteredLibsWithDataRef.value[0].googleTrends.data.timeline[0].time,
        ),
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
  filteredLibsWithDataRef.value.map((lib) => ({
    label: lib.googleTrends.meta.alias,
    data: lib.googleTrends.data.timeline.map((tl) => tl.value),
    backgroundColor: lib.color,
    borderColor: lib.color,
    pointRadius: 0,
  })),
);

const chartConfig = computed<ChartConfiguration>(() => ({
  type: 'line',
  data: {
    labels: filteredLibsWithDataRef.value.length
      ? filteredLibsWithDataRef.value[0].googleTrends.data.timeline.map(
          (tl) => Number(tl.time) * 1000,
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
    filteredLibsRef.value.some((lib) => lib.googleTrends.isFetching),
);

const isError = computed(() =>
  filteredLibsRef.value.some((lib) => lib.googleTrends.isError),
);

const libsKeywordsAliases = computed<string[]>(() =>
  filteredLibsWithDataRef.value.map((lib) => lib.googleTrends.meta.alias),
);

const gTrendsLink = computed<string>(() => {
  const keywords = filteredLibsRef.value.map(
    (lib) => lib.googleTrends.meta.keyword,
  );
  const datesQueryParam = encodeURIComponent(
    '2017-01-01 ' + format(new Date(), 'yyyy-MM-dd'),
  );
  const libsQueryParam = encodeURIComponent(keywords.join(','));

  return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
});

const ariaLabel = computed(() => {
  const libs = filteredLibsWithDataRef.value;
  if (libs.length === 1) {
    return `Google Search Interest statistics for ${libs[0].googleTrends.meta.alias}`;
  }
  if (libs.length > 1) {
    const prefix = `Google Search Interest statistics. The average relative values - `;
    const averages = libs.map((lib) => {
      return `${lib.googleTrends.meta.alias}: ${lib.googleTrends.data.average}%`;
    });
    return `${prefix}${averages.join(', ')}`;
  }
  return '';
});
</script>
