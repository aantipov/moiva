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
