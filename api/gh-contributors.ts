import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

const token = process.env.GITHUB_MOIVA_REST;

export interface GithubContributorsResponseItemT {
  author: string;
  commits: number;
  years: {
    year: number;
    additions: number;
    deletions: number;
    commits: number;
  }[];
}

// Response Item per Contributor
export interface ResponseItemT {
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
    .then(({ data: contributors, headers }) => {
      const aggregatedData: GithubContributorsResponseItemT[] = (contributors as ResponseItemT[]).map(
        ({ author, total, weeks }) => {
          const currentYear = new Date().getFullYear();
          const yearsObj = {} as Record<
            string,
            { additions: number; deletions: number; commits: number }
          >;
          let year = 2017;
          while (year <= currentYear) {
            yearsObj[year] = { additions: 0, deletions: 0, commits: 0 };
            year++;
          }
          weeks.forEach(({ w, a, d, c }) => {
            const year = new Date(w * 1000).getFullYear();
            if (yearsObj[year]) {
              yearsObj[year].additions += a;
              yearsObj[year].deletions += d;
              yearsObj[year].commits += c;
            }
          });

          return {
            author: author.login,
            commits: total,
            years: Object.entries(yearsObj)
              .map(([year, item]) => ({
                year: Number(year),
                ...item,
              }))
              .sort((c1, c2) => c1.year - c2.year),
          };
        }
      );

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(aggregatedData);
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
