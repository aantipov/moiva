import axios from 'axios';
import { reportSentry } from '@/apis';
import { ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING } from '@/constants';
import { reactive } from 'vue';

export interface CommitsResponseItemT {
  total: number;
  week: number;
}

export const cacheR = reactive(
  new Map<string, CommitsResponseItemT[] | null>()
);

export function fetchRepoCommits(
  repoId: string
): Promise<CommitsResponseItemT[] | null> {
  const repoIdLc = repoId.toLowerCase();
  if (cacheR.get(repoIdLc)) {
    return Promise.resolve(cacheR.get(repoIdLc) as CommitsResponseItemT[]);
  }

  return axios
    .get<{ items: CommitsResponseItemT[] }>(
      `https://github-commits.moiva.workers.dev/?repo=${repoIdLc}`
    )
    .then(({ data }) => {
      cacheR.set(repoIdLc, data.items);
      return data.items;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING) {
        reportSentry(err, 'fetchGithubCommitsData');
      }

      cacheR.set(repoIdLc, null);
      return null;
    });
}

/**
 * Make sure commits of all the libs
 * start with the same week
 * and end with the same week
 */
export function getNormalisedData(
  libsCommits: CommitsResponseItemT[][]
): CommitsResponseItemT[][] {
  // Find the latest start
  const startWeeks = libsCommits.map((libCommits) => libCommits[0].week);
  const endWeeks = libsCommits.map(
    (libCommits) => libCommits.slice(-1)[0].week
  );
  const maxStartWeek = Math.max(...startWeeks);
  const minEndWeek = Math.min(...endWeeks);

  // Return Normalised commits
  return libsCommits.map((libCommits) => {
    const startIndex = libCommits.findIndex(
      (commit) => commit.week === maxStartWeek
    );
    const endIndex = libCommits.findIndex(
      (commit) => commit.week === minEndWeek
    );
    return libCommits.slice(startIndex, endIndex);
  });
}

/**
 * Aggregate libs commits by 4 weeks
 */
export function getAggregatedCommits(libsCommits: CommitsResponseItemT[][]) {
  return libsCommits.map((libCommits) => {
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
}
