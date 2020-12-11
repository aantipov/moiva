<template>
  <div>
    <h2>Google Trends <span class="text-base">(max. 5 libs)</span></h2>

    <div v-if="isError" class="text-center text-red-700">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="chart">
      <div v-if="isLoading" class="text-center p">Loading...</div>
      <GTrendsChart
        v-else
        :libs="slicedLibs"
        :lib-to-color-map="libToColorMap"
        :data="data.timelineData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GTrendsChart from './GTrendsChart.vue';
import { fetchGTrendsData, GTrendsT } from '../apis';

export default Vue.extend({
  name: 'GoogleTrends',

  components: {
    GTrendsChart,
  },

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      data: {} as GTrendsT,
      dataPromise: null as null | Promise<unknown>,
    };
  },

  computed: {
    slicedLibs(): string[] {
      // Google Trends allows to compare only 5 terms at max
      return this.libs.slice(0, 5);
    },
  },

  watch: {
    slicedLibs(): void {
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

      const promise = (this.dataPromise = fetchGTrendsData(this.slicedLibs)
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (this.dataPromise === promise) {
            this.data = data;
            this.isError = false;
            this.isLoading = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (this.dataPromise === promise) {
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
