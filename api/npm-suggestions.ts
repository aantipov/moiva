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
    .get(`https://registry.npmjs.com/-/v1/search?text=${q}`)
    // @ts-ignore
    .then((resp) => {
      const suggestions = resp.data.objects as NpmSuggestionResponseT[];
      const data = suggestions
        .filter((lib) => !!lib.package.links.repository)
        .map(({ package: packageObj }) => {
          const repoParts = (packageObj.links.repository || '').split('/');

          return {
            name: packageObj.name,
            description: packageObj.description,
            githubOwner: repoParts[3] || null,
            githubName: repoParts[4] || null,
            package: packageObj,
          } as LibraryT;
        });

      return data;
    })
    .then((data) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(data);
    })
    .catch((err) => {
      // err.response.status,
      // err.response.data.code,
      // err.response.data.message
      reportError(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
