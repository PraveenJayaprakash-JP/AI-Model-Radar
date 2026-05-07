import { MMKV } from "react-native-mmkv";
import type { Model } from "../types/models";

export const storage = new MMKV();

export const loadCachedModels = (): Model[] | null => {
  const models = storage.getString("models");
  return models ? JSON.parse(models) : null;
};

export const saveModels = (models: Model[]): void => {
  try {
    storage.set("models", JSON.stringify(models));
  } catch (error) {
    console.error("Failed to save models to storage:", error);
  }
};

export const clearStorage = (): void => {
  storage.clearAll();
};
