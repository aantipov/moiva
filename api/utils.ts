import * as faunadb from 'faunadb';

export function logRequest(type: 'npm' | 'github', urlQuery: unknown): void {
  const skey = process.env.FAUNA_DB;
  const env = process.env.NODE_ENV;

  if (env === 'development') {
    return;
  }

  const serverClient = new faunadb.Client({ secret: skey });
  const q = faunadb.query;

  serverClient
    .query(
      q.Create(q.Collection('api_calls_logs'), {
        data: {
          type,
          env: process.env.NODE_ENV,
          ts: new Date().toISOString(),
          urlQuery: JSON.stringify(urlQuery),
        },
      })
    )
    .catch(console.error);
}
