import axios from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';

export type LanguagesT = Record<string, number>;

export const cacheR = reactive(new Map<string, LanguagesT | null>());

export function fetchRepoLanguages(repoId: string): Promise<LanguagesT | null> {
  const repoIdLc = repoId.toLowerCase();

  if (cacheR.get(repoIdLc)) {
    return Promise.resolve(cacheR.get(repoIdLc) as LanguagesT);
  }

  return axios
    .get(`https://github-languages.moiva.workers.dev/?repo=${repoId}`)
    .then(({ data }) => {
      cacheR.set(repoIdLc, data);
      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      if (errorCode !== 404) {
        reportSentry(err, 'fetchGithubLanguagesData');
      }

      cacheR.set(repoIdLc, null);
      return null;
    });
}
