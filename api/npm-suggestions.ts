import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';
import { NpmSuggestionResponseT, LibraryT } from '../src/apis';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const { q } = req.query;

  logRequest('npmSuggestion', req.query);

  if (!q || typeof q !== 'string') {
    reportError(new Error('API NPM-SUGGESTIONS: Wrong lib parameter'));
    res.status(400).json({ error: 'Wrong q parameter' });
    return;
  }

  axios
    .get(`https://www.npmjs.com/search/suggestions?q=${q}`)
    // @ts-ignore
    .then((resp) => {
      const suggestions = resp.data as NpmSuggestionResponseT[];
      return suggestions.map((packageObj) => {
        return {
          // @ts-ignore
          name: packageObj.name,
          // @ts-ignore
          description: packageObj.description,
          // @ts-ignore
          repo: packageObj.links.repository,
          // @ts-ignore
          version: packageObj.version,
        } as LibraryT;
      });
    })
    .then((data) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(data);
    })
    .catch((err) => {
      // err.response.status,
      // err.response.data.code,
      // err.response.data.message
      console.error('ERROR', err);
      reportError(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
