import axios from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';

export interface NpmDownloadT {
  downloads: number;
  month: string;
}

export const cacheR = reactive(new Map<string, NpmDownloadT[] | null>());

export function fetchNpmDownloads(
  libName: string
): Promise<NpmDownloadT[] | null> {
  if (cacheR.get(libName)) {
    return Promise.resolve(cacheR.get(libName) as NpmDownloadT[]);
  }

  return axios
    .get<{ items: NpmDownloadT[] }>(
      `https://npm-downloads.moiva.workers.dev/?pkg=${libName}`
    )
    .then(({ data }) => {
      const dataWOLastMonth = data.items.slice(0, -1);
      cacheR.set(libName, dataWOLastMonth);
      return dataWOLastMonth;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmDownloads');

      cacheR.set(libName, null);
      return null;
    });
}
