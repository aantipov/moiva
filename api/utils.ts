import * as faunadb from 'faunadb';

export function logRequest(
  type: 'npm' | 'github' | 'googleTrends',
  urlQuery: unknown
): void {
  const skey = process.env.FAUNA_DB;
  const { VERCEL_ENV, VERCEL_REGION } = process.env;

  if (VERCEL_ENV === 'development') {
    return;
  }

  const serverClient = new faunadb.Client({ secret: skey });
  const q = faunadb.query;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const ts = `${year}-${month}-${day}--${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  serverClient
    .query(
      q.Create(q.Collection('api_calls_logs'), {
        data: {
          ts,
          env: VERCEL_ENV,
          type,
          urlQuery: JSON.stringify(urlQuery),
          region: VERCEL_REGION,
        },
      })
    )
    .catch(console.error);
}
