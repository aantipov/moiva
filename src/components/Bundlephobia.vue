<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">Bundle size<span class="text-base">, kB</span></h2>

      <m-chart-info class="ml-2">
        <p>
          Moiva uses data from
          <a href="https://bundlephobia.com/" target="_blank">Bundlephobia</a>
          to build this chart.
        </p>
      </m-chart-info>

      <m-chart-info v-if="failedLibs.length" class="ml-2" type="WARNING">
        <div>
          Sorry, we couldn't fetch data from
          <a href="https://bundlephobia.com/" target="_blank">Bundlephobia</a>
          for the following packages:
          <div v-for="libName in failedLibs" :key="libName">
            -
            <a :href="getBundlephobiaUrl(libName)" target="_blank">{{
              libName
            }}</a>
          </div>
        </div>
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
import { getBundlephobiaUrl } from '@/utils';

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

  computed: {
    // Filter out libs for which Bundlephobia coudn't provide any data
    filteredLibs(): string[] {
      return this.libs.filter((_lib, i) => !!this.sizes[i]);
    },
    failedLibs(): string[] {
      return this.libs.filter((_lib, i) => !this.sizes[i]);
    },
    filteredSizes(): BundlephobiaT[] {
      return this.sizes.filter((size) => !!size);
    },
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
    getBundlephobiaUrl(libName: string): string {
      return getBundlephobiaUrl(libName);
    },
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
