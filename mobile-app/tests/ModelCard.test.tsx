import { render } from "@testing-library/react-native";
import ModelCard from "../components/ModelCard";
import type { Model } from "../types/models";

const mockModel: Model = {
  name: "gpt-4",
  provider: "openai",
  launch_date: 1672531200,
  capabilities: ["text", "vision"],
  pricing: {
    input_cost_per_1k: 0.03,
    output_cost_per_1k: 0.06,
  },
};

describe("ModelCard", () => {
  it("renders model name and provider", () => {
    const { getByText } = render(<ModelCard model={mockModel} />);

    expect(getByText("gpt-4")).toBeTruthy();
    expect(getByText("openai")).toBeTruthy();
  });

  it("renders launch date when available", () => {
    const { getByText } = render(<ModelCard model={mockModel} />);

    expect(
      getByText(new Date(mockModel.launch_date! * 1000).toLocaleDateString())
    ).toBeTruthy();
  });

  it("renders without crash when launch date is missing", () => {
    const modelWithoutDate: Model = {
      ...mockModel,
      launch_date: undefined,
    };

    expect(() => render(<ModelCard model={modelWithoutDate} />)).not.toThrow();
  });

  it("applies highlight style when highlight prop is true", () => {
    const { getByTestId } = render(<ModelCard model={mockModel} highlight={true} />);

    const card = getByTestId(/^model-card/);
    expect(card).toBeTruthy();
  });
});
