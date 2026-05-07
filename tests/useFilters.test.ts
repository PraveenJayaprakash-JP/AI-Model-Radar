import { renderHook, act } from "@testing-library/react-native";
import { useFilters } from "../stores/useFilters";

describe("useFilters", () => {
  it("updates searchQuery", () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setSearchQuery("gpt");
    });
    expect(result.current.searchQuery).toBe("gpt");
  });
});