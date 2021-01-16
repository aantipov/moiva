<template>
  <NpmDownloadsChart
    :is-loading-libs-data="isLoadingLibsData"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsNames"
    :lib-to-color-map="libToColorMap"
    :libs-downloads="libsDownloads"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch } from 'vue';
import NpmDownloadsChart from './NpmDownloadsChart.vue';
import { fetchNpmDownloads, NpmDownloadT } from '../apis';

export default defineComponent({
  name: 'NpmDownloads',

  components: {
    NpmDownloadsChart,
  },

  props: {
    libsNames: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    isLoadingLibsData: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const { libsNames } = toRefs(props);
    const libsDownloads = ref<(NpmDownloadT[] | null)[]>([]);
    const isLoading = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;

      const fetchPromise = (lastFetchPromise = Promise.all(
        libsNames.value.map(fetchNpmDownloads)
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsDownloads.value = data;
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

    watch(libsNames, loadData);

    return {
      isLoading,
      isError,
      libsDownloads,
    };
  },
});
</script>
