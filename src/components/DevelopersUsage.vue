<template>
  <DeveloperUsageChart
    v-if="filteredLibsNames.length && filteredLibsNamesWithData.length"
    :is-loading-libs-data="isLoadingLibsData"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="filteredLibsNames"
    :lib-to-color-map="libToColorMap"
    :libs-data="libsData"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, computed, watch } from 'vue';
import DeveloperUsageChart from './DeveloperUsageChart.vue';
import { fetchStateOfJSData, StateOfJST } from '@/apis';
import { libToStateofjsIdMap } from '../../stateofjs.config';

export default defineComponent({
  name: 'DevelopersUsage',

  components: {
    DeveloperUsageChart,
  },

  props: {
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    isLoadingLibsData: { type: Boolean, required: true },
  },

  setup(props) {
    const { libsNames } = toRefs(props);
    const libsData = ref<(StateOfJST | null)[]>([]);
    const isLoading = ref(true);
    const isError = ref(false);
    const filteredLibsNames = computed(() =>
      libsNames.value.filter((libName) => !!libToStateofjsIdMap[libName])
    );
    const filteredLibsNamesWithData = computed(() =>
      libsData.value.filter((libData) => libData && libData.usage.length)
    );
    let lastFetchPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;

      const fetchPromise = (lastFetchPromise = Promise.all(
        filteredLibsNames.value.map((libName) =>
          fetchStateOfJSData(libToStateofjsIdMap[libName])
        )
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (lastFetchPromise === fetchPromise) {
            libsData.value = data;
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
      libsData,
      filteredLibsNames,
      filteredLibsNamesWithData,
    };
  },
});
</script>
