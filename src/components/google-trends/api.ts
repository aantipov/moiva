import axios from 'axios';
import { reportSentry } from '@/apis';

interface GTrendPointT {
  time: number;
  value: number[];
}

export interface GTrendsResponseT {
  averages: number[];
  timelineData: GTrendPointT[];
}
const gTrendsCache = new Map();
export function fetchGTrendsData(libs: string[]): Promise<GTrendsResponseT> {
  const libsStr = libs.join(',');

  if (gTrendsCache.get(libsStr)) {
    return Promise.resolve(gTrendsCache.get(libsStr));
  }

  return axios
    .get(`https://google-trends.moiva.workers.dev/?libs=${libsStr}`)
    .then(({ data }) => {
      gTrendsCache.set(libsStr, data);
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGTrendsData');
      return Promise.reject(err);
    });
}
