import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { captureError } from "../lib/sentry";
import { useFilters } from "../stores/useFilters";
import { View, Text, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTheme } from "../lib/theme";
import Discover from "./discover";
import Browse from "./browse";
import Compare from "./compare";
import Profile from "./profile";
import Favorites from "./favorites";
import withErrorBoundary from "../components/withErrorBoundary";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function ErrorFallback({ resetErrorBoundary }: any) {
  const currentTheme = getTheme(false);
  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: currentTheme.background }}>
      <Text style={{ marginBottom: 16, fontSize: 18, color: currentTheme.text }}>Something went wrong</Text>
      <Text style={{ textAlign: "center", marginBottom: 24, fontSize: 14, color: currentTheme.textSecondary }}>Please try again.</Text>
      <Button title="Reload App" onPress={resetErrorBoundary} />
    </View>
  );
}

export default function Layout() {
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={captureError}
        onReset={() => queryClient.clear()}
      >
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: currentTheme.surface,
                borderTopColor: currentTheme.border,
              },
              tabBarActiveTintColor: "#007AFF",
              tabBarInactiveTintColor: currentTheme.textSecondary,
              headerStyle: {
                backgroundColor: currentTheme.surface,
              },
              headerTintColor: currentTheme.text,
            }}
          >
            <Tab.Screen name="discover" component={withErrorBoundary(Discover)} options={{ title: "Discover" }} />
            <Tab.Screen name="browse" component={withErrorBoundary(Browse)} options={{ title: "Browse" }} />
            <Tab.Screen name="favorites" component={withErrorBoundary(Favorites)} options={{ title: "Favorites" }} />
            <Tab.Screen name="compare" component={withErrorBoundary(Compare)} options={{ title: "Compare" }} />
            <Tab.Screen name="profile" component={withErrorBoundary(Profile)} options={{ title: "Settings" }} />
          </Tab.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}