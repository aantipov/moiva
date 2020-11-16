<template>
  <div>
    <h2>Github statistics</h2>

    <div v-if="isError" class="text-center text-red-700">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="chart-list">
      <div class="chart">
        <div v-if="isLoading" class="p text-center">Loading...</div>
        <OpenClosedIssues v-else :apps="apps" :repos="repos" />
      </div>

      <div class="chart">
        <div v-if="isLoading" class="p text-center">Loading...</div>
        <Age v-else :apps="apps" :repos="repos" />
      </div>

      <div class="chart">
        <div v-if="isLoading" class="p text-center">Loading...</div>
        <Stars v-else :apps="apps" :repos="repos" />
      </div>

      <div class="chart">
        <div v-if="isLoading" class="p text-center">Loading...</div>
        <Prs v-else :apps="apps" :repos="repos" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import OpenClosedIssues from './GithubOpenClosedIssues.vue';
import Age from './GithubAge.vue';
import Stars from './GithubStars.vue';
import Prs from './GithubPrs.vue';

export interface RepoT {
  stars: number;
  createdAt: string;
  openPRs: { totalCount: number };
  closedPRs: { totalCount: number };
  mergedPRs: { totalCount: number };
  closedIssues: { totalCount: number };
  openIssues: { totalCount: number };
}

export default Vue.extend({
  name: 'Github',

  components: {
    OpenClosedIssues,
    Age,
    Stars,
    Prs,
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
      repos: [] as RepoT[],
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

      Promise.all(
        this.apps.map((app) =>
          axios.get(`/api/gh?app=${app}`).then((res) => res.data)
        )
      )
        .then((data) => {
          this.repos = data;
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
.chart-list {
  display: flex;
  flex-wrap: wrap;
}
.chart {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>
