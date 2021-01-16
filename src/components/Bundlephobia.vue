<template>
  <BundlephobiaChart
    :is-loading-libs-data="isLoadingLibsData"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsNames"
    :libs-sizes="libsSizes"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch } from 'vue';
import BundlephobiaChart from './BundlephobiaChart.vue';
import { fetchBundlephobiaData, BundlephobiaT } from '../apis';

export default defineComponent({
  name: 'Bundlephobia',

  components: {
    BundlephobiaChart,
  },

  props: {
    libsNames: { type: Array as () => string[], required: true },
    isLoadingLibsData: { type: Boolean, required: true },
  },

  setup(props) {
    const { libsNames } = toRefs(props);
    const libsSizes = ref<(BundlephobiaT | null)[]>([]);
    const isLoading = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;

      const fetchPromise = (lastFetchPromise = Promise.all(
        libsNames.value.map(fetchBundlephobiaData)
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsSizes.value = data;
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
      libsSizes,
    };
  },
});
</script>

<style scoped lang="scss">
.chart {
  height: 350px;
}
</style>
