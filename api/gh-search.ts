import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

/**
 * Search for Repositories
 *
 */

export default (req: NowRequest, res: NowResponse): void => {
  const skey = process.env.GITHUB_API_KEY;
  const url = 'https://api.github.com/graphql';
  const { q } = req.query;

  logRequest('github', req.query);

  if (!q || typeof q !== 'string') {
    reportError(new Error('API GITHUB SEARCH: Wrong parameters'));
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
            search(first: 20, query: "${q}", type: REPOSITORY) {
              nodes {
                ...comparisonFields
              }
              repositoryCount
            }
            rateLimit {
              limit
              cost
              remaining
              resetAt
            }
          }
          fragment comparisonFields on Repository {
            repoId: nameWithOwner
            description
            updatedAt
            isArchived
            stars: stargazerCount
          }
      `,
      },
      { headers: { Authorization: `Bearer ${skey}` } }
    )
    .then((resp) => {
      const { errors, data } = resp.data;

      if (errors) {
        console.error(`API GITHUB SEARCH: (q: ${q})`, errors);
        reportError(errors);
        res.status(500).json({ errors: resp.data.errors });

        return;
      }

      const { search, rateLimit } = data;
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');

      console.log('RateLimit', rateLimit);
      res.status(200).json({ items: search.nodes });
    })
    .catch((e) => {
      console.error(`API GITHUB SEARCH: (q: ${q})`, e);
      reportError(e);
      res
        .status((e.response && (e.response.code || e.response.status)) || 500)
        .json({ error: 'Something went wrong' });
    });
};
