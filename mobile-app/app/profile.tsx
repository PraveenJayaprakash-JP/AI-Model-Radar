import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFilters } from "../stores/useFilters";
import { clearStorage } from "../lib/storage";
import { getTheme } from "../lib/theme";

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will remove all cached data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            await clearStorage();
            Alert.alert("Success", "Cache cleared successfully");
          }
        },
      ]
    );
  };

  return (
    <View style={{ padding: 16, backgroundColor: currentTheme.background, flex: 1 }}>
      <Text style={{ marginBottom: 24, fontSize: 20, fontWeight: "700", color: currentTheme.text }}>
        Settings
      </Text>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 13, 
          fontWeight: "600", 
          color: currentTheme.textSecondary, 
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}>
          Appearance
        </Text>
        
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: 16,
          backgroundColor: currentTheme.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: currentTheme.border,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ 
              backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
              padding: 10,
              borderRadius: 10,
            }}>
              <Ionicons 
                name={isDarkMode ? "moon" : "sunny"} 
                size={22} 
                color={isDarkMode ? "#fff" : "#333"} 
              />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600", color: currentTheme.text }}>
                Dark Mode
              </Text>
              <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
                {isDarkMode ? "Currently enabled" : "Currently disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#e0e0e0", true: "#007AFF" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 13, 
          fontWeight: "600", 
          color: currentTheme.textSecondary, 
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}>
          Data
        </Text>
        
        <TouchableOpacity 
          onPress={handleClearCache}
          style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            gap: 12,
            padding: 16,
            backgroundColor: currentTheme.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: currentTheme.border,
          }}
        >
          <View style={{ 
            backgroundColor: "#ef444420",
            padding: 10,
            borderRadius: 10,
          }}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: currentTheme.text }}>
              Clear Cache
            </Text>
            <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
              Remove all cached models data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={currentTheme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: "auto", paddingTop: 24, borderTopWidth: 1, borderTopColor: currentTheme.border }}>
        <Text style={{ fontSize: 12, color: currentTheme.textSecondary, textAlign: "center" }}>
          AI Model Radar
        </Text>
        <Text style={{ fontSize: 11, color: currentTheme.textSecondary, textAlign: "center", marginTop: 4 }}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
}