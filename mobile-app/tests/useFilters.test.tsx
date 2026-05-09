import { renderHook, act } from "@testing-library/react-native";
import { useFilters, useCompare, useFavorites } from "../stores/useFilters";

describe("useFilters", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.searchQuery).toBe("");
    expect(result.current.providers).toEqual([]);
    expect(result.current.capabilities).toEqual([]);
    expect(result.current.isDarkMode).toBe(false);
  });

  it("updates search query with debounce", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setSearchQuery("gpt");
    });

    act(() => {
      jest.advanceTimersByTime(250);
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

describe("useCompare", () => {
  it("limits to 3 models", () => {
    const { result } = renderHook(() => useCompare());

    const model1 = { id: "1", name: "A", provider: "OpenAI", free_tier: false, pricing: { input_cost_per_1k: 0, output_cost_per_1k: 0 } };
    const model2 = { id: "2", name: "B", provider: "OpenAI", free_tier: false, pricing: { input_cost_per_1k: 0, output_cost_per_1k: 0 } };
    const model3 = { id: "3", name: "C", provider: "OpenAI", free_tier: false, pricing: { input_cost_per_1k: 0, output_cost_per_1k: 0 } };
    const model4 = { id: "4", name: "D", provider: "OpenAI", free_tier: false, pricing: { input_cost_per_1k: 0, output_cost_per_1k: 0 } };

    act(() => { result.current.addModel(model1); });
    act(() => { result.current.addModel(model2); });
    act(() => { result.current.addModel(model3); });

    expect(result.current.selectedModels.length).toBe(3);

    act(() => { result.current.addModel(model4); });
    expect(result.current.selectedModels.length).toBe(3);

    act(() => { result.current.removeModel("1"); });
    expect(result.current.selectedModels.length).toBe(2);
  });
});

describe("useFavorites", () => {
  it("toggles favorites", () => {
    const { result } = renderHook(() => useFavorites());
    const model = { id: "1", name: "A", provider: "OpenAI", free_tier: false, pricing: { input_cost_per_1k: 0, output_cost_per_1k: 0 } };

    act(() => { result.current.toggleFavorite(model); });
    expect(result.current.favorites.length).toBe(1);

    act(() => { result.current.toggleFavorite(model); });
    expect(result.current.favorites.length).toBe(0);
  });
});