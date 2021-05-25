<template>
  <GTrendsChart />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, computed } from 'vue';
import { repoToGTrendDefMap } from '@/google-trends.config';
import GTrendsChart from './GTrendsChart.vue';
import { fetchGTrendsData } from './api';
import { reposIds, isLoading as isLoadingLibraries } from '@/store/libraries';

export default defineComponent({
  name: 'GoogleTrends',

  components: { GTrendsChart },

  setup() {
    // We need to compare only those libs for which Google trends
    // has sensible data
    // Google Trends allows to compare only 5 terms at max
    const filteredReposIds = computed<string[]>(() =>
      reposIds.value
        .filter((repoId) => !!repoToGTrendDefMap[repoId])
        .slice(0, 5)
    );

    function loadData(): void {
      if (!filteredReposIds.value.length) {
        return;
      }

      fetchGTrendsData(filteredReposIds.value);
    }

    onMounted(() => {
      if (!isLoadingLibraries.value) {
        // Google Trends api loads all the libs at once
        // hence, we need to wait until we have all the libs at place
        // otherwise Google bans the requests and fails them (thinks it's from a robot)
        loadData();
      }
    });

    watch([reposIds, isLoadingLibraries], () => {
      if (!isLoadingLibraries.value) {
        // Google Trends api loads all the libs at once
        // hence, we need to wait until we have all the libs at place
        // otherwise Google bans the requests and fails them (thinks it's from a robot)
        loadData();
      }
    });

    return {};
  },
});
</script>
