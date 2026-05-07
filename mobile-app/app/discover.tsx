import { Text } from "react-native-paper";
import ModelList from "../components/ModelList";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";

export default function DiscoverScreen() {
  const { data } = useQuery(modelsQueryOptions);
  
  const newModels = data?.filter(
    (model) => model.launch_date && 
    (Date.now() - new Date(model.launch_date * 1000).getTime()) < 30 * 24 * 60 * 60 * 1000
  ) || [];
  
  const freeModels = data?.filter((model) => model.free_tier) || [];
  
  return (
    <>
      <Text variant="titleLarge" style={{ margin: 16 }}>New Models</Text>
      <ModelList models={newModels} highlight />
      <Text variant="titleLarge" style={{ margin: 16 }}>Free Models</Text>
      <ModelList models={freeModels} highlight />
    </>
  );
}