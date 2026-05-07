import { Tabs } from "expo-router";
import { PaperProvider, DarkTheme, DefaultTheme } from "react-native-paper";
import { useFilters } from "../stores/useFilters";

export default function Layout() {
  const { isDarkMode } = useFilters();

  return (
    <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
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
    </PaperProvider>
  );
}
