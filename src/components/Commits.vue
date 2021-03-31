<template>
  <CommitsChart
    :is-loading="isLoading"
    :is-error="isError"
    :repos-ids="successItemsIds"
    :failed-repos-ids="failedItemsIds"
    :repos-commits="aggregatedNormalisedCommits"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import CommitsChart from './CommitsChart.vue';
import { fetchRepoCommits, CommitsResponseItemT } from '@/apis';
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  reposIds,
  repoToLibraryIdMap,
} from '@/store/libraries';

export default defineComponent({
  name: 'Commits',

  components: { CommitsChart },

  setup() {
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi<CommitsResponseItemT[]>(
      reposIds,
      isLoadingLibraries,
      fetchRepoCommits
    );

    const aggregatedNormalisedCommits = computed(() => {
      return getAggregatedCommits(getNormalisedData(items.value));
    });

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      aggregatedNormalisedCommits,
      failedItemsIds,
      successItemsIds,
      repoToColorMap: computed(() =>
        successItemsIds.value.reduce((acc, repoId) => {
          acc[repoId] =
            libraryToColorMap.value[repoToLibraryIdMap.value[repoId]];
          return acc;
        }, {} as Record<string, string>)
      ),
    };
  },
});

/**
 * Make sure commits of all the libs
 * start with the same week
 * and end with the same week
 */
function getNormalisedData(
  libsCommits: (CommitsResponseItemT[] | null)[]
): (CommitsResponseItemT[] | null)[] {
  if (!libsCommits.filter((libsCommits) => !!libsCommits).length) {
    return libsCommits;
  }
  // Find the latest start
  const startWeeks = libsCommits
    .filter((libCommits) => !!libCommits)
    .map((libCommits) => (libCommits as CommitsResponseItemT[])[0].week);
  const endWeeks = libsCommits
    .filter((libCommits) => !!libCommits)
    .map(
      (libCommits) => (libCommits as CommitsResponseItemT[]).slice(-1)[0].week
    );
  const maxStartWeek = Math.max(...startWeeks);
  const minEndWeek = Math.min(...endWeeks);
  const normalisedCommits = libsCommits.map((libCommits) => {
    if (!libCommits) {
      return null;
    }

    const startIndex = libCommits.findIndex(
      (commit) => commit.week === maxStartWeek
    );
    const endIndex = libCommits.findIndex(
      (commit) => commit.week === minEndWeek
    );
    return libCommits.slice(startIndex, endIndex);
  });

  return normalisedCommits;
}

/**
 * Aggregate libs commits by 4 weeks
 */
function getAggregatedCommits(libsCommits: (CommitsResponseItemT[] | null)[]) {
  const aggregatedCommits = libsCommits.map((libCommits) => {
    if (!libCommits) {
      return null;
    }
    return libCommits
      .map((item) => ({
        ...item,
        week: item.week * 1000,
      }))
      .reduce((acc, item, i) => {
        if (i % 4 === 0) {
          acc.push(item);
        } else {
          acc[acc.length - 1].total += item.total;
          acc[acc.length - 1].week = item.week;
        }

        return acc;
      }, [] as CommitsResponseItemT[]);
  });

  return aggregatedCommits;
}
</script>
