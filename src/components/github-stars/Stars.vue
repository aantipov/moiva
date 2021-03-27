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
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  reposIds,
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

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      items,
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
