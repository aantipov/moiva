import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';
import { SuggestionT } from '../src/apis';

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
    console.error('API NPM-SUGGESTIONS: Wrong lib parameter');
    reportError(new Error('API NPM-SUGGESTIONS: Wrong lib parameter'));
    res.status(400).json({ error: 'Wrong q parameter' });
    return;
  }

  axios
    .get(`https://www.npmjs.com/search/suggestions?q=${q}`)
    .then((resp) => {
      const suggestions = resp.data as ResponseItemT[];
      return suggestions.map((packageObj) => {
        return {
          name: packageObj.name,
          description: packageObj.description,
          version: packageObj.version,
        } as SuggestionT;
      });
    })
    .then((data) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error('ERROR', err);
      reportError(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
