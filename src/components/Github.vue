<template>
  <div>
    <h2 class="mb-2">Github statistics</h2>

    <div v-if="isError" class="chart-error">
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

      <!-- Vulnerabilities -->
      <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
        <div v-if="isLoading" class="text-center p">Loading...</div>
        <Vulnerabilities v-else :libs="librariesNames" :repos="repos" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import OpenClosedIssues from './GithubOpenClosedIssues.vue';
import Age from './GithubAge.vue';
import Stars from './GithubStars.vue';
import Vulnerabilities from './GithubVulnerabilities.vue';
import { LibraryT } from '../apis';
import useGithub from '@/composables/useGithub';

export interface LibraryGithubEnhancedT extends LibraryT {
  githubName: string;
  githubOwner: string;
}

export default defineComponent({
  name: 'Github',

  components: {
    OpenClosedIssues,
    Age,
    Stars,
    Vulnerabilities,
  },

  props: {
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
  },

  setup(props) {
    const { libs } = toRefs(props);
    const { isLoading, isError, dataPromise, repositories } = useGithub(libs);

    return {
      isLoading,
      isError,
      reposPromise: dataPromise,
      repos: repositories,
    };
  },

  computed: {
    librariesNames(): string[] {
      return this.libs.map((lib) => lib.name);
    },
  },
});
</script>

<style scoped lang="postcss">
.chart {
  height: 350px;
}
</style>
