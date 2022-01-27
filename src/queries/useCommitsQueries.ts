import { computed, Ref } from 'vue';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { isSameQuarter, subQuarters } from 'date-fns';
import { reportSentry } from '@/apis';
import { ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING } from '@/constants';
import { useQueries, UseQueriesResults, UseQueryOptions } from 'vue-query';

interface RepoCommitsResponseItemT {
  total: number;
  week: number;
}

export interface RepoCommitsResponseT {
  commits: RepoCommitsResponseItemT[];
  commitsLastQuarter: number;
}

export type UseCommitsQueriesResultT = Readonly<
  UseQueriesResults<UseQueryOptions<RepoCommitsResponseT, AxiosError>[]>
>;

export function useCommitsQueries(
  repoIds: Ref<string[]>,
  enabled: Ref<boolean>
): UseCommitsQueriesResultT {
  const prevQuarterDate = subQuarters(new Date(), 1);

  const queriesConfigs = computed(() =>
    repoIds.value.map((repoId) => ({
      queryKey: ['commit', repoId],
      queryFn: () =>
        axios.get<{ items: RepoCommitsResponseItemT[] }>(
          `https://github-commits.moiva.workers.dev/?repo=${repoId}`
        ),
      select({ data }: AxiosResponse<{ items: RepoCommitsResponseItemT[] }>) {
        return {
          commits: data.items,
          // Get the numer of commits in the last quarter
          // Filter by the quarter and summarize
          commitsLastQuarter: data.items
            .filter(({ week }) => isSameQuarter(week * 1000, prevQuarterDate))
            .reduce((acc, { total }) => acc + total, 0),
        };
      },
      enabled: enabled.value,
      onError(err: AxiosError) {
        const errorCode =
          err?.response?.data?.error?.code ||
          err?.response?.status ||
          undefined;

        // Report to Sentry unexpected errors only
        if (errorCode !== ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING) {
          reportSentry(err, 'fetchGithubCommitsData');
        }
      },
    }))
  );

  return useQueries(queriesConfigs);
}
