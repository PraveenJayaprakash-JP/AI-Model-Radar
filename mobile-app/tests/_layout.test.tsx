import { render } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "../app/_layout";

jest.mock("@react-navigation/native", () => ({
  NavigationContainer: ({ children }: any) => <>{children}</>,
}));

jest.mock("@react-navigation/bottom-tabs", () => {
  const React = require("react");
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }: any) => <>{children}</>,
      Screen: () => null,
    }),
  };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

jest.mock("../stores/useFilters", () => ({
  useFilters: () => ({ isDarkMode: false }),
}));

jest.mock("../lib/sentry", () => ({
  captureError: jest.fn(),
}));

jest.mock("../app/discover", () => () => null);
jest.mock("../app/browse", () => () => null);
jest.mock("../app/compare", () => () => null);
jest.mock("../app/profile", () => () => null);
jest.mock("../app/favorites", () => () => null);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("Tab Navigation", () => {
  it("renders without crashing", () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    );
  });
});
