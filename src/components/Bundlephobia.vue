<template>
  <BundlephobiaChart
    v-if="npmPackagesNames.length"
    :is-loading="isLoading"
    :is-error="isError"
    :packages-names="successItemsIds"
    :failed-packages-names="failedItemsIds"
    :packages-sizes="items"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import BundlephobiaChart from './BundlephobiaChart.vue';
import { fetchBundlephobiaData, BundlephobiaT } from '../apis';
import { chartsVisibility } from '@/store/chartsVisibility';
import useChartApi from '@/composables/useChartApi';
import {
  isLoading as isLoadingLibraries,
  npmPackagesNames,
} from '@/store/libraries';

export default defineComponent({
  name: 'Bundlephobia',

  components: { BundlephobiaChart },

  setup() {
    const {
      isLoading,
      isError,
      items,
      successItemsIds,
      failedItemsIds,
    } = useChartApi<BundlephobiaT>(
      npmPackagesNames,
      isLoadingLibraries,
      fetchBundlephobiaData
    );

    watchEffect(() => {
      chartsVisibility.bundlephobia = npmPackagesNames.value.length > 0;
    });

    return {
      isLoading: computed(() => isLoadingLibraries.value || isLoading.value),
      isError,
      npmPackagesNames, // all items
      items,
      failedItemsIds,
      successItemsIds,
    };
  },
});
</script>

<style scoped lang="scss">
.chart {
  height: 350px;
}
</style>
