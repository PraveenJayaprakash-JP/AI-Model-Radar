import { View } from "react-native";
import { Button, Text, Switch, useTheme } from "react-native-paper";
import { useFilters } from "../stores/useFilters";
import { clearStorage } from "../lib/storage";

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useFilters();

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 24 }}>Settings</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text variant="bodyLarge">Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
        />
      </View>

      <Button
        mode="outlined"
        onPress={clearStorage}
        style={{ marginTop: 16 }}
      >
        Clear Cache
      </Button>
    </View>
  );
}