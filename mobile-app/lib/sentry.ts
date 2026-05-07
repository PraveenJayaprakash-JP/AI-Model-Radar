import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV !== "development",
});

export const captureError = (error: Error) => {
  Sentry.captureException(error);
};