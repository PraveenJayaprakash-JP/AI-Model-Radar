import { render } from "@testing-library/react-native";
import ModelCard from "../components/ModelCard";

test("renders model name and provider", () => {
  const { getByText } = render(
    <ModelCard model={{ name: "gpt-4", provider: "openai", launch_date: 1686935002 }} />
  );
  expect(getByText("gpt-4")).toBeTruthy();
  expect(getByText("openai")).toBeTruthy();
});