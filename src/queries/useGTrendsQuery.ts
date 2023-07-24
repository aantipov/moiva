import axios, { AxiosError } from 'axios';
import { reportSentry } from '@/apis';
import { useQuery, UseQueryReturnType } from 'vue-query';
import { GOOGLE_TRENDS_LIBS_LIMIT, repoToGTrendDefMap } from '@/data/index';
import { computed, Ref, unref } from 'vue';

interface GTrendPointT {
  time: string;
  value: number[];
}

interface GTrendsResponseT {
  averages: number[] | [null];
  timelineData: GTrendPointT[];
}

export interface LibGTrendsDataT {
  repoId: string;
  average: number | null; // null in case of a single library
  timeline: {
    time: string;
    value: number;
  }[];
}

export function useGTrendsQuery(
  reposIds: Lowercase<string>[] | Ref<Lowercase<string>[]>,
  enabled: Ref<boolean>,
): UseQueryReturnType<Map<string, LibGTrendsDataT>, AxiosError> {
  // We need to compare only those libs for which Google trends
  // has sensible data
  // Google Trends allows to compare only 5 terms at max
  const filteredReposIds = computed(() => {
    return unref(reposIds)
      .filter((repoId) => !!repoToGTrendDefMap[repoId])
      .slice(0, GOOGLE_TRENDS_LIBS_LIMIT)
      .sort();
  });

  return useQuery(
    ['gtrends', filteredReposIds],
    () => {
      const libsStr = filteredReposIds.value.join(',');
      return axios.get<GTrendsResponseT>(
        `https://google-trends.moiva.workers.dev/?libs=${libsStr}`,
      );
    },
    // options
    {
      enabled: computed(
        () => enabled.value && filteredReposIds.value.length > 0,
      ),
      keepPreviousData: true,
      staleTime: Infinity,
      cacheTime: Infinity,
      select({ data }) {
        const entries = filteredReposIds.value.map(
          (repoId, index) =>
            [
              repoId,
              {
                repoId,
                average: data.averages[index],
                timeline: data.timelineData.map(({ time, value }) => ({
                  time,
                  value: value[index],
                })),
              },
            ] as const,
        );
        return new Map(entries);
      },
      onError(err: AxiosError) {
        reportSentry(err, 'fetchGTrendsData');
      },
    },
  );
}
