import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import {
  logRequest,
  initSentry,
  reportError,
  getQuartersList,
  getQuarterMonthFromDate,
} from './utils';
import { ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING } from '../src/constants';

initSentry();

const token = process.env.GITHUB_MOIVA_REST;

export interface GithubContributorsResponseItemT {
  month: string;
  contributors: number;
}

// Response Item per Contributor
interface ResponseItemT {
  author: {
    login: string;
    type: string;
  };
  total: number; // Total number of commits
  weeks: {
    w: number; // Week
    a: number; // Number of additions
    d: number; // Number of deletions
    c: number; // Number of commits
  }[];
}

export default (req: NowRequest, res: NowResponse): void => {
  const { name, owner } = req.query;

  logRequest('githubContributors', req.query);

  if (
    !name ||
    !owner ||
    typeof name !== 'string' ||
    typeof owner !== 'string'
  ) {
    reportError(new Error('API GITHUB CONTRIBUTORS: Wrong parameters'));
    res.status(400).json({ error: 'Wrong parameters' });
    return;
  }

  // https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-all-contributor-commit-activity
  axios
    .get<ResponseItemT[]>(
      `https://api.github.com/repos/${owner}/${name}/stats/contributors`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`,
        },
      }
    )
    .then(({ data: contributors, status }) => {
      if (status === 202) {
        console.error(
          `API GITHUB CONTRIBUTORS: repo ${owner}/${name} is not ready - status 202`
        );

        res.status(500).json({
          error: {
            message: 'Package needs to be processed by Github. Check later',
            code: ERROR_CODE_GITHUB_CONTRIBUTORS_NEEDS_PROCESSING,
          },
        });

        return;
      }

      const startDate = new Date('2016-10-01');
      const quarterMonthsToContributorsMap = {} as Record<string, Set<string>>;

      (contributors as ResponseItemT[]).forEach(({ author, weeks }) => {
        weeks.forEach(({ w, c }) => {
          if (new Date(w * 1000) < startDate) {
            return;
          }
          const quarterMonth = getQuarterMonthFromDate(w * 1000);
          if (!c) {
            return;
          }
          if (!quarterMonthsToContributorsMap[quarterMonth]) {
            quarterMonthsToContributorsMap[quarterMonth] = new Set();
          }
          quarterMonthsToContributorsMap[quarterMonth].add(author.login);
        });
      });

      // Fill the gaps (young repos can miss data for first years)
      const quartersList = getQuartersList();
      const quartersContributorsList = quartersList.map((quarter) => ({
        month: quarter,
        contributors:
          (quarterMonthsToContributorsMap[quarter] &&
            quarterMonthsToContributorsMap[quarter].size) ||
          0,
      }));

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=432000'); // 5 days - 3600*24*5
      res.status(200).json(quartersContributorsList);
    })
    .catch((e) => {
      console.error('API GITHUB CONTRIBUTORS: ', e);
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
