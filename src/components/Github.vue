<template>
  <div>
    <h2 class="mb-2">Github statistics</h2>

    <div v-if="isError" class="text-center text-red-700">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-else class="grid grid-cols-12 gap-4">
      <!-- Stars  -->
      <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
        <div v-if="isLoading" class="text-center p">Loading...</div>
        <Stars v-else :libs="librariesNames" :repos="repos" />
      </div>

      <!-- Age, years -->
      <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
        <div v-if="isLoading" class="text-center p">Loading...</div>
        <Age v-else :libs="librariesNames" :repos="repos" />
      </div>

      <!-- Issues, count  -->
      <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
        <div v-if="isLoading" class="text-center p">Loading...</div>
        <OpenClosedIssues v-else :libs="librariesNames" :repos="repos" />
      </div>

      <!-- Pull Requests, count  -->
      <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
        <div v-if="isLoading" class="text-center p">Loading...</div>
        <Prs v-else :libs="librariesNames" :repos="repos" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import OpenClosedIssues from './GithubOpenClosedIssues.vue';
import Age from './GithubAge.vue';
import Stars from './GithubStars.vue';
import Prs from './GithubPrs.vue';
import { fetchGithubData, RepoT, LibraryT } from '../apis';

export default Vue.extend({
  name: 'Github',

  components: {
    OpenClosedIssues,
    Age,
    Stars,
    Prs,
  },

  props: {
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      repos: [] as RepoT[],
      reposPromise: null as null | Promise<unknown>,
    };
  },

  computed: {
    librariesNames(): string[] {
      return this.libs.map((lib) => lib.name);
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
    loadData(): void {
      this.isLoading = true;
      this.isError = false;

      const promise = (this.reposPromise = Promise.all(
        this.libs.map((lib) => fetchGithubData(lib))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (this.reposPromise === promise) {
            this.repos = data;
            this.isError = false;
            this.isLoading = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (this.reposPromise === promise) {
            this.isError = true;
            this.isLoading = false;
          }
        }));
    },
  },
});
</script>

<style scoped lang="postcss">
.chart {
  height: 350px;
}
</style>
