import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import config from '../apps-config';

export default (req: NowRequest, res: NowResponse): void => {
  const skey = process.env.GITHUB_API_KEY;
  const url = 'https://api.github.com/graphql';
  const app = config.find((appConfig) => appConfig.name === req.query.app);

  if (!app) {
    res.status(400).json({ error: 'Wrong app parameter' });
    return;
  }

  const githubConfig = app.github;

  axios
    .post(
      url,
      {
        operationName: null,
        variables: {},
        query: `
        {
          repository(name: "${githubConfig.name}", owner: "${githubConfig.owner}") {
            description
            stars: stargazerCount
            createdAt
            openPRs: pullRequests(states: [OPEN]) {
              totalCount
            }
            mergedPRs: pullRequests(states: [MERGED]) {
              totalCount
            }
            closedPRs: pullRequests(states: [CLOSED]) {
              totalCount
            }
            openIssues: issues(filterBy: { states: [OPEN] }) {
              totalCount
            }
            closedIssues: issues(filterBy: { states: [CLOSED] }) {
              totalCount
            }
          }
        }
      `,
      },
      {
        headers: {
          Authorization: `Bearer ${skey}`,
        },
      }
    )
    .then((resp) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=43200');
      res.status(200).json(resp.data.data.repository);
    })
    .catch(() => {
      res.status(500).json({ error: 'Something went wrong' });
    });
};
