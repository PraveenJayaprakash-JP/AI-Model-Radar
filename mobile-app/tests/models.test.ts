import { fetchModels, MODELS_QUERY_KEY } from "../queries/models";

test("fetches models from GitHub", async () => {
  const mockData = [{ name: "gpt-4", provider: "openai" }];
  global.fetch = jest.fn(() => Promise.resolve({ json: () => mockData }));
  const models = await fetchModels();
  expect(models).toEqual(mockData);
});

test("throws error on failed fetch", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Failed")));
  await expect(fetchModels()).rejects.toThrow("Failed to fetch models");
});