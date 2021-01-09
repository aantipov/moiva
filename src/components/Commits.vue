<template>
  <CommitsChart
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsNames"
    :lib-to-color-map="libToColorMap"
    :libs-commits="libsCommits"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, computed, watch } from 'vue';
import CommitsChart from './CommitsChart.vue';
import { fetchRepoCommits, LibraryT } from '@/apis';
import { GithubCommitsResponseT } from '../../api/gh-commits';

export default defineComponent({
  name: 'Commits',

  components: {
    CommitsChart,
  },

  props: {
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { libs } = toRefs(props);
    const libsNames = computed<string[]>(() =>
      libs.value.map(({ name }) => name)
    );
    const libsCommits = ref<null | GithubCommitsResponseT[]>(null);

    const isLoading = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;
      const fetchPromise = (lastFetchPromise = Promise.all(
        libs.value.map(({ repo }) => fetchRepoCommits(repo))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsCommits.value = data;
            isLoading.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            isLoading.value = false;
            isError.value = true;
          }
        }));
    }

    onMounted(loadData);

    watch(libs, loadData);

    return {
      isLoading,
      isError,
      libsCommits,
      libsNames,
    };
  },
});
</script>
