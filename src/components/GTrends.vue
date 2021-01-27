<template>
  <GTrendsChart
    :is-loading="isLoading || isLoadingPackagesData"
    :is-error="isError"
    :libs-trends="libsTrends"
    :libs-keywords="filteredLibsKeywords"
    :libs-trends-defs="filteredLibsGTrendsDefs"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch, computed } from 'vue';
import { repoToGTrendDefMap } from '../../google-trends.config';
import GTrendsChart from './GTrendsChart.vue';
import { fetchGTrendsData, GTrendPointT } from '@/apis';

export default defineComponent({
  name: 'GoogleTrends',

  components: {
    GTrendsChart,
  },

  props: {
    reposIds: { type: Array as () => string[], required: true },
    repoToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    isLoadingPackagesData: { type: Boolean, required: true },
  },

  setup(props) {
    const { reposIds } = toRefs(props);
    const libsTrends = ref<GTrendPointT[]>([]);
    const isLoading = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    // We need to compare only those libs for which Google trends
    // has sensible data
    // Google Trends allows to compare only 5 terms at max
    const filteredReposIds = computed<string[]>(() =>
      reposIds.value
        .filter((repoId) => !!repoToGTrendDefMap[repoId])
        .slice(0, 5)
    );

    const filteredLibsKeywords = computed(() =>
      filteredReposIds.value.map((repoId) => repoToGTrendDefMap[repoId].keyword)
    );

    const filteredLibsGTrendsDefs = computed(() =>
      filteredReposIds.value.map((repoId) => repoToGTrendDefMap[repoId])
    );

    function loadData(): void {
      isError.value = false;

      if (!filteredReposIds.value.length) {
        isLoading.value = false;
        return;
      }

      isLoading.value = true;

      const fetchPromise = (lastFetchPromise = fetchGTrendsData(
        filteredReposIds.value
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsTrends.value = data;
            isLoading.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            isLoading.value = false;
            isError.value = true;
          }
        }));
    }

    onMounted(loadData);

    watch(reposIds, loadData);

    return {
      isLoading,
      isError,
      libsTrends,
      filteredLibsKeywords,
      filteredLibsGTrendsDefs,
    };
  },
});
</script>
