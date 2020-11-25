import * as faunadb from 'faunadb';

export function logRequest(type: 'npm' | 'github', urlQuery: unknown): void {
  const skey = process.env.FAUNA_DB;
  const { VERCEL_ENV, VERCEL_REGION } = process.env;

  if (VERCEL_ENV === 'development') {
    return;
  }

  const serverClient = new faunadb.Client({ secret: skey });
  const q = faunadb.query;
  const now = new Date();
  const ts = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}--${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  serverClient
    .query(
      q.Create(q.Collection('api_calls_logs'), {
        data: {
          type,
          env: VERCEL_ENV,
          ts,
          region: VERCEL_REGION,
          urlQuery: JSON.stringify(urlQuery),
        },
      })
    )
    .catch(console.error);
}
