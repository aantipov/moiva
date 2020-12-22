import * as faunadb from 'faunadb';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

export function logRequest(
  type:
    | 'npmDownloads'
    | 'github'
    | 'googleTrends'
    | 'bundlephobia'
    | 'npmPackage',
  urlQuery: unknown
): void {
  const skey = process.env.FAUNA_DB as string;
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

export function initSentry(): void {
  Sentry.init({
    dsn:
      'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

export function reportError(e: Error): void {
  Sentry.captureException(e);
}
