import axios from 'axios';
import { reportSentry } from '@/apis';
import { ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING } from '@/constants';
import { useQuery } from 'vue-query';
// import { useQuery } from '@/vue-query/src/vue/useQuery';

export function useCommitsQuery(repoId: string) {
  // console.log('useCommitsQuery', repoId);

  return useQuery(['commits', repoId], () => fetcher(repoId));
}

export interface CommitsResponseItemT {
  total: number;
  week: number;
}

function fetcher(repoId: string) {
  return axios
    .get<{ items: CommitsResponseItemT[] }>(
      `https://github-commits.moiva.workers.dev/?repo=${repoId}`
    )
    .then(({ data }) => {
      // cacheR.set(repoIdLc, data.items);
      return data.items;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING) {
        reportSentry(err, 'fetchGithubCommitsData');
      }

      return Promise.reject(err);
    });
}
