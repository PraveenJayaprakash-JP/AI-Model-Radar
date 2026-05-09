import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  StyleSheet,
  LayoutChangeEvent
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFilters, SortOption } from "../stores/useFilters";
import { useQuery } from "@tanstack/react-query";
import { modelsQueryOptions } from "../queries/models";
import { getTheme } from "../lib/theme";
import { useState } from "react";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  const { 
    isDarkMode, 
    providers, 
    capabilities, 
    maxPrice, 
    showFreeOnly,
    sortBy,
    toggleProvider,
    toggleCapability,
    setMaxPrice,
    setShowFreeOnly,
    setSortBy,
    clearFilters
  } = useFilters();
  const currentTheme = getTheme(isDarkMode);
  const [sliderWidth, setSliderWidth] = useState(0);

  const { data } = useQuery({ ...modelsQueryOptions });
  const dynamicProviders = [...new Set((data || []).map(m => m.provider))].sort();
  const dynamicCapabilities = [...new Set((data || []).flatMap(m => m.capabilities || []))].sort();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name", label: "A → Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "context", label: "Context Window" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: currentTheme.text }]}>Filters & Sort</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={currentTheme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Sort By</Text>
              <View style={styles.chipContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: sortBy === option.value ? "#007AFF" : currentTheme.surface,
                        borderColor: sortBy === option.value ? "#007AFF" : currentTheme.border,
                      }
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: sortBy === option.value ? "#fff" : currentTheme.text }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Providers</Text>
              <View style={styles.chipContainer}>
                {dynamicProviders.map((provider) => (
                  <TouchableOpacity
                    key={provider}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: providers.includes(provider) ? "#007AFF" : currentTheme.surface,
                        borderColor: providers.includes(provider) ? "#007AFF" : currentTheme.border,
                      }
                    ]}
                    onPress={() => toggleProvider(provider)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: providers.includes(provider) ? "#fff" : currentTheme.text }
                    ]}>
                      {provider}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Max Price (per 1k tokens)</Text>
              <View style={styles.priceContainer}>
                <Ionicons name="pricetag" size={20} color={currentTheme.textSecondary} />
                <Text style={[styles.priceText, { color: currentTheme.text }]}>
                  ${maxPrice.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.sliderTrack, { backgroundColor: currentTheme.border }]}
                onLayout={(e: LayoutChangeEvent) => setSliderWidth(e.nativeEvent.layout.width)}
                onPress={(e) => {
                  if (sliderWidth <= 0) return;
                  const value = Math.min(1, Math.max(0, e.nativeEvent.locationX / sliderWidth));
                  setMaxPrice(value);
                }}
              >
                <View 
                  style={[
                    styles.sliderFill, 
                    { 
                      backgroundColor: "#007AFF",
                      width: `${maxPrice * 100}%`
                    }
                  ]} 
                />
              </TouchableOpacity>
              <View style={styles.priceLabels}>
                <Text style={{ color: currentTheme.textSecondary }}>$0</Text>
                <Text style={{ color: currentTheme.textSecondary }}>$1.00</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Capabilities</Text>
              <View style={styles.chipContainer}>
                {dynamicCapabilities.map((cap) => (
                  <TouchableOpacity
                    key={cap}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: capabilities.includes(cap) ? "#007AFF" : currentTheme.surface,
                        borderColor: capabilities.includes(cap) ? "#007AFF" : currentTheme.border,
                      }
                    ]}
                    onPress={() => toggleCapability(cap)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: capabilities.includes(cap) ? "#fff" : currentTheme.text }
                    ]}>
                      {cap}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.freeToggle}
                onPress={() => setShowFreeOnly(!showFreeOnly)}
              >
                <View style={styles.freeToggleContent}>
                  <Ionicons name="gift" size={20} color="#22c55e" />
                  <Text style={[styles.freeToggleText, { color: currentTheme.text }]}>
                    Free Tier Only
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: showFreeOnly ? "#22c55e" : "transparent",
                    borderColor: showFreeOnly ? "#22c55e" : currentTheme.border,
                  }
                ]}>
                  {showFreeOnly && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.clearButton, { borderColor: currentTheme.border }]}
              onPress={clearFilters}
            >
              <Text style={{ color: currentTheme.text }}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={onClose}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Apply Filters</Text>
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
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "600",
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 4,
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  freeToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#22c55e",
    backgroundColor: "#22c55e10",
  },
  freeToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  freeToggleText: {
    fontSize: 16,
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  clearButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
});