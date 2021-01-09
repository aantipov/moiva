import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

const token = process.env.GITHUB_MOIVA_REST;

export interface GithubCommitsResponseItemT {
  total: number;
  week: number;
}

export type GithubCommitsResponseT = GithubCommitsResponseItemT[];

export default (req: NowRequest, res: NowResponse): void => {
  const { name, owner } = req.query;

  logRequest('githubCommits', req.query);

  if (
    !name ||
    !owner ||
    typeof name !== 'string' ||
    typeof owner !== 'string'
  ) {
    reportError(new Error('API GITHUB COMMITS: Wrong parameters'));
    res.status(400).json({ error: 'Wrong parameters' });
    return;
  }

  // https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-the-last-year-of-commit-activity
  axios
    .get<GithubCommitsResponseItemT[]>(
      `https://api.github.com/repos/${owner}/${name}/stats/commit_activity`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`,
        },
      }
    )
    .then(({ data }) => {
      if (!data.map) {
        console.log('DATA', data);
      }
      const stripedData = data.map(({ total, week }) => ({
        total,
        week,
      }));

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(stripedData);
    })
    .catch((e) => {
      console.error('API GITHUB COMMITS: ', e);
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
