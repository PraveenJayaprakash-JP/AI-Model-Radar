import { 
  View, 
  Text, 
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Linking 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFilters } from "../stores/useFilters";
import { useFavorites } from "../stores/useFilters";
import { getTheme } from "../lib/theme";
import type { Model } from "../types/models";

interface DetailModalProps {
  model: Model | null;
  visible: boolean;
  onClose: () => void;
}

export default function DetailModal({ model, visible, onClose }: DetailModalProps) {
  const { isDarkMode } = useFilters();
  const { favorites, toggleFavorite } = useFavorites();
  const currentTheme = getTheme(isDarkMode);
  
  if (!model) return null;
  
  const isFavorited = favorites.some(m => m.id === model.id);

  const handleOpenDocs = () => {
    const lower = model.provider.toLowerCase();
    const urls: Record<string, string> = {
      openai: "https://platform.openai.com/docs",
      anthropic: "https://docs.anthropic.com",
      google: "https://ai.google.dev/docs",
      mistral: "https://docs.mistral.ai",
      replicate: "https://replicate.com/docs",
      together: "https://docs.together.ai",
    };
    const key = Object.keys(urls).find(k => lower.includes(k));
    if (key) Linking.openURL(urls[key]);
  };

  const getProviderIcon = (provider: string) => {
    const lower = provider.toLowerCase();
    if (lower.includes("openai")) return "logo-openai";
    if (lower.includes("anthropic")) return "person";
    if (lower.includes("google")) return "logo-google";
    if (lower.includes("mistral")) return "cloud";
    if (lower.includes("meta")) return "logo-facebook";
    if (lower.includes("amazon")) return "cloud";
    return "server";
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={currentTheme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.titleSection}>
              <View style={[styles.iconContainer, { backgroundColor: currentTheme.surface }]}>
                <Ionicons 
                  name={getProviderIcon(model.provider) as any} 
                  size={32} 
                  color={currentTheme.text} 
                />
              </View>
              <Text style={[styles.modelName, { color: currentTheme.text }]}>{model.name}</Text>
              <Text style={[styles.provider, { color: currentTheme.textSecondary }]}>{model.provider}</Text>
              
              <View style={styles.badgeRow}>
                {model.free_tier && (
                  <View style={styles.badge}>
                    <Ionicons name="gift" size={14} color="#22c55e" />
                    <Text style={styles.badgeText}>Free Tier</Text>
                  </View>
                )}
                {model.launch_date && (
                  <View style={styles.badge}>
                    <Ionicons name="calendar" size={14} color="#007AFF" />
<Text style={styles.badgeText}>
                    {new Date(model.launch_date * 1000).toLocaleDateString()}
                  </Text>
                  </View>
                )}
              </View>
            </View>

            {model.pricing && (
              <View style={[styles.section, { backgroundColor: currentTheme.surface }]}>
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Pricing</Text>
                <View style={styles.pricingGrid}>
                  <View style={styles.pricingItem}>
                    <Ionicons name="enter" size={20} color={currentTheme.textSecondary} />
                    <Text style={[styles.pricingLabel, { color: currentTheme.textSecondary }]}>Input</Text>
                    <Text style={[styles.pricingValue, { color: currentTheme.text }]}>
                      ${model.pricing.input_cost_per_1k}/1k tokens
                    </Text>
                  </View>
                  <View style={styles.pricingItem}>
                    <Ionicons name="exit" size={20} color={currentTheme.textSecondary} />
                    <Text style={[styles.pricingLabel, { color: currentTheme.textSecondary }]}>Output</Text>
                    <Text style={[styles.pricingValue, { color: currentTheme.text }]}>
                      ${model.pricing.output_cost_per_1k}/1k tokens
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {model.context_window && (
              <View style={[styles.section, { backgroundColor: currentTheme.surface }]}>
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Context Window</Text>
                <View style={styles.contextRow}>
                  <Ionicons name="document-text" size={24} color="#007AFF" />
                  <Text style={[styles.contextValue, { color: currentTheme.text }]}>
                    {model.context_window.toLocaleString()} tokens
                  </Text>
                </View>
              </View>
            )}

            {model.capabilities && model.capabilities.length > 0 && (
              <View style={[styles.section, { backgroundColor: currentTheme.surface }]}>
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Capabilities</Text>
                <View style={styles.capabilitiesList}>
                  {model.capabilities.map((cap, index) => (
                    <View key={index} style={[styles.capabilityChip, { backgroundColor: isDarkMode ? "#333" : "#eee" }]}>
                      <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                      <Text style={[styles.capabilityText, { color: currentTheme.text }]}>{cap}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={[styles.section, { backgroundColor: currentTheme.surface }]}>
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>About</Text>
              <Text style={[styles.description, { color: currentTheme.textSecondary }]}>
                {model.name} is an AI model provided by {model.provider}. 
                {model.free_tier && " It offers a free tier for users to get started."}
                {model.context_window && ` Supports up to ${model.context_window.toLocaleString()} tokens context.`}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.favoriteButton, 
                { borderColor: isFavorited ? "#f59e0b" : currentTheme.border }
              ]}
              onPress={() => toggleFavorite(model)}
            >
              <Ionicons 
                name={isFavorited ? "star" : "star-outline"} 
                size={24} 
                color={isFavorited ? "#f59e0b" : currentTheme.text} 
              />
              <Text style={[
                styles.favoriteText, 
                { color: isFavorited ? "#f59e0b" : currentTheme.text }
              ]}>
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  modelName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  provider: {
    fontSize: 16,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  pricingGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pricingItem: {
    alignItems: "center",
  },
  pricingLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  contextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contextValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  capabilitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  capabilityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  capabilityText: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    marginTop: 12,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: "600",
  },
});