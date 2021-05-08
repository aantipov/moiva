import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';

export type GithubLanguagesResponseT = Record<string, number>;

export function reportSentry(err: AxiosError, methodName: string): void {
  err.name = `UI API (${methodName})`;

  Sentry.captureException(err, {
    tags: {
      apiResponseMessage: err.response?.data?.error || '',
      apiRequestUrl: err.config?.url || '',
    },
  });
}

const githubLanguagesCache = new Map();
export function fetchRepoLanguages(
  repoId: string
): Promise<GithubLanguagesResponseT | null> {
  if (githubLanguagesCache.get(repoId)) {
    return Promise.resolve(githubLanguagesCache.get(repoId));
  }

  return axios
    .get(`https://github-languages.moiva.workers.dev/?repo=${repoId}`)
    .then(({ data }) => {
      githubLanguagesCache.set(repoId, data);
      return data;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      if (errorCode !== 404) {
        reportSentry(err, 'fetchGithubLanguagesData');
      }

      return null;
    });
}
