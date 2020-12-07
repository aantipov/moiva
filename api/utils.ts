import * as faunadb from 'faunadb';

export function logRequest(
  type: 'npm' | 'github' | 'googleTrends' | 'bundlephobia',
  urlQuery: unknown
): void {
  const skey = process.env.FAUNA_DB;
  const { VERCEL_ENV, VERCEL_REGION } = process.env;

  if (VERCEL_ENV === 'development') {
    return;
  }

  const serverClient = new faunadb.Client({ secret: skey });
  const q = faunadb.query;
  const date = new Date().toISOString();

  serverClient
    .query(
      q.Create(q.Collection('api_calls_logs'), {
        data: {
          date: date.slice(0, 10),
          time: date.slice(11, 19),
          env: VERCEL_ENV,
          type,
          urlQuery: JSON.stringify(urlQuery),
          region: VERCEL_REGION,
        },
      })
    )
    .catch(console.error);
}
