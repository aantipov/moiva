// import axios from 'axios';
// import { reportSentry } from '@/apis';
// import { ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING } from '@/constants';
import { useQueries } from 'vue-query';
// import { useQueries } from '@/vue-query/src/index';
import { computed, reactive, Ref, watchEffect } from 'vue';

export function useCommitsBulkQuery(repoIds: Ref<string[]>) {
  // console.log('useCommitsBulkQuery', repoIds.value);
  // const queryKey = reactive(['todos', { repoIds }]);
  // const queriesConfigs = repoIds.value.map((repoId) => ({
  //   queryKey: ['commit', repoId],
  //   queryFn: fetcher,
  // }));

  const queriesConfigsComputed = computed(() => {
    return repoIds.value.map((repoId) => ({
      queryKey: ['commit', repoId],
      queryFn: () => fetcher(repoId),
    }));
  });

  const configs = reactive(queriesConfigsComputed.value);
  watchEffect(() => {
    configs.splice(0, configs.length, ...queriesConfigsComputed.value);
  });

  // console.log('react', reactive(queriesConfigsComputed));

  // @ts-ignore
  return useQueries(configs);
}

// export interface CommitsResponseItemT {
//   total: number;
//   week: number;
// }

function fetcher(repoId: string) {
  // console.log('fetching', repoId);
  // watchEffect(() => {configs
  //   console.log('repoId changed', repoIds.value);
  // });

  return Promise.resolve('commit_' + repoId);
  // return axios
  //   .get<{ items: CommitsResponseItemT[] }>(
  //     `https://github-commits.moiva.workers.dev/?repo=${repoId}`
  //   )
  //   .then(({ data }) => {
  //     // cacheR.set(repoIdLc, data.items);
  //     return data.items;
  //   })
  //   .catch((err) => {
  //     const errorCode =
  //       err?.response?.data?.error?.code || err?.response?.status || undefined;

  //     // Report to Sentry unexpected errors only
  //     if (errorCode !== ERROR_CODE_GITHUB_COMMITS_NEEDS_PROCESSING) {
  //       reportSentry(err, 'fetchGithubCommitsData');
  //     }

  //     return Promise.reject(err);
  //   });
}
