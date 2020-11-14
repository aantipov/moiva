import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';

export default async (req: NowRequest, res: NowResponse) => {
  const skey = process.env.GITHUB_API_KEY;
  const url = 'https://api.github.com/graphql';
  const config = {
    vue: {name: 'vue', owner: 'vuejs'},
    react: {name: 'react', owner: 'facebook'},
  }
  const app = config[req.query.app as string];

  axios
    .post(
      url,
      {
        operationName: null,
        variables: {},
        query: `
        {
          repository(name: "${app.name}", owner: "${app.owner}") {
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
    });
};
