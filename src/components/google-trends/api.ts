import axios from 'axios';
import { reportSentry } from '@/apis';
import { reactive } from 'vue';

interface GTrendPointT {
  time: string;
  value: number[];
}

export interface GTrendsResponseT {
  averages: number[];
  timelineData: GTrendPointT[];
}

export interface LibGTrendsT {
  average: number;
  timeline: {
    time: string;
    value: number;
  }[];
}

export const cacheR = reactive(new Map<string, LibGTrendsT>());

const gTrendsCache = new Map();
export function fetchGTrendsData(
  reposIds: string[]
): Promise<GTrendsResponseT> {
  const libsStr = reposIds.join(',');

  if (gTrendsCache.get(libsStr)) {
    return Promise.resolve(gTrendsCache.get(libsStr));
  }

  return axios
    .get<GTrendsResponseT>(
      `https://google-trends.moiva.workers.dev/?libs=${libsStr}`
    )
    .then(({ data }) => {
      gTrendsCache.set(libsStr, data);
      cacheR.clear();
      reposIds.forEach((repoId, index) => {
        const average = data.averages[index];
        const timeline = data.timelineData.map(({ time, value }) => ({
          time,
          value: value[index],
        }));
        cacheR.set(repoId, { average, timeline });
      });
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGTrendsData');
      return Promise.reject(err);
    });
}
