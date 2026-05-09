import { render } from "@testing-library/react-native";

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
  useFilters: () => ({ isDarkMode: false }),
  useCompare: () => ({ selectedModels: [], addModel: jest.fn(), removeModel: jest.fn() }),
  useFavorites: () => ({ favorites: [], toggleFavorite: jest.fn() }),
}));

jest.mock("../components/ShareButton", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { __esModule: true, default: () => React.createElement(View) };
});

import ModelCard from "../components/ModelCard";
import type { Model } from "../types/models";

const mockModel: Model = {
  id: "openai-gpt-4",
  name: "GPT-4",
  provider: "OpenAI",
  free_tier: false,
  launch_date: 1672531200000,
  capabilities: ["text", "vision"],
  pricing: {
    input_cost_per_1k: 0.03,
    output_cost_per_1k: 0.06,
  },
};

describe("ModelCard", () => {
  it("renders model name and provider", () => {
    const { getByText } = render(<ModelCard model={mockModel} />);
    expect(getByText("GPT-4")).toBeTruthy();
    expect(getByText("OpenAI")).toBeTruthy();
  });

  it("renders pricing info", () => {
    const { getByText } = render(<ModelCard model={mockModel} />);
    expect(getByText("$0.03/1k")).toBeTruthy();
    expect(getByText("$0.06/1k")).toBeTruthy();
  });

  it("renders without crash when launch date is missing", () => {
    const modelWithoutDate: Model = { ...mockModel, launch_date: undefined };
    expect(() => render(<ModelCard model={modelWithoutDate} />)).not.toThrow();
  });

  it("shows Compare button", () => {
    const { getByText } = render(<ModelCard model={mockModel} />);
    expect(getByText("Compare")).toBeTruthy();
  });
});
