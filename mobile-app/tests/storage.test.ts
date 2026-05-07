import { MMKV } from "react-native-mmkv";
import { loadCachedModels, saveModels, clearStorage } from "../lib/storage";
import type { Model } from "../types/models";

// Mock MMKV
jest.mock("react-native-mmkv", () => ({
  MMKV: jest.fn(),
}));

describe("Storage", () => {
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = {
      getString: jest.fn(),
      set: jest.fn(),
      clearAll: jest.fn(),
    };
    (MMKV as jest.Mock).mockImplementation(() => mockStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("loadCachedModels", () => {
    it("returns parsed models when storage has data", () => {
      const mockModels: Model[] = [
        {
          name: "gpt-4",
          provider: "openai",
          capabilities: ["text"],
          pricing: {
            input_cost_per_1k: 0.03,
            output_cost_per_1k: 0.06,
          },
        },
      ];

      mockStorage.getString.mockReturnValue(JSON.stringify(mockModels));

      const result = loadCachedModels();

      expect(result).toEqual(mockModels);
      expect(mockStorage.getString).toHaveBeenCalledWith("models");
    });

    it("returns null when storage is empty", () => {
      mockStorage.getString.mockReturnValue(null);

      const result = loadCachedModels();

      expect(result).toBeNull();
    });
  });

  describe("saveModels", () => {
    it("saves models as JSON string", () => {
      const mockModels: Model[] = [
        {
          name: "gpt-4",
          provider: "openai",
          capabilities: ["text"],
          pricing: {
            input_cost_per_1k: 0.03,
            output_cost_per_1k: 0.06,
          },
        },
      ];

      saveModels(mockModels);

      expect(mockStorage.set).toHaveBeenCalledWith(
        "models",
        JSON.stringify(mockModels)
      );
    });

    it("handles errors gracefully", () => {
      mockStorage.set.mockImplementation(() => {
        throw new Error("Storage error");
      });

      expect(() => saveModels([])).not.toThrow();
    });
  });

  describe("clearStorage", () => {
    it("clears all storage", () => {
      clearStorage();

      expect(mockStorage.clearAll).toHaveBeenCalled();
    });
  });
});
