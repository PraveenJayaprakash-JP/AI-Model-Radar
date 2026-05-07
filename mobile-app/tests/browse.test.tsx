import { render } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BrowseScreen from "../app/browse";

// Mock dependencies
jest.mock("../stores/useFilters", () => ({
  useFilters: () => ({
    searchQuery: "",
    setSearchQuery: jest.fn(),
  }),
}));

jest.mock("../components/ModelList", () => "ModelList");

jest.mock("../lib/storage", () => ({
  loadCachedModels: jest.fn(() => []),
  saveModels: jest.fn(),
}));

jest.mock("../queries/models", () => ({
  modelsQueryOptions: {
    queryKey: ["models"],
  },
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(() => ({
    data: [],
    error: null,
    isLoading: false,
    isFetching: false,
  })),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("BrowseScreen", () => {
  it("renders without crashing", () => {
    const queryClient = createTestQueryClient();

    expect(() =>
      render(
        <QueryClientProvider client={queryClient}>
          <BrowseScreen />
        </QueryClientProvider>
      )
    ).not.toThrow();
  });

  it("renders SearchBar", () => {
    const queryClient = createTestQueryClient();
    const { getByPlaceholderText } = render(
      <QueryClientProvider client={queryClient}>
        <BrowseScreen />
      </QueryClientProvider>
    );

    expect(getByPlaceholderText("Search models...")).toBeTruthy();
  });
});
