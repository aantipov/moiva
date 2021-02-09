import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';
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

      function getQuaterMonthFromWeek(week: number): string {
        const monthToQuarter = {
          '01': '03',
          '02': '03',
          '03': '03',
          '04': '06',
          '05': '06',
          '06': '06',
          '07': '09',
          '08': '09',
          '09': '09',
          '10': '12',
          '11': '12',
          '12': '12',
        } as Record<string, string>;
        const month = new Date(week * 1000).toISOString().slice(0, 7);
        const quaterMonthNumber = monthToQuarter[month.slice(-2)];
        const quaterMonth = month.slice(0, -2) + quaterMonthNumber;
        return quaterMonth;
      }

      const quaterMonthsToContributorsMap = {} as Record<string, Set<string>>;

      (contributors as ResponseItemT[]).forEach(({ author, weeks }) => {
        weeks.forEach(({ w, c }) => {
          if (new Date(w * 1000) < startDate) {
            return;
          }
          const quaterMonth = getQuaterMonthFromWeek(w);
          if (!c) {
            return;
          }
          if (!quaterMonthsToContributorsMap[quaterMonth]) {
            quaterMonthsToContributorsMap[quaterMonth] = new Set();
          }
          quaterMonthsToContributorsMap[quaterMonth].add(author.login);
        });
      });

      const val = Object.entries(quaterMonthsToContributorsMap)
        .map(([month, contributorsSet]) => ({
          month,
          contributors: contributorsSet.size,
        }))
        .sort((a, b) => {
          if (a.month < b.month) {
            return -1;
          }
          if (a.month > b.month) {
            return 1;
          }
          return 0;
        })
        // Don't include last incomplete quater
        .slice(0, -1);

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=432000'); // 5 days - 3600*24*5
      res.status(200).json(val);
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
