import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

interface ResponseItemT {
  name: string;
  description: string;
  links: {
    repository: string;
  };
  version: string;
}

export default (req: NowRequest, res: NowResponse): void => {
  const { q } = req.query;

  logRequest('npmSuggestion', req.query);

  if (!q || typeof q !== 'string') {
    console.error('API NPM SUGGESTIONS: Wrong lib parameter');
    reportError(new Error('API NPM SUGGESTIONS: Wrong lib parameter'));
    res.status(400).json({ error: 'Wrong q parameter' });
    return;
  }

  axios
    .get<ResponseItemT[]>(`https://www.npmjs.com/search/suggestions?q=${q}`)
    .then((resp) => {
      const suggestions = resp.data;
      return suggestions.map((packageObj) => {
        return {
          name: packageObj.name,
          description: packageObj.description,
          version: packageObj.version,
        } as ResponseItemT;
      });
    })
    .then((data) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(data);
    })
    .catch((e) => {
      console.error('API NPM SUGGESTIONS', e);
      reportError(e);

      res
        .status((e.response && e.response.status) || 500)
        .json({ error: 'Something went wrong' });
    });
};
