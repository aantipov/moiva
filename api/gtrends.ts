import { NowRequest, NowResponse } from '@vercel/node';
import { libsToKeywordMap } from '../google-trends.config';
import googleTrends from 'google-trends-api';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const { libs } = req.query;

  logRequest('googleTrends', req.query);

  // Check if libs parameter is there
  if (!libs || typeof libs !== 'string') {
    reportError(new Error('API GOOGLE TRENDS: Wrong libs parameter'));
    res.status(400).json({ error: 'Wrong libs parameter' });
    return;
  }

  const keywords = libs.split(',').map((lib) => libsToKeywordMap[lib] || lib);
  const filteredKeywords = keywords.filter((keyword) => !!keyword);

  // Checck if correct value was passed
  if (
    !filteredKeywords.length ||
    filteredKeywords.length > 5 ||
    filteredKeywords.length !== keywords.length
  ) {
    reportError(new Error('API GOOGLE TRENDS: Wrong libs parameter'));
    res.status(400).json({ error: 'Wrong libs parameter' });
    return;
  }

  googleTrends
    .interestOverTime({
      keyword: filteredKeywords,
      startTime: new Date('2017-01-01'),
      category: 31, // Programming
    })
    .then((results: string) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(JSON.parse(results));
    })
    .catch((e) => {
      console.error('API GOOGLE TRENDS: ', e);
      reportError(e);

      res
        .status((e.response && e.response.status) || 500)
        .json({ error: 'Something went wrong' });
    });
};
