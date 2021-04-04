import axios from 'axios';
import { reportSentry } from '@/apis';
import { ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING } from '@/constants';

const cache = new Map();

export interface ContributorsT {
  month: string;
  contributors: number;
}

export function fetchContributors(
  repoId: string
): Promise<ContributorsT[] | null> {
  if (cache.get(repoId)) {
    return Promise.resolve(cache.get(repoId));
  }

  return axios
    .get<{ items: ContributorsT[] }>(
      `https://github-contributors.moiva.workers.dev/?repo=${repoId}`
    )
    .then(({ data }) => {
      // fix quarters and add 1 month to correspond to the values used by the chart library
      const items = data.items.map((item) => ({
        ...item,
        month: (() => {
          const quarterDate = new Date(item.month);
          quarterDate.setUTCMonth(quarterDate.getUTCMonth() + 1, 1);
          return quarterDate.toISOString().slice(0, 7);
        })(),
      }));

      cache.set(repoId, items);
      return items;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING) {
        reportSentry(err, 'fetchContributorsData');
      }

      return null;
    });
}
