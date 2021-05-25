<template>
  <BundlephobiaChart
    v-if="isChartDisplayed"
    :is-loading="isLoading"
    :is-error="isError"
    :packages-names="successItemsIds"
    :failed-packages-names="failedItemsIds"
    :packages-sizes="items"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect, toRefs } from 'vue';
import BundlephobiaChart from './BundlephobiaChart.vue';
import { fetchBundlephobiaData, BundlephobiaT } from './api';
import { chartsVisibility } from '@/store/chartsVisibility';
import whitelistedCategories from './whitelist.json';
import { useChartApi } from '@/composables/useChartApi';
import {
  isLoading as isLoadingLibraries,
  npmPackagesNames,
} from '@/store/libraries';

export default defineComponent({
  name: 'Bundlephobia',

  components: { BundlephobiaChart },

  props: {
    category: {
      type: String as () => string | null,
      required: true,
    },
  },

  setup(props) {
    const { category } = toRefs(props);
    const isChartDisplayed = computed(
      () =>
        npmPackagesNames.value.length > 0 &&
        (!category.value || whitelistedCategories.includes(category.value))
    );
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi<BundlephobiaT>(
      npmPackagesNames,
      computed(() => isLoadingLibraries.value || !isChartDisplayed.value),
      fetchBundlephobiaData
    );

    watchEffect(() => {
      chartsVisibility.bundlephobia = isChartDisplayed.value;
    });

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      items,
      failedItemsIds,
      successItemsIds,
      isChartDisplayed,
    };
  },
});
</script>

<style lang="postcss">
.chart {
  height: 350px;
}
</style>
