<template>
  <LanguagesChart
    :is-loading-libs-data="isLoadingLibsData"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsNames"
    :repos-names="reposNames"
    :libs-languages="libsLanguages"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, computed, watch } from 'vue';
import LanguagesChart from './LanguagesChart.vue';
import { fetchRepoLanguages, LibraryT } from '@/apis';
import { GithubLanguagesResponseT } from '../../api/gh-languages';

export default defineComponent({
  name: 'Languages',

  components: {
    LanguagesChart,
  },

  props: {
    libs: { type: Array as () => LibraryT[], required: true },
    isLoadingLibsData: { type: Boolean, required: true },
  },

  setup(props) {
    const { libs } = toRefs(props);
    const libsNames = computed<string[]>(() =>
      libs.value.map(({ name }) => name)
    );
    const reposNames = computed(() =>
      libs.value.map(({ repoName }) => repoName)
    );
    const libsLanguages = ref<(GithubLanguagesResponseT | null)[]>([]);
    const isLoading = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;

      const fetchPromise = (lastFetchPromise = Promise.all(
        libs.value.map(({ repo }) => fetchRepoLanguages(repo))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsLanguages.value = data;
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
      libsNames,
      reposNames,
      libsLanguages,
    };
  },
});
</script>
