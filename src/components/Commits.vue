<template>
  <CommitsChart
    :is-loading-libs-data="isLoadingLibsData"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="libsNames"
    :lib-to-color-map="libToColorMap"
    :libs-commits="libsCommits"
    :repos-names="reposNames"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, computed, watch } from 'vue';
import CommitsChart from './CommitsChart.vue';
import { fetchRepoCommits, NpmPackageT } from '@/apis';
import { CommitsResponseItemT } from '../../api/gh-commits';

/**
 * Make sure commits of all the libs
 * start with the same week
 * and end with the same week
 */
function getNormalisedData(
  libsCommits: (CommitsResponseItemT[] | null)[]
): (CommitsResponseItemT[] | null)[] {
  if (!libsCommits.filter((libsCommits) => !!libsCommits).length) {
    return libsCommits;
  }
  // Find the latest start
  const startWeeks = libsCommits
    .filter((libCommits) => !!libCommits)
    .map((libCommits) => (libCommits as CommitsResponseItemT[])[0].week);
  const endWeeks = libsCommits
    .filter((libCommits) => !!libCommits)
    .map(
      (libCommits) => (libCommits as CommitsResponseItemT[]).slice(-1)[0].week
    );
  const maxStartWeek = Math.max(...startWeeks);
  const minEndWeek = Math.min(...endWeeks);
  const normalisedCommits = libsCommits.map((libCommits) => {
    if (!libCommits) {
      return null;
    }

    const startIndex = libCommits.findIndex(
      (commit) => commit.week === maxStartWeek
    );
    const endIndex = libCommits.findIndex(
      (commit) => commit.week === minEndWeek
    );
    return libCommits.slice(startIndex, endIndex);
  });

  return normalisedCommits;
}

/**
 * Aggregate libs commits by 4 weeks
 */
function getAggregatedCommits(libsCommits: (CommitsResponseItemT[] | null)[]) {
  const aggregatedCommits = libsCommits.map((libCommits) => {
    if (!libCommits) {
      return null;
    }
    return libCommits
      .map((item) => ({
        ...item,
        week: item.week * 1000,
      }))
      .reduce((acc, item, i) => {
        if (i % 4 === 0) {
          acc.push(item);
        } else {
          acc[acc.length - 1].total += item.total;
          acc[acc.length - 1].week = item.week;
        }

        return acc;
      }, [] as CommitsResponseItemT[]);
  });

  return aggregatedCommits;
}

export default defineComponent({
  name: 'Commits',

  components: {
    CommitsChart,
  },

  props: {
    libs: { type: Array as () => NpmPackageT[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    isLoadingLibsData: { type: Boolean, required: true },
  },

  setup(props) {
    const { libs } = toRefs(props);
    const libsCommits = ref<(CommitsResponseItemT[] | null)[]>([]);
    const libsNames = computed(() => libs.value.map(({ name }) => name));
    const reposNames = computed(() =>
      libs.value.map(({ repoName }) => repoName)
    );
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
            // Ther is a divergence in data between repos -
            // commits data may start and end with different weeks
            // We need to normalise data before using it
            // And then aggregate data by 4 weeks
            libsCommits.value = getAggregatedCommits(getNormalisedData(data));
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
      reposNames,
    };
  },
});
</script>
