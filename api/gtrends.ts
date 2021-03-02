import { NowRequest, NowResponse } from '@vercel/node';
import { repoToGTrendDefMap } from '../google-trends.config';
import googleTrends from 'google-trends-api';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const { libs: repos } = req.query;

  logRequest('googleTrends', req.query);

  // Make sure the parameter is there
  if (!repos || typeof repos !== 'string') {
    console.error('API GOOGLE TRENDS 1: Wrong libs parameter', repos);
    reportError(new Error('API GOOGLE TRENDS 1: Wrong libs parameter'));
    res
      .status(400)
      .json({ error: 'Wrong libs parameter', code: 'GOOGLE_TENDS_API_1' });
    return;
  }

  const reposIds = repos.split(',');

  // Make sure we have a corresponding keyword value for each repoId
  if (reposIds.some((repoId) => !repoToGTrendDefMap[repoId])) {
    console.error('API GOOGLE TRENDS 2: EXTRA LIB PROVIDED', repos);
    reportError(new Error('API GOOGLE TRENDS 2: EXTRA LIB PROVIDED'));
    res
      .status(400)
      .json({ error: 'Wrong libs parameter', code: 'GOOGLE_TENDS_API_2' });
    return;
  }

  // Make sure that the provided value doesn't exceed 5
  if (reposIds.length > 5) {
    console.error('API GOOGLE TRENDS 3: TOO MANY LIBS PROVIDED', repos);
    reportError(new Error('API GOOGLE TRENDS 3: TOO MANY LIBS PROVIDED'));
    res
      .status(400)
      .json({ error: 'Wrong libs parameter', code: 'GOOGLE_TENDS_API_3' });
    return;
  }

  const keywords = reposIds.map((repoId) => repoToGTrendDefMap[repoId].keyword);

  googleTrends
    .interestOverTime({
      keyword: keywords,
      startTime: new Date('2017-01-01'),
      category: 31, // Programming
    })
    .then((results: string) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(JSON.parse(results).default);
    })
    .catch((e) => {
      console.error('API GOOGLE TRENDS: SOMETHING WENT WRONG', e);
      reportError(e);

      res.status((e.response && e.response.status) || 500).json({
        error: 'Something went wrong',
        msg: JSON.stringify(e.message),
      });
    });
};
