import { AxiosError } from 'axios';
import * as Sentry from '@sentry/browser';

export type GithubLanguagesResponseT = Record<string, number>;

export function reportSentry(err: AxiosError, methodName: string): void {
  err.name = `UI API (${methodName})`;

  Sentry.captureException(err, {
    tags: {
      apiResponseMessage: err.response?.data?.error || '',
      apiRequestUrl: err.config?.url || '',
    },
  });
}
