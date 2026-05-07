import { render } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./_layout";

// Mock the useFilters hook
jest.mock("../stores/useFilters", () => ({
  useFilters: () => ({ isDarkMode: false }),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  Tabs: ({ children }: any) => <>{children}</>,
}));

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
