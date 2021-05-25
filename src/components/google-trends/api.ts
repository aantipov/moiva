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
  average: number | null; // null in case of a single library
  timeline: {
    time: string;
    value: number;
  }[];
}

export const cacheR = reactive(new Map<string, LibGTrendsT | null>()); // null for errors

const gTrendsCache = new Map<string, GTrendsResponseT>();

export function fetchGTrendsData(
  reposIds: string[]
): Promise<GTrendsResponseT> {
  const libsStr = reposIds.join(',');

  if (gTrendsCache.get(libsStr)) {
    const data = gTrendsCache.get(libsStr) as GTrendsResponseT;
    // Populate the reactive cache
    cacheR.clear();
    reposIds.forEach((repoId, index) => {
      const average = data.averages[index];
      const timeline = data.timelineData.map(({ time, value }) => ({
        time,
        value: value[index],
      }));
      cacheR.set(repoId.toLowerCase(), { average, timeline });
    });

    return Promise.resolve(data);
  }

  cacheR.clear();

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
        cacheR.set(repoId.toLowerCase(), { average, timeline });
      });
      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGTrendsData');
      reposIds.forEach((repoId) => {
        cacheR.set(repoId.toLowerCase(), null);
      });
      return Promise.reject(err);
    });
}
