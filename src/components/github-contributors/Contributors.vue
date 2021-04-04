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
import {
  getEarliestMonth,
  getQuarterMonthFromDate,
  getPreviousQuater,
} from '@/utils';
import ContributorsChart from './ContributorsChart.vue';
import { fetchContributors, ContributorsT } from './api';
import useChartApi from '@/composables/useChartApi';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  isLoading as isLoadingLibraries,
  reposIds,
  repoIdToRepoMap,
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
    } = useChartApi<ContributorsT[]>(
      reposIds,
      isLoadingLibraries,
      fetchContributors
    );

    // Calculate startQuater based on packages creation date
    const startQuater = computed(() => {
      const defaultValue = '2017-01';

      if (!successItemsIds.value.length) {
        return defaultValue;
      }

      const creationQuarters = successItemsIds.value.map((repoId) =>
        getPreviousQuater(
          getQuarterMonthFromDate(repoIdToRepoMap.value[repoId].createdAt)
        )
      ) as string[];

      return getEarliestMonth(creationQuarters, defaultValue);
    });

    // Filter out data earlier startQuater
    const filteredItems = computed(() =>
      items.value.map((repoItems) =>
        repoItems.filter(({ month }) => month >= startQuater.value)
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
