import { computed } from 'vue';
import { reposIds } from '@/store/libraries';
import { repoToGTrendDefMap } from '@/data/index';

export function useChartsVisibility() {
  return {
    googleTrends: computed(
      () =>
        reposIds.value.filter((repoId) => !!repoToGTrendDefMap[repoId]).length >
        0
    ),
  };
}
