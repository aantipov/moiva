<template>
  <div>
    <h2>NPM monthly downloads</h2>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else style="height: 350px">
      <div v-if="isLoading" class="text-center p">Loading...</div>
      <NpmChart
        v-else
        :libs="libs"
        :lib-to-color-map="libToColorMap"
        :downloads="downloads"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NpmChart from './NpmChart.vue';
import { fetchNpmDownloads, NpmDownloadT } from '../apis';

export default defineComponent({
  name: 'Npm',

  components: {
    NpmChart,
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
      downloads: [] as Array<Array<NpmDownloadT>>,
      downloadsPromise: null as null | Promise<unknown>,
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

      const promise = (this.downloadsPromise = Promise.all(
        this.libs.map((app) => fetchNpmDownloads(app))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (this.downloadsPromise === promise) {
            this.downloads = data;
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
