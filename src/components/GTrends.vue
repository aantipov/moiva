<template>
  <div>
    <h2>Google Trends <span class="text-base">(max. 5 apps)</span></h2>

    <div v-if="isError" class="text-center text-red-700">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="chart">
      <div v-if="isLoading" class="text-center p">Loading...</div>
      <GTrendsChart v-else :apps="slicedApps" :data="data.timelineData" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GTrendsChart from './GTrendsChart.vue';
// @ts-ignore
import { fetchGTrendsData, GTrendsT } from '../apis';

export default Vue.extend({
  name: 'GoogleTrends',

  components: {
    GTrendsChart,
  },

  props: {
    apps: {
      type: Array as () => string[],
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      data: {} as GTrendsT, // as Array<Array<NpmDownloadT>>,
      downloadsPromise: null as null | Promise<unknown>,
    };
  },

  computed: {
    slicedApps(): string[] {
      // Google Trends allow compare only 5 terms at max
      return this.apps.slice(0, 5);
    },
  },

  watch: {
    apps(): void {
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

      const promise = (this.downloadsPromise = fetchGTrendsData(this.slicedApps)
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (this.downloadsPromise === promise) {
            this.data = data;
            this.isError = false;
            this.isLoading = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (this.downloadsPromise === promise) {
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
  height: 400px;
}
</style>
