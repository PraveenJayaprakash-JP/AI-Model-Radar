import { fetchModels, MODELS_QUERY_KEY } from "../queries/models";
import { loadCachedModels } from "../lib/storage";

jest.mock("../lib/storage", () => ({
  loadCachedModels: jest.fn(),
  saveModels: jest.fn(),
  clearStorage: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("fetches models from GitHub when cache is empty", async () => {
  (loadCachedModels as jest.Mock).mockResolvedValue(null);

  const mockData = [
    {
      id: "openai-gpt-4",
      name: "GPT-4",
      provider: "OpenAI",
      capabilities: ["text", "code", "vision"],
      pricing: { input_cost_per_1k: 0.03, output_cost_per_1k: 0.06 },
      launch_date: 1672531200000,
      context_window: 8192,
      free_tier: false,
    },
  ];

  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) } as Response)
  );

  const models = await fetchModels();
  expect(models).toEqual(mockData);
});

test("returns cached models when available", async () => {
  const cached = [
    {
      id: "cached-model",
      name: "Cached Model",
      provider: "Test",
      capabilities: ["text"],
      pricing: { input_cost_per_1k: 0.01, output_cost_per_1k: 0.02 },
    },
  ];

  (loadCachedModels as jest.Mock).mockResolvedValue(cached);

  const models = await fetchModels();
  expect(models).toEqual(cached);
  expect(global.fetch).toBeUndefined;
});

test("falls back to sample data on fetch failure", async () => {
  (loadCachedModels as jest.Mock).mockResolvedValue(null);

  global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

  const models = await fetchModels();
  expect(models.length).toBeGreaterThan(0);
  expect(models[0].name).toBe("GPT-4");
});
