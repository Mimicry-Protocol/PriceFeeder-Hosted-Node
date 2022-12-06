import * as Sentry from '@sentry/node';

const hasSentry = !!process.env.SENTRY_URL;

if (process.env.SENTRY_URL) {
  Sentry.init({
    dsn: process.env.SENTRY_URL,
    serverName: 'testnet-price-provider',
    tracesSampleRate: 1.0,
  });
}

type CaptureExceptionArgs = Parameters<typeof Sentry.captureException>;

export const logger = {
  error: hasSentry
    ? Sentry.captureException
    : (...args: CaptureExceptionArgs) => {
        console.error(...args);
      },
};
