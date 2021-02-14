<template>
  <DeveloperUsageChart
    v-if="filteredReposIds.length"
    :is-loading="isLoading"
    :repos-usage="reposUsage"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import { chartsVisibility } from '@/store/chartsVisibility';
import { libraryToColorMap } from '@/store/librariesColors';
import DeveloperUsageChart from './DeveloperUsageChart.vue';
import { repoIdToDataMap } from './stateof-js-css-data';
import { isLoading, reposIds, repoToLibraryIdMap } from '@/store/libraries';

export default defineComponent({
  name: 'DevelopersUsage',

  components: { DeveloperUsageChart },

  setup() {
    const filteredReposIds = computed(() =>
      reposIds.value.filter((repoId) => !!repoIdToDataMap[repoId])
    );
    const reposUsage = computed(() =>
      filteredReposIds.value.map((repoId) => repoIdToDataMap[repoId])
    );

    watchEffect(() => {
      chartsVisibility.developerUsage = filteredReposIds.value.length > 0;
    });

    return {
      isLoading,
      filteredReposIds,
      reposUsage,
      repoToColorMap: computed(() =>
        filteredReposIds.value.reduce((acc, repoId) => {
          acc[repoId] =
            libraryToColorMap.value[repoToLibraryIdMap.value[repoId]];
          return acc;
        }, {} as Record<string, string>)
      ),
    };
  },
});
</script>
