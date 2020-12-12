import { NowRequest, NowResponse } from '@vercel/node';
import { libsToKeywordMap } from '../google-trends.config';
import googleTrends from 'google-trends-api';
import { logRequest } from './utils';

export default (req: NowRequest, res: NowResponse): void => {
  logRequest('googleTrends', req.query);

  const { libs } = req.query;

  // Check if libs parameter is there
  if (!libs || typeof libs !== 'string') {
    res.status(400).json({ error: 'Wrong libs parameter' });
    return;
  }

  const keywords = libs.split(',').map((lib) => libsToKeywordMap[lib]);
  const filteredKeywords = keywords.filter((keyword) => !!keyword);

  // Checck if correct value was passed
  if (
    !filteredKeywords.length ||
    filteredKeywords.length > 5 ||
    filteredKeywords.length !== keywords.length
  ) {
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
    .catch(() => {
      res.status(500).json({ error: 'Something went wrong' });
    });
};
