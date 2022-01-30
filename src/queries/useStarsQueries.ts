import { computed, Ref } from 'vue';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { reportSentry } from '@/apis';
import { useQueries, UseQueriesResults, UseQueryOptions } from 'vue-query';

interface ResponseT {
  case: 1 | 2 | 3 | 4 | 5;
  // New number of stars per each month
  items: { month: string; stars: number }[];
  // Total number of stars in the certain month
  totals: { month: string; count?: number; totalCount?: number }[];
}

interface ResultT {
  monthlyAvg: number; // average number of new stars per month
  items: {
    month: string;
    newStars: number;
    total: number;
  }[];
}

export type UseStarsQueriesResultT = Readonly<
  UseQueriesResults<UseQueryOptions<ResultT, AxiosError>[]>
>;

export function useStarsQueries(
  repoIds: Ref<string[]>,
  enabled: Ref<boolean>
): UseStarsQueriesResultT {
  const queriesConfigs = computed(() =>
    repoIds.value.map((repoId) => ({
      queryKey: ['stars', repoId],
      queryFn: () =>
        axios.get<ResponseT>(
          `https://github-stars.moiva.workers.dev/?repo=${repoId}`
        ),
      enabled: enabled.value,
      staleTime: Infinity,
      cacheTime: Infinity,
      select({ data }: AxiosResponse<ResponseT>) {
        const newStarsMap = new Map(
          data.items.map((item) => [item.month, item.stars])
        );
        const totalStarsMap = new Map(
          data.totals.map((item) => [
            item.month,
            item.count || item.totalCount || 0,
          ])
        );
        const items = [] as ResultT['items'];
        let prevMonth = data.items.slice(-1)[0].month;

        while (prevMonth >= '2020-01') {
          const newStars = newStarsMap.get(prevMonth) || 0;
          const total =
            totalStarsMap.get(prevMonth) || items[0].total - items[0].newStars;
          items.unshift({
            month: prevMonth,
            newStars,
            total,
          });
          prevMonth = getPrevMonth(prevMonth);
        }

        // Get avg number of new stars monthly (in the last 3 months)
        const lastItems = items.slice(-3);
        const monthlyAvg = Math.round(
          lastItems
            .map((val) => val.newStars)
            .reduce((acc, val) => acc + val, 0) / lastItems.length
        );

        return {
          monthlyAvg,
          items,
        };
      },
      onError(err: AxiosError) {
        reportSentry(err, 'fetchGithubStars');
      },
    }))
  );

  return useQueries(queriesConfigs);
}

function getPrevMonth(month: string) {
  const date = month ? new Date(month) : new Date();
  date.setUTCMonth(date.getUTCMonth() - 1, 1);
  return date.toISOString().slice(0, 7);
}
