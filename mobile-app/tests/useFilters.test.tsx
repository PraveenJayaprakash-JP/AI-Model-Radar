import { renderHook, act } from "@testing-library/react-native";
import { useFilters } from "../stores/useFilters";

describe("useFilters", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.searchQuery).toBe("");
    expect(result.current.providers).toEqual([]);
    expect(result.current.capabilities).toEqual([]);
    expect(result.current.isDarkMode).toBe(false);
  });

  it("updates search query", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setSearchQuery("gpt");
    });

    expect(result.current.searchQuery).toBe("gpt");
  });

  it("toggles dark mode", () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.isDarkMode).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(false);
  });
});
