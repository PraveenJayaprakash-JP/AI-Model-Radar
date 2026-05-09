import { ErrorBoundary } from "react-error-boundary";
import { captureError } from "../lib/sentry";
import { View, Text, Button } from "react-native";
import { getTheme } from "../lib/theme";
import { useFilters } from "../stores/useFilters";
import { spacing, radius, typography } from "../lib/tokens";
import React from "react";

function ScreenErrorFallback({ error, resetErrorBoundary }: any) {
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.lg,
      backgroundColor: currentTheme.background,
    }}>
      <Text style={{
        fontSize: typography.heading.fontSize,
        fontWeight: typography.heading.fontWeight,
        color: currentTheme.text,
        marginBottom: spacing.sm,
      }}>
        Screen Error
      </Text>
      <Text style={{
        fontSize: typography.body.fontSize,
        color: currentTheme.textSecondary,
        textAlign: "center",
        marginBottom: spacing.lg,
      }}>
        {error?.message || "Something went wrong loading this screen."}
      </Text>
      <Button title="Retry" onPress={resetErrorBoundary} />
    </View>
  );
}

export default function withErrorBoundary(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    return (
      <ErrorBoundary
        FallbackComponent={ScreenErrorFallback}
        onError={captureError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
