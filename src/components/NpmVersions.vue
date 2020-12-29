<template>
  <NpmVersionsChart
    :is-loading="isLoading"
    :is-error="isError"
    :libs="libs"
    :lib-to-color-map="libToColorMap"
    :versions="versions"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch } from 'vue';
import NpmVersionsChart from './NpmVersionsChart.vue';
import { fetchNpmPackageVersions, NpmPackageVersionsT } from '@/apis';

export default defineComponent({
  name: 'NpmVersions',

  components: {
    NpmVersionsChart,
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

  setup(props) {
    const { libs } = toRefs(props);
    const versions = ref<null | NpmPackageVersionsT[]>(null);
    const isLoading = ref(true);
    const isError = ref(false);
    let versionsPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;
      const localPromise = (versionsPromise = Promise.all(
        libs.value.map(fetchNpmPackageVersions)
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (versionsPromise === localPromise) {
            versions.value = data;
            isLoading.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (versionsPromise === localPromise) {
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
      versions,
    };
  },
});
</script>
