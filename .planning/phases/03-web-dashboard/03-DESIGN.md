# Phase 3: Web Dashboard & Intelligence - Design Specification

**Status:** Draft
**Target Platform:** Single-file HTML (Web)
**Deployed to:** Vercel

---

## 1. Overview

**Goal:** Build a single-file web dashboard with feature parity to the mobile app (Phase 2), implementing cost calculation intelligence and task recommendations. Deployed to Vercel with automatic GitHub integration.

**Key Constraints:**
- Single HTML file with embedded CSS/JS (no external dependencies except CDN)
- Offline-first using localStorage and Cache API
- Responsive grid layout (1/2/3 columns)
- Feature parity with mobile app

---

## 2. Architecture

### File Structure
```
web-dashboard/
  ai-model-radar.html    # Single file, all assets embedded
  data/
    models.json          # Consumed from GitHub raw URL
```

### Data Flow
```
GitHub Actions (Phase 1)
  ↓ (15-min cron)
data/models.json
  ↓
Web Dashboard (fetch)
  ↓ (cache)
localStorage + Cache API
  ↓ (offline fallback)
User
```

---

## 3. Features

### 3.1 Model Display
- **Grid Layout**: 1-column (mobile), 2-column (tablet), 3-column (desktop)
- **Model Card**: Provider logo, model name, pricing, capability tags
- **Sorting**: By launch date (newest first)
- **Search**: Real-time search with debounce (200ms)
- **Filters**: Multi-select provider filters, capability toggles

### 3.2 Pricing Intelligence (PRIC-01 to PRIC-03)
- **Input/Output Breakdown**: Side-by-side cost display
- **Batch Pricing**: Show "Batch: -25%" where applicable
- **Cost Calculator**: "Cheapest for X tokens" calculator
  - Input: token count (text input)
  - Output: cheapest model + cost

### 3.3 Task Recommendations (TASK-01 to TASK-03)
- **Categorization**: Models grouped by capability
- **Best Free Model**: "Best for [Task Type]: [Model] (FREE)"
- **Confidence Level**: "Recommended for most use cases" / "Specialized"

### 3.4 Offline Support (OFFL-01 to OFFL-02)
- **Cache Strategy**:
  - Fetch fresh data on load
  - Store in localStorage with timestamp
  - Serve cached data if fetch fails
- **Offline Indicator**: "Offline mode" banner when disconnected

---

## 4. UI/UX Specification

### 4.1 Layout Structure
```html
<header>
  <h1>AI Model Radar</h1>
  <search-bar />
</header>

<main>
  <section id="recommendations">
    <!-- "Best for X" recommendations -->
  </section>

  <section id="models">
    <!-- Filter chips + Grid of model cards -->
  </section>
</main>

<footer>
  <offline-indicator />
  <last-updated />
</footer>
```

### 4.2 Responsive Breakpoints
| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile     | <640px | 1       |
| Tablet     | 640-1024px | 2   |
| Desktop    | >1024px | 3       |

### 4.3 Color Palette (Mobile Parity)
- **Primary**: #6200EE (Purple)
- **Secondary**: #03DAC6 (Teal)
- **Success**: #00C853 (Green - fresh data)
- **Warning**: #FF9800 (Orange - stale data)
- **Error**: #D32F2F (Red - offline)
- **Background**: #FFFFFF / #121212 (dark mode)

### 4.4 Components
| Component | Description |
|-----------|-------------|
| `SearchBar` | Text input with 200ms debounce |
| `FilterChips` | Provider/capability multi-select |
| `ModelCard` | Name, provider, pricing, tags |
| `CostCalculator` | Token input + cheapest result |
| `TaskBadge` | "Best for Text Generation: GPT-3.5 (FREE)" |
| `OfflineBanner` | Red banner when offline |

---

## 5. Implementation

### 5.1 Dependencies (CDN only)
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Chart.js (optional for pricing visualization) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 5.2 Data Fetching
```javascript
const DATA_URL = "https://raw.githubusercontent.com/PraveenJayaprakash-JP/AI-Model-Radar/main/data/models.json";

async function fetchModels() {
  try {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    cacheData(data);
    return data;
  } catch (error) {
    return loadCachedData();
  }
}
```

### 5.3 Offline Logic
```javascript
function cacheData(data) {
  localStorage.setItem('models', JSON.stringify(data));
  localStorage.setItem('modelsTimestamp', Date.now());
}

function loadCachedData() {
  const cached = localStorage.getItem('models');
  return cached ? JSON.parse(cached) : null;
}

function isStale() {
  const timestamp = localStorage.getItem('modelsTimestamp');
  return timestamp && (Date.now() - timestamp) > 15 * 60 * 1000;
}
```

### 5.4 Search & Filter
```javascript
// Debounced search
let debounceTimer;
function onSearch(query) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => filterModels({ search: query }), 200);
}

// Filter by provider/capability
function filterModels({ search, providers, capabilities }) {
  // Return filtered model list
}
```

---

## 6. Deployment

### Vercel Configuration
```json
{
  "framework": null,
  "buildCommand": null,
  "outputDirectory": "."
}
```

### GitHub Integration
- Push to `main` branch triggers auto-deploy
- Custom domain: `ai-model-radar.vercel.app` (or custom)

---

## 7. Testing Strategy

### Manual Tests
| Feature | Test Case | Expected Result |
|---------|-----------|-----------------|
| Load | Open `ai-model-radar.html` | Models display within 1s |
| Search | Type "gpt" | Results filter in 200ms |
| Filter | Select "OpenAI" | Only OpenAI models shown |
| Offline | Disconnect network, refresh | Shows cached data + banner |
| Calculator | Enter "1000 tokens" | Shows cheapest model |

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 8. Success Criteria

1. **Performance**: Load time <1 second on desktop Chrome
2. **Offline**: Works fully offline after first load
3. **Parity**: All mobile features (search, filter, pricing) available
4. **Calculator**: "Cheapest for X tokens" accurate for sample inputs
5. **Deploy**: Live at Vercel URL accessible via browser

---

## 9. Next Steps

1. **Implement**: Write `ai-model-radar.html` following this spec
2. **Test**: Verify all features work in Chrome/Firefox/Safari
3. **Deploy**: Push to GitHub, Vercel auto-deploys
4. **Verify**: Confirm feature parity with mobile app

---

*Spec created: 2026-05-08*
*Phase: 3-Web Dashboard & Intelligence*