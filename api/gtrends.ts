import { NowRequest, NowResponse } from '@vercel/node';
import config from '../apps-config';
import googleTrends from 'google-trends-api';
import { logRequest } from './utils';

export default (req: NowRequest, res: NowResponse): void => {
  logRequest('googleTrends', req.query);

  if (!req.query.apps || typeof req.query.apps !== 'string') {
    res.status(400).json({ error: 'Wrong apps parameter' });
    return;
  }

  const appsConfigs = req.query.apps
    .split(',')
    .map((reqApp) => config.find((appConfig) => appConfig.name === reqApp));

  if (
    appsConfigs.filter((appConfig) => !appConfig).length ||
    appsConfigs.length > 5
  ) {
    res.status(400).json({ error: 'Wrong app parameter' });
    return;
  }

  const gKeywords = appsConfigs.map(({ gTrend: { keyword } }) => keyword);

  googleTrends
    .interestOverTime({
      keyword: gKeywords,
      startTime: new Date('2017-01-01'),
      category: 31, // Programming
    })
    .then((results: string) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=43200');
      res.status(200).json(JSON.parse(results));
    })
    .catch(() => {
      res.status(500).json({ error: 'Something went wrong' });
    });
};
