<template>
  <NpmDownloadsChart
    :is-loading-packages-data="isLoadingPackagesData"
    :is-loading-packages-downloads="isLoadingPackagesDownloads"
    :is-error="isError"
    :packages-names="packagesNames"
    :packages-downloads="libsDownloads"
    :repos-ids="reposIds"
    :repo-to-color-map="repoToColorMap"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, watch } from 'vue';
import NpmDownloadsChart from './NpmDownloadsChart.vue';
import { fetchNpmDownloads, NpmDownloadT } from '../apis';
import { repoToColorMap } from '@/store/reposColors';

export default defineComponent({
  name: 'NpmDownloads',

  components: {
    NpmDownloadsChart,
  },

  props: {
    packagesNames: { type: Array as () => string[], required: true },
    reposIds: { type: Array as () => string[], required: true },
    isLoadingPackagesData: { type: Boolean, required: true },
  },

  setup(props) {
    const { packagesNames } = toRefs(props);
    const libsDownloads = ref<(NpmDownloadT[] | null)[]>([]);
    const isLoadingPackagesDownloads = ref(true);
    const isError = ref(false);
    let lastFetchPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoadingPackagesDownloads.value = true;
      isError.value = false;

      const fetchPromise = (lastFetchPromise = Promise.all(
        packagesNames.value.map(fetchNpmDownloads)
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsDownloads.value = data;
            isLoadingPackagesDownloads.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            isLoadingPackagesDownloads.value = false;
            isError.value = true;
          }
        }));
    }

    onMounted(loadData);

    watch(packagesNames, loadData);

    return {
      isLoadingPackagesDownloads,
      isError,
      libsDownloads,
      repoToColorMap,
    };
  },
});
</script>
