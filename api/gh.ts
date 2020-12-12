import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest } from './utils';

export default (req: NowRequest, res: NowResponse): void => {
  const skey = process.env.GITHUB_API_KEY;
  const url = 'https://api.github.com/graphql';
  const { name, owner } = req.query;

  logRequest('github', req.query);

  if (!name || !owner) {
    res.status(400).json({ error: 'Wrong app parameter' });
    return;
  }

  axios
    .post(
      url,
      {
        operationName: null,
        variables: {},
        query: `
        {
          repository(name: "${name}", owner: "${owner}") {
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
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(resp.data.data.repository);
    })
    .catch(() => {
      res.status(500).json({ error: 'Something went wrong' });
    });
};
