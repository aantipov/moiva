import { computed, ref, watchEffect, UnwrapNestedRefs, Ref } from 'vue';
import { fetchNpmDownloads } from '@/components/downloads/api';
import { fetchRepoStars } from '@/components/github-stars/api';
import { fetchNpmPackageReleases } from '@/components/npm-releases/api';
import { fetchContributors } from '@/components/github-contributors/api';
import { fetchRepoLanguages } from '@/components/languages/api';
import { fetchBundlephobiaData } from '@/components/bundle-size/api';
import { useGTrendsQuery } from '@/queries/useGTrendsQuery';
import { useStarsQueries } from '@/queries/useStarsQueries';
import { useCommitsQueries } from '@/queries/useCommitsQueries';
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

export const commitsQueriesRef: Ref<
  Map<string, ReturnType<typeof useCommitsQueries>[number]>
> = ref(new Map());

export const starsQueriesRef: Ref<
  Map<string, ReturnType<typeof useStarsQueries>[number]>
> = ref(new Map());

// TODO: refactor into hooks
export default function useExtraDataApiLegacy(): void {
  useChartApi(npmPackagesNames, isLoadingLibraries, fetchNpmDownloads);
  useChartApi(npmPackagesNames, isLoadingLibraries, fetchNpmPackageReleases);
  useChartApi(npmPackagesNames, isLoadingLibraries, fetchBundlephobiaData);
  useChartApi(reposIds, isLoadingLibraries, fetchRepoStars);
  useChartApi(reposIds, isLoadingLibraries, fetchContributors);
  useChartApi(reposIds, isLoadingLibraries, fetchRepoLanguages);
}

export function useExtraDataApi(): void {
  useGTrends();
  useCommits();
  useStars();
}

function useStars(): void {
  const queries = useStarsQueries(
    reposIds,
    computed(() => !isLoadingLibraries.value)
  );

  watchEffect(() => {
    starsQueriesRef.value = new Map(
      reposIds.value.map((repoId, i) => [repoId, queries[i]])
    );
  });
}

function useGTrends(): void {
  const result = useGTrendsQuery(
    reposIds,
    computed(() => !isLoadingLibraries.value)
  );

  // @ts-ignore
  watchEffect(() => (gTrendsQueryRef.value = result));
}

function useCommits(): void {
  const queries = useCommitsQueries(
    reposIds,
    computed(() => !isLoadingLibraries.value)
  );

  watchEffect(() => {
    commitsQueriesRef.value = new Map(
      reposIds.value.map((repoId, i) => [repoId, queries[i]])
    );
  });
}
