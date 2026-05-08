import * as Sentry from "@sentry/react-native";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN && SENTRY_DSN.startsWith("https://")) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    enabled: process.env.NODE_ENV !== "development",
  });
}

export const captureError = (error: Error) => {
  if (SENTRY_DSN?.startsWith("https://")) {
    Sentry.captureException(error);
  } else {
    console.warn("Sentry disabled - no valid DSN");
  }
};