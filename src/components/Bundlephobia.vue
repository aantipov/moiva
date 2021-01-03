<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Bundle size<span class="text-base">, kB</span></h2>

      <m-chart-info class="ml-2">
        <p>
          We use
          <a href="https://bundlephobia.com/" target="_blank">Bundlephobia</a>
          data to build the chart.
        </p>
      </m-chart-info>
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="chart">
      <div v-if="isLoading" class="text-center p">Loading...</div>
      <BundlephobiaChart v-else :libs="filteredLibs" :sizes="filteredSizes" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BundlephobiaChart from './BundlephobiaChart.vue';
import { fetchBundlephobiaData, BundlephobiaT } from '../apis';

export default defineComponent({
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
      sizes: [] as Array<BundlephobiaT>,
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

  computed: {
    // Filter out libs for which Bundlephobia coudn't provide any data
    filteredLibs(): string[] {
      return this.libs.filter((_lib, i) => !!this.sizes[i]);
    },
    filteredSizes(): BundlephobiaT[] {
      return this.sizes.filter((size) => !!size);
    },
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
  height: 350px;
}
</style>
