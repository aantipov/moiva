import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

export interface NpmPackagedDetailsResponseT {
  count: number;
  versions: [string, string][];
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

      const versions: [string, string][] = Object.entries(time)
        .filter((item) => /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(item[0]))
        .map((item) => [item[0], (item[1] as string).slice(0, 4)]);

      const result: NpmPackagedDetailsResponseT = {
        count: versions.length,
        versions,
      };

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(result);
    })
    .catch((e) => {
      console.error('API NPM PACKAGE DETAILED: ', e);
      reportError(e);

      if (e.response && e.response.status === 404) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }

      res.status(500).json({ error: 'Something went wrong' });
    });
};
