import { loadCachedModels, saveModels, clearStorage } from "../lib/storage";
import type { Model } from "../types/models";

describe("Storage", () => {
  beforeEach(() => {
    clearStorage();
  });

  describe("loadCachedModels", () => {
    it("returns null when no models cached", async () => {
      const result = await loadCachedModels();
      expect(result).toBeNull();
    });

    it("returns cached models after saving", async () => {
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

      await saveModels(mockModels);
      const result = await loadCachedModels();
      expect(result).toEqual(mockModels);
    });
  });

  describe("saveModels", () => {
    it("saves and retrieves models", async () => {
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

      await saveModels(mockModels);
      const result = await loadCachedModels();
      expect(result).toEqual(mockModels);
    });

    it("overwrites previous models", async () => {
      const models1: Model[] = [
        { name: "gpt-4", provider: "openai", capabilities: ["text"], pricing: { input_cost_per_1k: 0.03, output_cost_per_1k: 0.06 } },
      ];
      const models2: Model[] = [
        { name: "claude-3", provider: "anthropic", capabilities: ["text"], pricing: { input_cost_per_1k: 0.015, output_cost_per_1k: 0.075 } },
      ];

      await saveModels(models1);
      await saveModels(models2);
      const result = await loadCachedModels();
      expect(result).toEqual(models2);
    });
  });

  describe("clearStorage", () => {
    it("clears cached models", async () => {
      const mockModels: Model[] = [
        { name: "gpt-4", provider: "openai", capabilities: ["text"], pricing: { input_cost_per_1k: 0.03, output_cost_per_1k: 0.06 } },
      ];

      await saveModels(mockModels);
      await clearStorage();
      const result = await loadCachedModels();
      expect(result).toBeNull();
    });
  });
});
