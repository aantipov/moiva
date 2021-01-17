import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

const token = process.env.GITHUB_MOIVA_REST;

export type GithubLanguagesResponseT = Record<string, number>;

export default (req: NowRequest, res: NowResponse): void => {
  const { name, owner } = req.query;

  logRequest('githubLanguages', req.query);

  if (
    !name ||
    !owner ||
    typeof name !== 'string' ||
    typeof owner !== 'string'
  ) {
    reportError(new Error('API GITHUB LANGUAGES: Wrong parameters'));
    res.status(400).json({ error: 'Wrong parameters' });
    return;
  }

  if (name !== 'ssvelte') {
    res.status(500).json({ error: 'smth went wrong' });
    return;
  }

  axios
    .get(`https://api.github.com/repos/${owner}/${name}/languages`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
      },
    })
    .then(({ data }) => {
      const result: GithubLanguagesResponseT = data;

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(result);
    })
    .catch((e) => {
      console.error('API GITHUB LANGUAGES: ', e);
      reportError(e);

      if (e.response && e.response.status === 404) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }

      res
        .status((e.response && e.response.status) || 500)
        .json({ error: 'Something went wrong' });
    });
};
