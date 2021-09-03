import axios from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';

export interface NpmPackageReleasesT {
  month: string;
  releases: number;
}

export const cacheR = reactive(new Map<string, NpmPackageReleasesT[] | null>());
export const creationDatesCacheR = reactive(new Map<string, string | null>());

export function fetchNpmPackageReleases(
  pkg: string
): Promise<NpmPackageReleasesT[] | null> {
  if (cacheR.get(pkg)) {
    return Promise.resolve(cacheR.get(pkg) as NpmPackageReleasesT[]);
  }

  return axios
    .get<{ items: NpmPackageReleasesT[]; created?: string }>(
      `https://npm-releases.moiva.workers.dev/?pkg=${pkg}`
    )
    .then(({ data }) => {
      cacheR.set(pkg, data.items);
      creationDatesCacheR.set(pkg, data.created || null);

      return data.items;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmPackageReleases');

      cacheR.set(pkg, null);
      creationDatesCacheR.set(pkg, null);
      return null;
    });
}
