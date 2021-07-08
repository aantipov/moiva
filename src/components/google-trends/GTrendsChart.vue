<template>
  <m-chart
    v-if="isDisplayed"
    title="Google Search Interest"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsKeywordsAliases"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
    :since="since"
    :since-values="sinceValues"
    @sinceChange="onSinceChange"
  >
    <p>Google Search Interest Over Time.</p>
    <p>
      Data are provided for popular libraries only. The list is manually
      curated.
    </p>
    <p>
      Feel free to submit a
      <a href="https://github.com/aantipov/moiva" target="_blank" rel="noopener"
        >request</a
      >
      to add a library.
    </p>
    <p>Data source: <a :href="gTrendsLink" target="_blank">Google Trends</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect, ref } from 'vue';
import { ChartConfiguration } from 'chart.js';
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
import { chartsVisibility } from '@/store/chartsVisibility';

interface FilteredLibT extends LibraryReadonlyT {
  googleTrendsDef: GTrendDefT;
  googleTrends: LibGTrendsT;
}

export default defineComponent({
  name: 'GTrendsChart',

  setup() {
    watchEffect(() => {
      chartsVisibility.googleTrends =
        librariesRR.filter((lib) => !!lib.googleTrendsDef).length > 0;
    });

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
    const selectedSinceRef = ref<string | null>(null);
    const sinceRef = computed<string>(
      () => selectedSinceRef.value || minMonthRef.value
    );

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
              unit: sinceRef.value > '2019-10' ? 'month' : 'year',
              tooltipFormat: 'MMM, yyyy',
            },
            min: sinceRef.value as unknown as number,
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

    return {
      isDisplayed: computed(() => chartsVisibility.googleTrends),
      isLoading: isLoadingRef,
      isError: computed(() => filteredLibsRef.value.length === 0),
      filteredLibsRef,
      chartConfig,
      libsKeywordsAliases: computed<string[]>(() =>
        filteredLibsRef.value.map((lib) => lib.googleTrendsDef.alias)
      ),
      gTrendsLink: computed<string>(() => {
        const keywords = filteredLibsRef.value.map(
          (lib) => lib.googleTrendsDef.keyword
        );
        // TODO: fix
        const datesQueryParam = encodeURIComponent('2017-01-01 2021-01-11');
        const libsQueryParam = encodeURIComponent(keywords.join(','));

        return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
      }),
      ariaLabel: computed(() => {
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
      }),
      since: sinceRef,
      sinceValues: computed<string[]>(() => getDateRanges(minMonthRef.value)),
      onSinceChange(since: string) {
        selectedSinceRef.value = since;
      },
    };
  },
});
</script>
