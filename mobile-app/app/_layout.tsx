import { Tabs } from "expo-router";
import { PaperProvider, DarkTheme, DefaultTheme } from "react-native-paper";
import { LinkPreviewContextProvider } from "expo-router/build/link/LinkPreviewContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { captureError } from "../lib/sentry";
import { useFilters } from "../stores/useFilters";
import { View, Text, Button } from "react-native";

const queryClient = new QueryClient();

function ErrorFallback({ error, resetErrorBoundary }: any) {
  // Note: useEffect needs to be imported from React, but simplified for now
  // captureError(error);
  
  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Something went wrong
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
        We've been notified of this issue. Please try again or contact support if it persists.
      </Text>
      <Button mode="contained" onPress={resetErrorBoundary} style={{ minWidth: 150 }}>
        Reload App
      </Button>
    </View>
  );
}

export default function Layout() {
  const { isDarkMode } = useFilters();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={captureError}
          onReset={() => {
            // Clear query cache to reset app state
            queryClient.clear();
          }}
        >
          <LinkPreviewContextProvider>
            <Tabs>
              <Tabs.Screen
                name="discover"
                options={{ title: "Discover", headerTitle: "Discover" }}
              />
              <Tabs.Screen
                name="browse"
                options={{ title: "Browse", headerTitle: "Browse Models" }}
              />
              <Tabs.Screen
                name="compare"
                options={{ title: "Compare", headerTitle: "Compare Models" }}
              />
              <Tabs.Screen
                name="profile"
                options={{ title: "Profile", headerTitle: "Settings" }}
              />
            </Tabs>
          </LinkPreviewContextProvider>
        </ErrorBoundary>
      </PaperProvider>
    </QueryClientProvider>
  );
}
