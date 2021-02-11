// import * as faunadb from 'faunadb';
import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';
//
export interface ErrorT {
  error: {
    message: string;
    code?: string;
  };
  errors?: unknown[];
}

export function logRequest(type: string, urlQuery: unknown): void {
  // type:
  //   | 'npmDownloads'
  //   | 'github'
  //   | 'githubLanguages'
  //   | 'githubCommits'
  //   | 'githubContributors'
  //   | 'googleTrends'
  //   | 'bundlephobia'
  //   | 'npmSuggestion'
  //   | 'npmPackage'
  //   | 'npmPackageDetailed',
  // urlQuery: unknown
  //
  // Do nothing until we come up with a good solution
  return;
  // const skey = process.env.FAUNA_DB as string;
  // const { VERCEL_ENV, VERCEL_REGION } = process.env;
  //
  // if (VERCEL_ENV !== 'make-exression-falsy') {
  //   return;
  // }
  //
  // const serverClient = new faunadb.Client({ secret: skey });
  // const q = faunadb.query;
  // const date = new Date().toISOString();
  //
  // serverClient
  //   .query(
  //     q.Create(q.Collection('api_calls_logs'), {
  //       data: {
  //         date: date.slice(0, 10),
  //         time: date.slice(11, 19),
  //         env: VERCEL_ENV,
  //         type,
  //         urlQuery: JSON.stringify(urlQuery),
  //         region: VERCEL_REGION,
  //       },
  //     })
  //   )
  //   .catch(console.error);
}

export function initSentry(): void {
  Sentry.init({
    dsn:
      'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

export function reportError(e: unknown): void {
  Sentry.captureException(e);
}

export function getQuarterMonthFromDate(date: number | string): string {
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
  const month = new Date(date).toISOString().slice(0, 7);
  const quarterMonthNumber = monthToQuarter[month.slice(-2)];
  const quarterMonth = month.slice(0, -2) + quarterMonthNumber; // e.g. 2020-09
  return quarterMonth;
}

export function getQuartersList(): string[] {
  const startDate = new Date('2016-10-01');
  const lastQuarter = getQuarterMonthFromDate(Date.now());
  const eightyDaysInMs = 1000 * 3600 * 24 * 80;
  const quarters = new Set() as Set<string>;
  let timestamp = startDate.getTime();
  let quarter = getQuarterMonthFromDate(timestamp);

  while (quarter !== lastQuarter) {
    quarters.add(quarter);
    timestamp += eightyDaysInMs;
    quarter = getQuarterMonthFromDate(timestamp);
  }

  return [...quarters];
}
