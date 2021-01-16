<template>
  <GTrendsChart
    :is-loading-libs-data="isLoadingLibsData"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :lib-to-color-map="libToColorMap"
    :libs-trends="libsTrends"
    :libs-keywords="filteredLibsKeywords"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch, computed } from 'vue';
import { libsToKeywordMap } from '../../google-trends.config';
import GTrendsChart from './GTrendsChart.vue';
import { fetchGTrendsData, GTrendPointT } from '@/apis';

export default defineComponent({
  name: 'GoogleTrends',

  components: {
    GTrendsChart,
  },

  props: {
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    isLoadingLibsData: { type: Boolean, required: true },
  },

  setup(props) {
    const { libsNames } = toRefs(props);
    const libsTrends = ref<GTrendPointT[]>([]);
    const isLoading = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    // We need to compare only those libs for which Google trends
    // has sensible data
    // Google Trends allows to compare only 5 terms at max
    const filteredLibsNames = computed<string[]>(() => {
      return libsNames.value
        .filter((libName) => !!libsToKeywordMap[libName])
        .slice(0, 5);
    });

    // We need to compare only those libs for which Google trends
    // has sensible data
    // Google Trends allows to compare only 5 terms at max
    const filteredLibsKeywords = computed(() => {
      return filteredLibsNames.value.map(
        (libName) => libsToKeywordMap[libName]
      );
    });

    function loadData(): void {
      isError.value = false;

      if (!filteredLibsNames.value.length) {
        isLoading.value = false;
        return;
      }

      isLoading.value = true;

      const fetchPromise = (lastFetchPromise = fetchGTrendsData(
        filteredLibsNames.value
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

    watch(libsNames, loadData);

    return {
      isLoading,
      isError,
      libsTrends,
      filteredLibsNames,
      filteredLibsKeywords,
    };
  },
});
</script>
