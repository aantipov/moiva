// import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';
//

// TODO: SENTRY

export interface ErrorT {
  error: {
    message: string;
    code?: string;
  };
  errors?: unknown[];
}

export function initSentry(): void {
  // Sentry.init({
  //   dsn: 'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
  //   environment: process.env.NODE_ENV,
  //   tracesSampleRate: 1.0,
  // });
}

export function reportError(e: unknown): void {
  // Sentry.captureException(e);
}
