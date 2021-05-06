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
  if (cacheR.get(repoId)) {
    return Promise.resolve(cacheR.get(repoId) as CommitsResponseItemT[]);
  }

  return axios
    .get<{ items: CommitsResponseItemT[] }>(
      `https://github-commits.moiva.workers.dev/?repo=${repoId}`
    )
    .then(({ data }) => {
      cacheR.set(repoId, data.items);
      return data.items;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING) {
        reportSentry(err, 'fetchGithubCommitsData');
      }

      cacheR.set(repoId, null);
      return null;
    });
}
