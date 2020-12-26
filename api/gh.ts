import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const skey = process.env.GITHUB_API_KEY;
  const url = 'https://api.github.com/graphql';
  const { name, owner, package: npmPackage } = req.query;

  logRequest('github', req.query);

  if (
    !name ||
    !owner ||
    !npmPackage ||
    typeof name !== 'string' ||
    typeof owner !== 'string' ||
    typeof npmPackage !== 'string'
  ) {
    reportError(new Error('API GITHUB: Wrong parameters'));
    res.status(400).json({ error: 'Wrong parameters' });
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
          securityVulnerabilities(package: "${npmPackage}", first: 20) {
            totalCount
          }
          repository(name: "${name}", owner: "${owner}") {
            description
            stars: stargazerCount
            createdAt
            vulnerabilityAlerts {
              totalCount
            }
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
      const { repository, securityVulnerabilities } = resp.data.data;
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json({
        ...repository,
        vulnerabilitiesCount: securityVulnerabilities.totalCount,
      });
    })
    .catch((e) => {
      reportError(e);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
