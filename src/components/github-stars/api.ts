import axios from 'axios';
import { reportSentry } from '@/apis';

export interface StarsT {
  month: string;
  stars: number;
}

interface ResponseT {
  items: StarsT[];
}

const cache = new Map();

export function fetchRepoStars(repoId: string): Promise<StarsT[] | null> {
  if (cache.get(repoId)) {
    return Promise.resolve(cache.get(repoId));
  }

  return axios
    .get<{ items: StarsT[] }>(
      `https://github-stars.moiva.workers.dev/?repo=${repoId}`
    )
    .then(({ data }) => {
      const items = fillMissingData(data.items);
      cache.set(repoId, items);
      return items;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGithubStars');
      return null;
    });
}

function fillMissingData(items: StarsT[]): StarsT[] {
  const firstMonth = '2020-01';
  if (items[0].month === firstMonth) {
    return items;
  }

  const missingItems = [] as StarsT[];
  let month = firstMonth;
  while (month < items[0].month) {
    missingItems.push({ month, stars: 0 });
    month = getNextMonth(month);
  }

  return [...missingItems, ...items];
}

function getNextMonth(month: string) {
  const date = month ? new Date(month) : new Date();
  date.setUTCMonth(date.getUTCMonth() + 1);
  return date.toISOString().slice(0, 7);
}
