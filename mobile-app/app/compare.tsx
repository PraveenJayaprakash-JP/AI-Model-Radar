import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCompare, useFilters } from "../stores/useFilters";
import { getTheme } from "../lib/theme";

export default function CompareScreen() {
  const { selectedModels, removeModel, clearModels } = useCompare();
  const { isDarkMode } = useFilters();
  const currentTheme = getTheme(isDarkMode);

  if (selectedModels.length === 0) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: currentTheme.background,
        padding: 32,
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <View style={{ 
          backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
          padding: 24,
          borderRadius: 16,
          alignItems: "center",
        }}>
          <Ionicons 
            name="git-compare" 
            size={64} 
            color={currentTheme.textSecondary} 
          />
          <Text style={{ 
            textAlign: "center", 
            marginTop: 16, 
            fontSize: 18, 
            fontWeight: "600",
            color: currentTheme.text 
          }}>
            No Models Selected
          </Text>
          <Text style={{ 
            textAlign: "center", 
            marginTop: 8, 
            color: currentTheme.textSecondary, 
            fontSize: 14,
            lineHeight: 20,
          }}>
            Select models from the Browse tab to compare their pricing and features.
          </Text>
          <View style={{ 
            marginTop: 16, 
            backgroundColor: "#007AFF20",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
            <Text style={{ color: "#007AFF", fontWeight: "600", fontSize: 13 }}>
              Max 3 models
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, backgroundColor: currentTheme.background, flex: 1 }}>
      <View style={{ 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="git-compare" size={24} color="#007AFF" />
          <Text style={{ fontSize: 20, fontWeight: "700", color: currentTheme.text }}>
            Compare
          </Text>
          <View style={{ 
            backgroundColor: "#007AFF20", 
            paddingHorizontal: 10, 
            paddingVertical: 4, 
            borderRadius: 12 
          }}>
            <Text style={{ fontSize: 13, color: "#007AFF", fontWeight: "600" }}>
              {selectedModels.length}/3
            </Text>
          </View>
        </View>
        {selectedModels.length > 0 && (
          <TouchableOpacity 
            onPress={clearModels}
            style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              gap: 4,
              backgroundColor: "#ef444420",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontWeight: "600", fontSize: 13 }}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {selectedModels.map((model) => (
        <View key={model.id} style={{ 
          padding: 16, 
          backgroundColor: currentTheme.surface, 
          borderRadius: 12, 
          marginBottom: 12,
          borderColor: currentTheme.border,
          borderWidth: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: "700", color: currentTheme.text }}>
                {model.name}
              </Text>
              <Text style={{ color: currentTheme.textSecondary, marginTop: 2 }}>
                {model.provider}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => removeModel(model.id)}
              style={{ 
                backgroundColor: "#ef444420",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Ionicons name="close" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
          
          {model.pricing && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 12, color: currentTheme.textSecondary, marginBottom: 8, fontWeight: "600" }}>
                PRICING (per 1k tokens)
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ 
                  flex: 1, 
                  backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}>
                  <Ionicons name="enter" size={16} color={currentTheme.textSecondary} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: currentTheme.text, marginTop: 4 }}>
                    ${model.pricing.input_cost_per_1k}
                  </Text>
                  <Text style={{ fontSize: 11, color: currentTheme.textSecondary }}>
                    Input
                  </Text>
                </View>
                <View style={{ 
                  flex: 1, 
                  backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}>
                  <Ionicons name="exit" size={16} color={currentTheme.textSecondary} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: currentTheme.text, marginTop: 4 }}>
                    ${model.pricing.output_cost_per_1k}
                  </Text>
                  <Text style={{ fontSize: 11, color: currentTheme.textSecondary }}>
                    Output
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          <View style={{ marginTop: 12, flexDirection: "row", gap: 16 }}>
            {model.context_window && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="document-text" size={14} color={currentTheme.textSecondary} />
                <Text style={{ fontSize: 12, color: currentTheme.textSecondary }}>
                  {model.context_window.toLocaleString()} tokens
                </Text>
              </View>
            )}
            {model.free_tier && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="gift" size={14} color="#22c55e" />
                <Text style={{ fontSize: 12, color: "#22c55e" }}>
                  Free tier
                </Text>
              </View>
            )}
          </View>
          
          {model.capabilities && model.capabilities.length > 0 && (
            <View style={{ marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {model.capabilities.map((cap, i) => (
                <View key={i} style={{ 
                  backgroundColor: isDarkMode ? "#333" : "#eee", 
                  paddingHorizontal: 10, 
                  paddingVertical: 4, 
                  borderRadius: 6 
                }}>
                  <Text style={{ fontSize: 11, color: currentTheme.textSecondary }}>{cap}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}