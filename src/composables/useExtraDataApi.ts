import { computed, ref, watchEffect, UnwrapNestedRefs, Ref } from 'vue';
import { fetchNpmDownloads } from '@/components/downloads/api';
import { fetchRepoStars } from '@/components/github-stars/api';
import { fetchNpmPackageReleases } from '@/components/npm-releases/api';
import { fetchContributors } from '@/components/github-contributors/api';
import { fetchRepoCommits } from '@/components/commits/api';
import { fetchRepoLanguages } from '@/components/languages/api';
import { fetchBundlephobiaData } from '@/components/bundle-size/api';
import { useGTrendsQuery } from '@/queries/useGTrendsQuery';
import { useChartApi } from '@/composables/useChartApi';
import {
  isLoading as isLoadingLibraries,
  npmPackagesNames,
  reposIds,
} from '@/store/libraries';

type GTrendsQueryResultT = ReturnType<typeof useGTrendsQuery>;

export const gTrendsQueryRef: Ref<
  UnwrapNestedRefs<GTrendsQueryResultT> | undefined
> = ref();

// TODO: refactor into hooks
export default function useExtraDataApiLegacy(): void {
  useChartApi(npmPackagesNames, isLoadingLibraries, fetchNpmDownloads);
  useChartApi(npmPackagesNames, isLoadingLibraries, fetchNpmPackageReleases);
  useChartApi(npmPackagesNames, isLoadingLibraries, fetchBundlephobiaData);
  useChartApi(reposIds, isLoadingLibraries, fetchRepoStars);
  useChartApi(reposIds, isLoadingLibraries, fetchContributors);
  useChartApi(reposIds, isLoadingLibraries, fetchRepoCommits);
  useChartApi(reposIds, isLoadingLibraries, fetchRepoLanguages);
}

export function useExtraDataApi(): void {
  useGTrends();
}

function useGTrends(): void {
  const result = useGTrendsQuery(
    reposIds,
    computed(() => !isLoadingLibraries.value)
  );

  // @ts-ignore
  watchEffect(() => (gTrendsQueryRef.value = result));
}
