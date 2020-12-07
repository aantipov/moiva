<template>
  <div>
    <h2>Bundlephobia</h2>

    <div v-if="isError" class="text-center text-red-700">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="chart">
      <div v-if="isLoading" class="text-center p">Loading...</div>
      <BundlephobiaChart v-else :libs="libs" :sizes="sizes" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BundlephobiaChart from './BundlephobiaChart.vue';
import { fetchBundlephobiaData, BundlephobiaT } from '../apis';

export default Vue.extend({
  name: 'Bundlephobia',

  components: {
    BundlephobiaChart,
  },

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      sizes: [] as Array<Array<BundlephobiaT>>,
      sizesPromise: null as null | Promise<unknown>,
    };
  },

  watch: {
    libs(): void {
      this.loadData();
    },
  },

  mounted(): void {
    this.loadData();
  },

  methods: {
    loadData(): void {
      this.isLoading = true;
      this.isError = false;

      const promise = (this.sizesPromise = Promise.all(
        this.libs.map((lib) => fetchBundlephobiaData(lib))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (this.sizesPromise === promise) {
            this.sizes = data;
            this.isError = false;
            this.isLoading = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (this.sizesPromise === promise) {
            this.isError = true;
            this.isLoading = false;
          }
        }));
    },
  },
});
</script>

<style scoped lang="scss">
.chart {
  height: 500px;
}
</style>
