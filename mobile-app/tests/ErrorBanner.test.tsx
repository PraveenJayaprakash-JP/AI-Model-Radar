import { render, fireEvent } from "@testing-library/react-native";
import ErrorBanner from "../components/ErrorBanner";

describe("ErrorBanner", () => {
  it("renders error message", () => {
    const { getByText } = render(<ErrorBanner message="Failed to load" />);

    expect(getByText("Failed to load")).toBeTruthy();
  });

  it("calls onRetry when retry button is pressed", () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorBanner message="Failed to load" onRetry={onRetry} />
    );

    const retryButton = getByText("Retry");
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders without onRetry handler", () => {
    expect(() =>
      render(<ErrorBanner message="Failed to load" />)
    ).not.toThrow();
  });
});
