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
import { fetchRepoCommits, CommitsResponseItemT } from './api';
import { useChartApi } from '@/composables/useChartApi';
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

    const aggregatedNormalisedCommits = computed(() =>
      getAggregatedCommits(getNormalisedData(items.value))
    );

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
  libsCommits: CommitsResponseItemT[][]
): CommitsResponseItemT[][] {
  // Find the latest start
  const startWeeks = libsCommits.map((libCommits) => libCommits[0].week);
  const endWeeks = libsCommits.map(
    (libCommits) => libCommits.slice(-1)[0].week
  );
  const maxStartWeek = Math.max(...startWeeks);
  const minEndWeek = Math.min(...endWeeks);

  // Return Normalised commits
  return libsCommits.map((libCommits) => {
    const startIndex = libCommits.findIndex(
      (commit) => commit.week === maxStartWeek
    );
    const endIndex = libCommits.findIndex(
      (commit) => commit.week === minEndWeek
    );
    return libCommits.slice(startIndex, endIndex);
  });
}

/**
 * Aggregate libs commits by 4 weeks
 */
function getAggregatedCommits(libsCommits: CommitsResponseItemT[][]) {
  return libsCommits.map((libCommits) => {
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
}
</script>
