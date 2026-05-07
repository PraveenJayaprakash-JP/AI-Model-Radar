import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const loadCachedModels = () => {
  const models = storage.getString("models");
  return models ? JSON.parse(models) : null;
};

export const saveModels = (models: any[]) => {
  storage.set("models", JSON.stringify(models));
};