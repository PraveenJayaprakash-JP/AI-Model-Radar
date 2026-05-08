import { Tabs } from "expo-router";
import { PaperProvider, DarkTheme, DefaultTheme } from "react-native-paper";
import { LinkPreviewContextProvider } from "expo-router/build/link/LinkPreviewContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilters } from "../stores/useFilters";

const queryClient = new QueryClient();

export default function Layout() {
  const { isDarkMode } = useFilters();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
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
      </PaperProvider>
    </QueryClientProvider>
  );
}
