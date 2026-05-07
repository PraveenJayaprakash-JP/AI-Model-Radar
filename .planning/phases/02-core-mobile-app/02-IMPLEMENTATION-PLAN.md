# Core Mobile App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use **subagent-driven-development** to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cross-platform mobile app (React Native/Expo) that consumes `models.json` from Phase 1 and provides an intuitive model browsing/search experience with offline support.

**Architecture:**
- **Navigation**: Expo Router with 4 tabs (Discover, Browse, Compare, Profile).
- **State**: Zustand for global UI state + TanStack Query for server state (`models.json`).
- **UI**: React Native Paper for consistent styling and accessibility.
- **Offline**: `react-native-mmkv` for caching + fallback UI on fetch failures.
- **Performance**: `@shopify/flash-list` for 60fps scrolling.

**Tech Stack:**
- **Language**: TypeScript
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Styling**: React Native Paper
- **State Management**: Zustand + TanStack Query
- **Caching**: `react-native-mmkv`
- **Lists**: `@shopify/flash-list`
- **Testing**: Jest + React Native Testing Library
- **Monitoring**: Sentry

---

## Task Structure

### Files to Create/Modify
- `app/`:
  - `_layout.tsx`, `discover.tsx`, `browse.tsx`, `compare.tsx`, `profile.tsx`
- `components/`:
  - `ModelCard.tsx`, `FilterChips.tsx`, `SearchBar.tsx`, `ErrorBanner.tsx`
- `stores/`:
  - `useFilters.ts`, `useBookmarks.ts`
- `queries/`:
  - `models.ts`
- `lib/`:
  - `storage.ts`, `sentry.ts`
- `types/`:
  - `models.d.ts`
- `tests/`:
  - `ModelCard.test.tsx`, `useFilters.test.ts`, `models.test.ts`

---

### Task 1: Setup Expo Project Structure

**Files:**
- Create directories: `app/`, `components/`, `stores/`, `queries/`, `lib/`, `types/`, `tests/`

- [ ] **Step 1: Create directories**
```bash
mkdir -p app components stores queries lib types tests
```

- [ ] **Step 2: Initialize Expo project**
```bash
npx create-expo-app@latest --template
```

- [ ] **Step 3: Install core dependencies**
```bash
expo install @expo-router/stack expo-router react-native-gesture-handler react-native-reanimated
npm install react-native-paper @tanstack/react-query zustand react-native-mmkv @shopify/flash-list
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: setup Expo project structure"
```

---

### Task 2: Tab Navigation (Expo Router)

**Files:**
- Create: `app/_layout.tsx`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/navigation.test.tsx
import { renderRouter } from "expo-router/testing-library";

test("renders 4 tabs", () => {
  const { queryByTestId } = renderRouter({
    app: {
      _layout: require("../app/_layout"),
    },
  });
  expect(queryByTestId("discover-tab")).toBeTruthy();
  expect(queryByTestId("browse-tab")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test navigation.test.tsx
Expected: FAIL with "Cannot find module '../app/_layout'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// app/_layout.tsx
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="discover" options={{ title: "Discover", testID: "discover-tab" }} />
      <Tabs.Screen name="browse" options={{ title: "Browse", testID: "browse-tab" }} />
      <Tabs.Screen name="compare" options={{ title: "Compare" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test navigation.test.tsx
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add app/_layout.tsx tests/navigation.test.tsx
git commit -m "feat: add Expo Router tab navigation"
```

---

### Task 3: Zustand Store for Filters

**Files:**
- Create: `stores/useFilters.ts`
- Test: `tests/useFilters.test.ts`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/useFilters.test.ts
import { useFilters } from "../stores/useFilters";

test("updates searchQuery", () => {
  const { result } = renderHook(() => useFilters());
  act(() => {
    result.current.setSearchQuery("gpt");
  });
  expect(result.current.searchQuery).toBe("gpt");
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test useFilters.test.ts
Expected: FAIL with "Cannot find module '../stores/useFilters'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// stores/useFilters.ts
import { create } from "zustand";

interface Filters {
  searchQuery: string;
  providers: string[];
  capabilities: string[];
  setSearchQuery: (query: string) => void;
}

export const useFilters = create<Filters>((set) => ({
  searchQuery: "",
  providers: [],
  capabilities: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test useFilters.test.ts
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add stores/useFilters.ts tests/useFilters.test.ts
git commit -m "feat: add Zustand store for filters"
```

---

### Task 4: Model Card Component

**Files:**
- Create: `components/ModelCard.tsx`
- Test: `tests/ModelCard.test.tsx`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/ModelCard.test.tsx
import { render } from "@testing-library/react-native";
import ModelCard from "../components/ModelCard";

test("renders model name", () => {
  const { getByText } = render(<ModelCard model={{ name: "gpt-4", provider: "openai" }} />);
  expect(getByText("gpt-4")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test ModelCard.test.tsx
Expected: FAIL with "Cannot find module '../components/ModelCard'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// components/ModelCard.tsx
import { Card, Text } from "react-native-paper";

interface ModelCardProps {
  model: {
    name: string;
    provider: string;
  };
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Card>
      <Card.Title title={model.name} subtitle={model.provider} />
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test ModelCard.test.tsx
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add components/ModelCard.tsx tests/ModelCard.test.tsx
git commit -m "feat: add ModelCard component"
```

---

### Task 5: TanStack Query for `models.json`

**Files:**
- Create: `queries/models.ts`
- Test: `tests/models.test.ts`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/models.test.ts
import { fetchModels, MODELS_QUERY_KEY } from "../queries/models";

test("fetches models", async () => {
  const mockData = [{ name: "gpt-4" }];
  global.fetch = jest.fn(() => Promise.resolve({ json: () => mockData }));
  const models = await fetchModels();
  expect(models).toEqual(mockData);
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test models.test.ts
Expected: FAIL with "Cannot find module '../queries/models'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// queries/models.ts
import { queryOptions } from "@tanstack/react-query";

export const MODELS_QUERY_KEY = ["models"];

export const fetchModels = async () => {
  const response = await fetch("https://raw.githubusercontent.com/.../models.json");
  if (!response.ok) throw new Error("Failed to fetch models");
  return response.json();
};

export const modelsQueryOptions = queryOptions({
  queryKey: MODELS_QUERY_KEY,
  queryFn: fetchModels,
});
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test models.test.ts
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add queries/models.ts tests/models.test.ts
git commit -m "feat: add TanStack Query for models.json"
```

---

### Task 6: `react-native-mmkv` Storage

**Files:**
- Create: `lib/storage.ts`

- [ ] **Step 1: Write implementation**
```typescript
// lib/storage.ts
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const loadCachedModels = () => {
  const models = storage.getString("models");
  return models ? JSON.parse(models) : null;
};

export const saveModels = (models: any[]) => {
  storage.set("models", JSON.stringify(models));
};
```

- [ ] **Step 2: Commit**
```bash
git add lib/storage.ts
git commit -m "feat: add MMKV storage for offline caching"
```

---

### Task 7: Browse Tab (Search + Filters)

**Files:**
- Create: `app/browse.tsx`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/browse.test.tsx
import { renderRouter } from "expo-router/testing-library";

test("renders SearchBar and ModelList", () => {
  const { getByPlaceholderText, UNSAFE_getByType } = renderRouter({
    app: { browse: require("../app/browse") },
  });
  expect(getByPlaceholderText("Search models...")).toBeTruthy();
  expect(UNSAFE_getByType(ModelList)).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test browse.test.tsx
Expected: FAIL with "Cannot find module '../app/browse'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// app/browse.tsx
import { Searchbar } from "react-native-paper";
import ModelList from "../components/ModelList";

export default function BrowseScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <>
      <Searchbar
        placeholder="Search models..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ModelList searchQuery={searchQuery} />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test browse.test.tsx
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add app/browse.tsx tests/browse.test.tsx
git commit -m "feat: add Browse tab with search"
```

---

### Task 8: Sentry Integration

**Files:**
- Create: `lib/sentry.ts`

- [ ] **Step 1: Write implementation**
```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 1.0,
});

export const captureError = (error: Error) => {
  Sentry.captureException(error);
};
```

- [ ] **Step 2: Install Sentry**
```bash
expo install @sentry/react-native
```

- [ ] **Step 3: Commit**
```bash
git add lib/sentry.ts
npm install @sentry/react-native
```

```bash
git add .
git commit -m "feat: add Sentry error monitoring"
```

---

### Task 9: `@shopify/flash-list` Integration

**Files:**
- Modify: `components/ModelList.tsx`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/ModelList.test.tsx
test("renders FlashList", () => {
  const { UNSAFE_getByType } = render(<ModelList models={[]} />);
  expect(UNSAFE_getByType(FlashList)).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test ModelList.test.tsx
Expected: FAIL with "Cannot find module '../components/ModelList'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// components/ModelList.tsx
import { FlashList } from "@shopify/flash-list";
import ModelCard from "./ModelCard";

interface ModelListProps {
  models: any[];
}

export default function ModelList({ models }: ModelListProps) {
  return (
    <FlashList
      data={models}
      renderItem={({ item }) => <ModelCard model={item} />}
      estimatedItemSize={120}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test ModelList.test.tsx
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add components/ModelList.tsx tests/ModelList.test.tsx
git commit -m "feat: add FlashList for performant model lists"
```

---

### Task 10: Error Banner Component

**Files:**
- Create: `components/ErrorBanner.tsx`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/ErrorBanner.test.tsx
test("shows error message", () => {
  const { getByText } = render(<ErrorBanner message="Failed to load" />);
  expect(getByText("Failed to load")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**
```bash
npm test ErrorBanner.test.tsx
Expected: FAIL with "Cannot find module '../components/ErrorBanner'"
```

- [ ] **Step 3: Write minimal implementation**
```typescript
// components/ErrorBanner.tsx
import { Banner } from "react-native-paper";

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <Banner visible={true} actions={[ { label: "Retry" } ]}>
      {message}
    </Banner>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**
```bash
npm test ErrorBanner.test.tsx
Expected: PASS
```

- [ ] **Step 5: Commit**
```bash
git add components/ErrorBanner.tsx tests/ErrorBanner.test.tsx
git commit -m "feat: add ErrorBanner component"
```

---

## Summary of Next Steps

1. **Discover Tab**: Similar to Task 7 (Browse), but with spotlight sections.
2. **Profile Tab**: Settings (theme toggle, clear cache).
3. **Offline Logic**: Enhance `fetchModels` to use cached data as fallback.
4. **Pull-to-Refresh**: Add to `ModelList` component.
5. **TypeScript Types**: Define `Model` and `Provider` types in `types/models.d.ts`.

**Plan complete.** Ready for execution using **subagent-driven-development**.