import { AxiosError } from 'axios';
// import * as Sentry from '@sentry/vue';
// TODO: SENTRY

export function reportSentry(
  err: AxiosError<{ error?: string }>,
  methodName: string
): void {
  err.name = `UI API (${methodName})`;

  // Sentry.captureException(err, {
  //   tags: {
  //     apiResponseMessage: err.response?.data?.error || '',
  //     apiRequestUrl: err.config?.url || '',
  //   },
  // });
}
