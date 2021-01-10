import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';
import { RepoT } from '../src/apis';

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

  // 'Type: Bug' - React; 'triage: bug' - Svelte; 'type: bug/fix' - Angular; 'Bug-fix' - Moment; 'issue: bug' - Luxon
  // '☢️Bug' - Dayjs; '🐜 Bug fix' & '🐛 Bug' - date-fns; 'type: bug' - chart.js; 'P2-bug' - Playwright
  // 'type: bug :sob:' - nestjs/nest
  const bugLabels =
    'labels: ["bug", "Bug", "Type: Bug", "triage: bug", "type: bug/fix", "Bug-fix", "issue: bug", "☢️Bug", "🐜 Bug fix", "🐛 Bug", "type: bug", "P2-bug", "type: bug :sob:"]';
  const halfAYearAgo = new Date(Date.now() - 1000 * 3600 * 24 * 183);
  const since = `since: "${halfAYearAgo.toISOString()}"`;

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
            openIssues: issues(filterBy: { states: [OPEN], ${since} }) {
              totalCount
            }
            openBugIssues: issues(filterBy: { states: [OPEN], ${since}, ${bugLabels} }) {
              totalCount
            }
            closedIssues: issues(filterBy: { states: [CLOSED], ${since} }) {
              totalCount
            }
            closedBugIssues: issues(filterBy: { states: [CLOSED], ${since}, ${bugLabels} }) {
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
      } as RepoT);
    })
    .catch((e) => {
      reportError(e);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
