import axios from 'axios';
import { reportSentry } from '@/apis';

export interface NpmPackageReleasesT {
  month: string;
  releases: number;
}

const cache = new Map();
export const creationDatesCache = new Map();

export function fetchNpmPackageReleases(
  pkg: string
): Promise<NpmPackageReleasesT[] | null> {
  if (cache.get(pkg)) {
    return Promise.resolve(cache.get(pkg));
  }

  return axios
    .get<{ items: NpmPackageReleasesT[]; created?: string }>(
      `https://npm-releases.moiva.workers.dev/?pkg=${pkg}`
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

      cache.set(pkg, items);

      if (data.created) {
        creationDatesCache.set(pkg, data.created);
      }

      return items;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmPackageReleases');

      return null;
    });
}
