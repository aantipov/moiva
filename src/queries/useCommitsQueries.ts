import { computed, Ref } from 'vue';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  isSameQuarter,
  subQuarters,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { reportSentry } from '@/apis';
import { ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING } from '@/constants';
import { useQueries, UseQueriesResults, UseQueryOptions } from 'vue-query';

interface RepoCommitsResponseItemT {
  total: number;
  week: number;
}

interface RepoMonthlyCommitsItemT {
  total: number;
  month: number;
}

interface RepoCommitsResponseT {
  commits: RepoCommitsResponseItemT[];
  monthlyCommits: RepoMonthlyCommitsItemT[];
  commitsLastQuarter: number;
}

export type UseCommitsQueriesResultT = Readonly<
  UseQueriesResults<UseQueryOptions<RepoCommitsResponseT, AxiosError>[]>
>;

export function useCommitsQueries(
  repoIds: Ref<string[]>,
  enabled: Ref<boolean>,
): UseCommitsQueriesResultT {
  const prevQuarterDate = subQuarters(new Date(), 1);

  const queriesConfigs = computed(() =>
    repoIds.value.map((repoId) => ({
      queryKey: ['commits', repoId],
      queryFn: () =>
        axios.get<{ items: RepoCommitsResponseItemT[] }>(
          `https://github-commits.moiva.workers.dev/?repo=${repoId}`,
        ),
      enabled: enabled.value,
      staleTime: Infinity,
      cacheTime: Infinity,
      select({ data }: AxiosResponse<{ items: RepoCommitsResponseItemT[] }>) {
        return {
          commits: data.items,
          // Aggregate commits by month
          monthlyCommits: data.items.reduce((acc, item) => {
            const prevItem = acc.slice(-1)[0];

            if (prevItem && isSameMonth(item.week * 1000, prevItem.month)) {
              prevItem.total += item.total;
            } else {
              acc.push({
                total: item.total,
                month: startOfMonth(item.week * 1000).valueOf(),
              });
            }

            return acc;
          }, [] as RepoMonthlyCommitsItemT[]),
          // Get the numer of commits in the last quarter
          // Filter by the quarter and summarize
          commitsLastQuarter: data.items
            .filter(({ week }) => isSameQuarter(week * 1000, prevQuarterDate))
            .reduce((acc, { total }) => acc + total, 0),
        };
      },
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
    })),
  );

  return useQueries(queriesConfigs);
}
