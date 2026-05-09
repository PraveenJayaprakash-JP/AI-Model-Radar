import { render, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockIcon = (props: any) => React.createElement(Text, props, props.name || "icon");
  return {
    __esModule: true,
    Ionicons: MockIcon,
    AntDesign: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome: MockIcon,
    Feather: MockIcon,
    Entypo: MockIcon,
    MaterialCommunityIcons: MockIcon,
    FontAwesome5: MockIcon,
  };
});

jest.mock("../stores/useFilters", () => ({
  useFilters: () => ({
    searchQuery: "",
    setSearchQuery: jest.fn(),
    providers: [],
    capabilities: [],
    showFreeOnly: false,
    maxPrice: 1,
  }),
}));

jest.mock("../components/ModelList", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: () => React.createElement(View, null, React.createElement(Text, null, "ModelList")),
  };
});

jest.mock("../components/FilterModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { __esModule: true, default: () => React.createElement(View) };
});

jest.mock("../components/DetailModal", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { __esModule: true, default: () => React.createElement(View) };
});

jest.mock("../lib/storage", () => ({
  loadCachedModels: jest.fn(() => Promise.resolve(null)),
  saveModels: jest.fn(),
}));

jest.mock("../queries/models", () => ({
  modelsQueryOptions: { queryKey: ["models"] },
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

import BrowseScreen from "../app/browse";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe("BrowseScreen", () => {
  it("renders SearchBar", async () => {
    const queryClient = createTestQueryClient();
    const { getByPlaceholderText } = render(
      <QueryClientProvider client={queryClient}>
        <BrowseScreen />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(getByPlaceholderText("Search AI models...")).toBeTruthy();
    });
  });
});
