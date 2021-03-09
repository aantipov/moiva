<template>
  <GTrendsChart
    v-if="gTrendsDefs.length"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-trends="libsTrends"
    :libs-trends-defs="gTrendsDefs"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  watchEffect,
  computed,
} from 'vue';
import { repoToGTrendDefMap } from '../../../google-trends.config';
import { chartsVisibility } from '@/store/chartsVisibility';
import GTrendsChart from './GTrendsChart.vue';
import { fetchGTrendsData, GTrendsResponseT } from './api';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  reposIds,
  repoToLibraryIdMap,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

export default defineComponent({
  name: 'GoogleTrends',

  components: { GTrendsChart },

  setup() {
    const libsTrends = ref<GTrendsResponseT>({
      averages: [],
      timelineData: [],
    });
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

    const gTrendsDefs = computed(() =>
      filteredReposIds.value.map((repoId) => repoToGTrendDefMap[repoId])
    );

    watchEffect(() => {
      chartsVisibility.googleTrends = gTrendsDefs.value.length > 0;
    });

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

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      libsTrends,
      gTrendsDefs,
      repoToColorMap: computed(() =>
        reposIds.value.reduce((acc, repoId) => {
          acc[repoId] =
            libraryToColorMap.value[repoToLibraryIdMap.value[repoId]];
          return acc;
        }, {} as Record<string, string>)
      ),
    };
  },
});
</script>
