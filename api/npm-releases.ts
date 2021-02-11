import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import {
  logRequest,
  initSentry,
  reportError,
  getQuarterMonthFromDate,
  getQuartersList,
} from './utils';

initSentry();

export interface NpmReleasesResponseItemT {
  month: string;
  releases: number;
}

export default (req: NowRequest, res: NowResponse): void => {
  const { pkg } = req.query;

  logRequest('npmPackageDetailed', req.query);

  if (!pkg || typeof pkg !== 'string') {
    console.error('API NPM PACKAGE DETAILED: Wrong pkg parameter');
    reportError(new Error('API NPM PACKAGE DETAILED: Wrong pkg parameter'));
    res.status(400).json({ error: 'Wrong pkg parameter' });
    return;
  }

  axios
    .get(`https://registry.npmjs.com/${encodeURIComponent(pkg)}`)
    .then(({ data }) => {
      const { time } = data;
      const quarterToReleasesCountMap: Record<string, number> = {};

      Object.entries(time)
        // filter out beta and rc releases
        .filter((item) => /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(item[0]))
        .map(([, date]) => getQuarterMonthFromDate(date as string))
        .forEach((quarter) => {
          if (!quarterToReleasesCountMap[quarter]) {
            quarterToReleasesCountMap[quarter] = 0;
          }
          quarterToReleasesCountMap[quarter]++;
        });

      const quartersList = getQuartersList();
      const quartersReleasesList = quartersList.map((quarter) => ({
        month: quarter,
        releases: quarterToReleasesCountMap[quarter] || 0,
      }));

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(quartersReleasesList);
    })
    .catch((e) => {
      console.error('API NPM PACKAGE DETAILED: ', e);
      reportError(e);

      if (e.response && e.response.status === 404) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }

      res
        .status((e.response && e.response.status) || 500)
        .json({ error: 'Something went wrong' });
    });
};
