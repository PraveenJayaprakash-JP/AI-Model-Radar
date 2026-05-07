# Phase 2: Core Mobile App - Design Specification

**Status:** Draft
**Target Platform:** React Native (Expo) - iOS/Android

---

## 1. Navigation & Structure

### Architecture
- **Expo Router** (file-based routing):
  ```
  app/
    _layout.tsx       # Root layout (tabs)
    discover.tsx      # New/free models spotlight
    browse.tsx        # Full model list + search/filter
    compare.tsx       # Side-by-side comparison (placeholder)
    profile.tsx       # Settings (theme, refresh data)
  ```

### Tabs
| Tab       | Purpose                          | Key Features                          |
|-----------|----------------------------------|---------------------------------------|
| Discover  | Highlight new/free models        | "New Models", "Free Models" sections |
| Browse    | Search and filter all models     | Search bar, filter chips (provider/capability) |
| Compare   | Future: Model comparison         | Empty state, locked until Phase 4     |
| Profile   | Settings/app info                 | Dark mode, cache management           |

---

## 2. State Management

### Libraries
- **Zustand**: Global UI state (filters, theme, bookmarks).
- **TanStack Query**: Server state (`models.json` caching, refresh logic).

### Stores
```typescript
// stores/useFilters.ts
interface Filters {
  searchQuery: string;
  providers: string[];
  capabilities: string[];
}

export const useFilters = create<Filters>(() => ({
  searchQuery: "",
  providers: [],
  capabilities: [],
}));

// stores/useBookmarks.ts
interface Bookmark {
  modelId: string;
}

export const useBookmarks = create<Bookmark[]>(() => []);
```

### Query Keys
```typescript
// queries/models.ts
const MODELS_QUERY_KEY = ["models"];
```

---

## 3. Data Layer

### Requirements
- **Offline-first**: Load cached data immediately, refresh in background.
- **Pull-to-refresh**: Force refresh data.
- **Background fetch**: Align with Phase 1 pipeline (15-minute intervals).

### Implementation
- **Cache**: `react-native-mmkv` (encrypted, persisted).
  ```typescript
  const storage = new MMKV();
  storage.set("models", JSON.stringify(modelsData));
  ```
- **Fetch Logic**: TanStack Query with `staleTime: Infinity`.
  ```typescript
  const { data } = useQuery({
    queryKey: MODELS_QUERY_KEY,
    queryFn: () => fetchModels(),
    placeholderData: () => loadCachedModels(),
  });
  ```
- **Versioning**: Check `models.json` timestamp on fetch.

---

## 4. UI Components

### Library
- **React Native Paper**:
  ```bash
  expo install react-native-paper
  ```

### Theming
- Dark/light mode support:
  ```typescript
  const theme = useTheme();
  <Text style={{ color: theme.colors.primary }}>Model Name</Text>
  ```

### Core Components
| Component          | Usage                          | Props Example                     |
|--------------------|-------------------------------|-----------------------------------|
| `Card`             | Model list item               | `title`, `subtitle`, `left` (logo) |
| `Searchbar`        | Browse tab                    | `value`, `onChangeText`           |
| `Chip`             | Filters                       | `selected`, `onPress`             |
| `ActivityIndicator`| Loading state                 | `animating`                      |

---

## 5. Error Handling

### Scenarios
| Scenario                  | User Experience                          | Technical Response                     |
|---------------------------|------------------------------------------|----------------------------------------|
| `models.json` fetch fails | Show cached data + warning banner       | Log to Sentry, retry with backoff      |
| App crash                 | Error boundary + reload button           | Log to Sentry, persist last known state|

### Sentry Integration
```typescript
Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 1.0,
});
```

---

## 6. Performance

### Lists
- **`@shopify/flash-list`**: Virtualized lists for 60fps scrolling.
  ```typescript
  <FlashList
    data={models}
    renderItem={({ item }) => <ModelCard model={item} />}
    estimatedItemSize={120}
  />
  ```

### Background Fetch
```typescript
// app/_layout.tsx
useEffect(() => {
  scheduleBackgroundFetch();
}, []);
```

---

## 7. Testing Strategy

### Unit Tests
- **State**: Zustand store updates.
  ```bash
  npm test useFilters.test.ts
  ```
- **Query**: TanStack Query fetch/retry logic.

### Integration Tests
- **Navigation**: Tab transitions.
- **Offline**: Cache fetch fallback.

### Manual Tests
| Device       | Scenario                          | Expected Result                     |
|--------------|----------------------------------|-------------------------------------|
| iPhone 12    | Launch offline                    | Shows cached data                   |
| Pixel 5      | Pull-to-refresh                   | Refreshes data                      |
| iPad         | Portrait/landscape                | Responsive layout                   |

---

## 8. Next Steps
1. **Implement Navigation**: Expo Router + tabs.
2. **Set Up State**: Zustand + TanStack Query.
3. **Build Data Layer**: MMKV caching + fetch logic.
4. **Style UI**: React Native Paper theming.

Proceed to implementation planning (`/writing-plans`)?