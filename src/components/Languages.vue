<template>
  <LanguagesChart
    :is-loading="isLoading"
    :is-error="isError"
    :libs="libNames"
    :languages="languages"
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
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
  },

  setup(props) {
    const { libs } = toRefs(props);
    const libNames = computed<string[]>(() =>
      libs.value.map(({ name }) => name)
    );
    const languages = ref<null | GithubLanguagesResponseT[]>(null);
    const isLoading = ref(true);
    const isError = ref(false);
    let dataPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;
      const localPromise = (dataPromise = Promise.all(
        libs.value.map(({ repo }) => fetchRepoLanguages(repo))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (dataPromise === localPromise) {
            languages.value = data;
            isLoading.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (dataPromise === localPromise) {
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
      languages,
      libNames,
    };
  },
});
</script>
