import { NowRequest, NowResponse } from '@vercel/node';
import { repoToGTrendDefMap } from '../google-trends.config';
import googleTrends from 'google-trends-api';
import { logRequest, initSentry, reportError } from './utils';

const ttl = 3600 * 24 * 5; // 5 days in seconds
const defaultStartDateStr = '2017-01-01';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const defaultStartDate = new Date(defaultStartDateStr);
  const today = new Date();
  let startDate = defaultStartDate;
  const { libs: repos, start } = req.query;

  logRequest('googleTrends', req.query);

  // Validate start parameter
  if (start) {
    const customStartDdate = new Date(start as string);

    if (
      isNaN(customStartDdate.getTime()) ||
      customStartDdate < defaultStartDate ||
      customStartDdate >= today
    ) {
      console.error('API GOOGLE TRENDS 1-0: Wrong start parameter', repos);
      reportError(new Error('API GOOGLE TRENDS 1-0: Wrong start parameter'));
      res
        .status(400)
        .json({ error: 'Wrong start parameter', code: 'GOOGLE_TENDS_API_1-0' });
      return;
    }

    startDate = customStartDdate;
  }

  // Make sure the parameter is there
  if (!repos || typeof repos !== 'string') {
    console.error('API GOOGLE TRENDS 1: Wrong libs parameter', repos);
    reportError(new Error('API GOOGLE TRENDS 1: Wrong libs parameter'));
    res
      .status(400)
      .json({ error: 'Wrong libs parameter', code: 'GOOGLE_TENDS_API_1' });
    return;
  }

  const reposIds = repos.split(',').map((repoId) => repoId.toLowerCase());

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
      startTime: startDate,
      category: 31, // Programming
    })
    .then((results: string) => {
      res.setHeader('Cache-Control', `max-age=0, s-maxage=${ttl}`);
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
