import axios from 'axios';
import { reportSentry } from '@/apis';

export interface NpmReleasesResponseItemT {
  month: string;
  releases: number;
}
const cache = new Map();
export const creationDatesCache = new Map();

export type NpmPackageReleasesT = NpmReleasesResponseItemT;

export function fetchNpmPackageReleases(
  pkg: string
): Promise<NpmPackageReleasesT[] | null> {
  if (cache.get(pkg)) {
    return Promise.resolve(cache.get(pkg));
  }

  return axios
    .get<{ items: NpmReleasesResponseItemT[]; created?: string }>(
      `https://npm-releases.moiva.workers.dev/?pkg=${pkg}`
    )
    .then(({ data }) => {
      cache.set(pkg, data.items);

      if (data.created) {
        creationDatesCache.set(pkg, data.created);
      }

      return data.items;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmPackageReleases');

      return null;
    });
}
