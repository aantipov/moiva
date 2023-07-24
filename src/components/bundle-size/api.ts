import axios from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';
import { convertBytesToKb } from '@/utils';

interface ResponseT {
  gzip: number;
  raw: number;
}

export interface BundlephobiaT extends ResponseT {
  gzipKb: number;
  react?: ResponseT;
  reactDom?: ResponseT;
}

export const cacheR = reactive(new Map<string, BundlephobiaT | null>());

export function fetchBundlephobiaData(
  pkgName: string,
): Promise<BundlephobiaT | null> {
  if (cacheR.get(pkgName)) {
    return Promise.resolve(cacheR.get(pkgName) as BundlephobiaT);
  }

  let request;

  if (pkgName === 'react') {
    request = Promise.all([
      axios.get<ResponseT>(`https://bundle-size.moiva.workers.dev/?pkg=react`),
      axios.get<ResponseT>(
        `https://bundle-size.moiva.workers.dev/?pkg=react-dom`,
      ),
    ]).then(([reactData, reactDomData]) => ({
      gzip: reactData.data.gzip + reactDomData.data.gzip,
      raw: reactData.data.raw + reactDomData.data.raw,
      react: reactData.data,
      reactDom: reactDomData.data,
    }));
  } else {
    request = axios
      .get<ResponseT>(`https://bundle-size.moiva.workers.dev/?pkg=${pkgName}`)
      .then(({ data }) => data);
  }

  return request
    .then((data) => {
      const res = { ...data, gzipKb: convertBytesToKb(data.gzip) };
      cacheR.set(pkgName, res);
      return res;
    })
    .catch((err) => {
      const errorCode =
        err?.response?.data?.error?.code || err?.response?.status || undefined;

      // Report to Sentry unexpected errors only
      if (errorCode !== 404) {
        reportSentry(err, 'fetchBundlephobiaData');
      }

      cacheR.set(pkgName, null);
      return null;
    });
}
