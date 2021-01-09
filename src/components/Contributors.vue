<template>
  <ContributorsChart
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsNames"
    :lib-to-color-map="libToColorMap"
    :libs-contributors="libsContributors"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch, computed } from 'vue';
import ContributorsChart from './ContributorsChart.vue';
import { fetchContributors, YearContributorsT, LibraryT } from '@/apis';

export default defineComponent({
  name: 'Contributors',

  components: {
    ContributorsChart,
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
    const libsContributors = ref<null | YearContributorsT[][]>(null);
    const isLoading = ref(true);
    const isError = ref(false);
    const libsNames = computed(() => libs.value.map(({ name }) => name));
    let contributorsPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;
      const localPromise = (contributorsPromise = Promise.all(
        libs.value.map((lib) => fetchContributors(lib.repo))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (contributorsPromise === localPromise) {
            libsContributors.value = data;
            isLoading.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (contributorsPromise === localPromise) {
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
      libsContributors,
      libsNames,
    };
  },
});
</script>
