import { Card, Text } from "react-native-paper";

interface ModelCardProps {
  model: {
    name: string;
    provider: string;
    launch_date?: number;
  };
  highlight?: boolean;
}

export default function ModelCard({ model, highlight }: ModelCardProps) {
  return (
    <Card
      mode="contained"
      style={highlight ? { borderWidth: 1, borderColor: "gold" } : {}}
    >
      <Card.Title
        title={model.name}
        subtitle={model.provider}
        titleVariant="titleMedium"
        subtitleVariant="bodyMedium"
      />
      {model.launch_date && (
        <Card.Content>
          <Text variant="bodySmall">
            {new Date(model.launch_date * 1000).toLocaleDateString()}
          </Text>
        </Card.Content>
      )}
    </Card>
  );
}