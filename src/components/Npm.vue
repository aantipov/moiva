<template>
  <div>
    <h2>NPM downloads</h2>

    <div class="chart">
      <div v-if="isLoading" class="p text-center">Loading...</div>
      <NpmChart v-else :apps="apps" :downloads="downloads" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import NpmChart from './NpmChart.vue';
// @ts-ignore
import { appsConfigsMap } from '../../apps-config';

export interface NpmDownloadT {
  downloads: number;
  month: string;
}

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
      Promise.all(
        this.apps.map((app) =>
          axios
            .get(`/api/npm?app=${appsConfigsMap[app].npm.name}`)
            .then((res) => res.data)
        )
      ).then((data) => {
        this.downloads = data;
        this.isLoading = false;
      });
    },
  },
});
</script>

<style scoped lang="scss">
.chart {
  width: 1200px;
  height: 600px;
  margin: 0 auto;
}
</style>
