import axios from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';

export interface StarsT {
  month: string;
  stars: number;
}

export const cacheR = reactive(new Map<string, StarsT[] | null>());

export function fetchRepoStars(repoId: string): Promise<StarsT[] | null> {
  const repoIdLC = repoId.toLowerCase();
  if (cacheR.get(repoIdLC)) {
    return Promise.resolve(cacheR.get(repoIdLC) as StarsT[]);
  }

  return axios
    .get<{ items: StarsT[] }>(
      `https://github-stars.moiva.workers.dev/?repo=${repoIdLC}`
    )
    .then(({ data }) => {
      const items = fillMissingData(data.items);
      cacheR.set(repoIdLC, items);
      return items;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGithubStars');
      cacheR.set(repoIdLC, null);
      return null;
    });
}

function fillMissingData(items: StarsT[]): StarsT[] {
  if (!items.length) {
    return items;
  }
  // exclude current (last) month with non complete data
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (items.slice(-1)[0].month === currentMonth) {
    items.pop();
  }

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
  date.setUTCMonth(date.getUTCMonth() + 1, 1);
  return date.toISOString().slice(0, 7);
}
