<template>
  <ContributorsChart
    :is-loading="isLoading"
    :is-error="isError"
    :repos-ids="successItemsIds"
    :failed-repos-ids="failedItemsIds"
    :repos-contributors="items"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ContributorsChart from './ContributorsChart.vue';
import { fetchContributors, YearContributorsT } from '@/apis';
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  reposIds,
  repoToLibraryIdMap,
} from '@/store/libraries';

export default defineComponent({
  name: 'Contributors',

  components: { ContributorsChart },

  setup() {
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi<YearContributorsT[]>(
      reposIds,
      isLoadingLibraries,
      fetchContributors
    );

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
