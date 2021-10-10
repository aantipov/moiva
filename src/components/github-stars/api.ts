import axios, { AxiosError } from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';

export interface StarsT {
  month: string;
  stars: number;
}

interface StarsTotalsT {
  month: string;
  count: number;
}

interface ResponseT {
  items: StarsT[];
  totals: StarsTotalsT[];
}

export const cacheR = reactive(new Map<string, StarsT[] | null>());
export const starsCumulateCacheR = reactive(new Map<string, StarsT[] | null>());

export async function fetchRepoStars(repoId: string): Promise<StarsT[] | null> {
  const repoIdLC = repoId.toLowerCase();

  if (cacheR.get(repoIdLC)) {
    return Promise.resolve(cacheR.get(repoIdLC) as StarsT[]);
  }

  try {
    const { data } = await axios.get<ResponseT>(
      `https://github-stars.moiva.workers.dev/?repo=${repoIdLC}`
    );
    const items = fillMissingData(data.items);
    cacheR.set(repoIdLC, items);
    starsCumulateCacheR.set(repoIdLC, getCummulateStars(items, data.totals));
    return items;
  } catch (error) {
    reportSentry(error as AxiosError<{ error?: string }>, 'fetchGithubStars');
    cacheR.set(repoIdLC, null);
    return null;
  }
}

function getCummulateStars(
  items: StarsT[],
  totals: StarsTotalsT[]
): StarsT[] | null {
  if (!items.length || !totals.length) {
    return null;
  }
  const lastMonthTotals = getLastMonthStarsTotal(items, totals);
  const monthToTotalMap = totals.reduce((acc, libTotal) => {
    acc.set(libTotal.month, libTotal.count);
    return acc;
  }, new Map<string, number>());

  if (!lastMonthTotals) {
    return null;
  }

  return items.reduceRight(
    (acc, val) => {
      const prevMonth = getPrevMonth(val.month);
      const stars = monthToTotalMap.get(prevMonth) || acc[0].stars - val.stars;
      return [
        {
          month: prevMonth,
          stars: stars > 0 ? stars : 0,
        },
        ...acc,
      ];
    },
    [lastMonthTotals]
  );
}

function getLastMonthStarsTotal(
  items: StarsT[],
  totals: StarsTotalsT[]
): StarsT | null {
  const lastMonth = items.slice(-1)[0].month;
  const lastTotal = totals.slice(-1)[0];
  return lastTotal.month === lastMonth
    ? {
        stars: lastTotal.count,
        month: lastMonth,
      }
    : null;
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

function getPrevMonth(month: string) {
  const date = month ? new Date(month) : new Date();
  date.setUTCMonth(date.getUTCMonth() - 1, 1);
  return date.toISOString().slice(0, 7);
}
