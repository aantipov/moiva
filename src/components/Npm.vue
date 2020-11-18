<template>
  <div>
    <h2>NPM downloads</h2>

    <div v-if="isError" class="text-center text-red-700">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="chart">
      <div v-if="isLoading" class="p text-center">Loading...</div>
      <NpmChart v-else :apps="apps" :downloads="downloads" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NpmChart from './NpmChart.vue';
// @ts-ignore
import { fetchNpmData, NpmDownloadT } from '../apis';

export default Vue.extend({
  name: 'Npm',

  components: {
    NpmChart,
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
      downloads: [] as Array<Array<NpmDownloadT>>,
    };
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

      Promise.all(this.apps.map((app) => fetchNpmData(app)))
        .then((data) => {
          this.downloads = data;
          this.isError = false;
          this.isLoading = false;
        })
        .catch(() => {
          this.isError = true;
          this.isLoading = false;
        });
    },
  },
});
</script>

<style scoped lang="scss">
.chart {
  height: 400px;
}
</style>
