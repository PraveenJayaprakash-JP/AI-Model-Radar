import * as Sentry from "@sentry/react-native";

// TODO: Update with production Sentry DSN before app store submission
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || 'YOUR_DSN_HERE';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV !== "development",
});

export const captureError = (error: Error) => {
  Sentry.captureException(error);
};