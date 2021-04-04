<template>
  <StarsChart
    :is-loading="isLoading"
    :is-error="isError"
    :repos-ids="successItemsIds"
    :failed-repos-ids="failedItemsIds"
    :repos-stars="items"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import StarsChart from './StarsChart.vue';
import { fetchRepoStars, StarsT } from './api';
import { getEarliestMonth, getPrevMonth } from '@/utils';
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  reposIds,
  repoIdToRepoMap,
  repoToLibraryIdMap,
} from '@/store/libraries';

export default defineComponent({
  name: 'Stars',

  components: { StarsChart },

  setup() {
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi<StarsT[]>(reposIds, isLoadingLibraries, fetchRepoStars);

    // Calculate startMonth based on repos creation date
    const startMonth = computed(() => {
      const defaultValue = '2020-01';

      if (!successItemsIds.value.length) {
        return defaultValue;
      }

      const creationDates = successItemsIds.value.map(
        (repoId) => repoIdToRepoMap.value[repoId].createdAt
      );

      return getPrevMonth(getEarliestMonth(creationDates, defaultValue));
    });

    // Filter out data earlier startMonth
    const filteredItems = computed(() =>
      items.value.map((repoStars) =>
        repoStars.filter(({ month }) => month >= startMonth.value)
      )
    );

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      items: filteredItems,
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
</script>
