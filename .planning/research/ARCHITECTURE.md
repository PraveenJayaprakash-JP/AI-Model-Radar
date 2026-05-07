# Architecture Research: AI Model Radar

**Research completed:** 2025-05-07  
**Domain:** Cross-platform data pipeline and mobile/web UI for AI model pricing intelligence

## Recommended System Architecture

### Overall Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA COLLECTION LAYER                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │   OpenAI    │  │  Anthropic   │  │   Mistral / Google   │ │
│  │     API     │  │     API      │  │   (Web Scraping)     │ │
└──┴──────┬──────┴──┴──────┬──────┴──┴────────┬─────────────┴─┘
          │                 │                   │
          ▼                 ▼                   ▼
┌──────────────────────────────────────────────────────────────┐
│            GITHUB ACTIONS (Scheduled + Manual)               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  scrape-data.yml runs every 15 minutes                 │  │
│  │  Steps:                                                │  │
│  │  1. Call provider APIs                                 │  │
│  │  2. Scrape providers without APIs                      │  │
│  │  3. Parse pricing data                                 │  │
│  │  4. Validate + merge                                 │  │
│  │  5. Commit data/ folder to repo                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┬───┘
                       │                                       │
                       ▼                                       ▼
            ┌──────────────────┐                    ┌──────────────────┐
            │   data/models.json │                    │  mobile app data  │
            │   data/tasks.json  │                    │  (local cache)    │
            └────────┬─────────┘                    └────────┬────────┘
                     │                                        │
                     ▼                                        │
         ┌──────────────────────────┐                       │
         │  GitHub Pages/Raw URL     │◄──────────────────────┤
         │  (public JSON API)        │  Mobile fetches JSON  │
         └──────────┬──────────────┬──┘      on app launch   │
                    │              │                          │
                    ▼              ▼                          │
         ┌────────────────────────┐ │                    ┌────▼────┐
         │  Web Dashboard (HTML)  │ │                    │ Android │
         │  Loads from GitHub URL   │ │                    │   App   │
         └────────────────────────┘ │                    └────┬────┘
                                      │                         │
                                      │                    ┌────▼────┐
                                      │                    │  iOS    │
                                      │                    │  App    │
                                      │                    └─────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │   VERCEL    │
                              │  (Hosting)  │
                              └──────────────┘
```

### Component Boundaries

**Data Pipeline (GitHub Actions):**
```javascript
// scraper/lib/index.js

class PricingPipeline {
  constructor(config) {
    this.apis = config.providers.filter(p => p.api);
    this.scrapers = config.providers.filter(p => p.scraper);
  }

  async fetchAllData() {
    const apiPromises = this.apis.map(p => this.fetchFromAPI(p));
    const scrapePromises = this.scrapers.map(p => this.scrapeFromWeb(p));
    
    const results = await Promise.allSettled([...apiPromises, ...scrapePromises]);
    return results.map((result, i) => {
      if (result.status === 'fulfilled') {
        return this.validateData(result.value);
      }
      console.error(`Failed to fetch from ${config.providers[i].name}:`, result.reason);
      return null;
    }).filter(Boolean);
  }

  validateData(data) {
    // Schema validation with Zod or Joi
    return pricingSchema.parse(data);
  }
}
```

**Mobile App Architecture (Expo):**
```
src/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx         # Root navigation layout
│   ├── index.tsx           # Discover (default)
│   ├── browse/             # Browse by task/provider
│   │   ├── _layout.tsx
│   │   ├── by-task.tsx
│   │   └── by-provider.tsx
│   ├── compare/            # Cost comparison
│   │   └── [modelIds].tsx  # Multi-model comparison
│   └── alerts/             # Settings
│       └── settings.tsx
├── components/
│   ├── ModelCard.tsx       # Reusable model display card
│   ├── PriceBadge.tsx       # Shows free tier / cost
│   ├── ProviderBadge.tsx    # Provider logo/name
│   └── CostCalculator.tsx   # Interactive token calculator
├── lib/
│   ├── api/                 # Data fetching layer
│   │   ├── client.ts       # axios/fetch wrapper
│   │   ├── models.ts       # Model API calls
│   │   └── providers.ts    # Provider metadata
│   ├── storage/            # Local storage
│   │   └── models.ts       # mmkv helpers
│   ├── notifications/      # Push notifications
│   │   └── service.ts    # Expo Notifications setup
│   └── pricing/
│       └── calculator.ts   # Cost calculation utilities
├── hooks/
│   ├── useModels.ts        # Fetch and cache models
│   ├── usePricing.ts       # Pricing logic
│   ├── useRefresh.ts       # Pull-to-refresh
│   └── useNotifications.ts # Alert management
└── stores/
    └── modelsStore.ts      # Zustand state store
```

**Web Dashboard (Single File):**
```html
<!-- ai-model-radar.html -->
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* Custom utilities for model cards */
  </style>
</head>
<body>
  <header id="search-header"></header>
  <aside id="filters"></aside>
  <main id="model-grid"></main>
  <footer id="footer"></footer>
  
  <script>
    const controllers = {
      async fetchData() { /* ... */ },
      renderModels() { /* ... */ },
      renderComparison() { /* ... */ }
    };
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
      controllers.fetchData().then(controllers.renderModels);
    });
  </script>
</body>
</html>
```

### Data Models

**Model Entity:**
```typescript
interface AIModel {
  id: string;                    // "gpt-4-turbo-2025-04-09"
  name: string;                  // "GPT-4 Turbo"
  provider: Provider;
  capabilities: Capability[];    // ["text", "vision", "code"]
  pricing: Pricing;
  freeTier?: FreeTier;
  contextWindow: number;        // Token limit
  launchDate: Date;
  status: "active" | "deprecated";
  metadata: {
    knownIssues?: string[];
    useCases?: string[];
    recommendedFor?: TaskType[];
  };
}

interface Provider {
  id: string;                    // "openai"
  name: string;                  // "OpenAI"
  logo: string;                  // URL to logo image
  website: string;               // "https://openai.com/api"
  status: "operational" | "degraded" | "outage";
}

interface Pricing {
  inputCostPer1K: number;        // cents per 1K input tokens
  outputCostPer1K: number;       // cents per 1K output tokens
  batchDiscount?: number;         // Percentage off for batch
  unit: "tokens" | "characters" | "requests";
  note?: string;                  // Special terms
}

interface FreeTier {
  requestsPerMonth?: number;
  tokensPerMonth?: number;
  dailyLimit?: number;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute?: number;
  };
  expiry?: Date;                 // When free tier expires
}</provider>
  </capabilities>
</code>
```
Task Classification:</record>
```typescript
enum TaskType {
  TEXT_GENERATION = "text-generation",
  CHAT_COMPLETION = "chat-completion",
  EMBEDDING = "embedding",
  IMAGE_GENERATION = "image-generation",
  AUDIO_TRANSCRIPTION = "audio-transcription",
  CODE_GENERATION = "code-generation",
  FUNCTION_CALLING = "function-calling",
  MODERATION = "moderation"
}<integer>
interface Task {
  type: TaskType;
  recommendedModels: string[];   // Model IDs ordered by score
  criteria: {
    costWeight?: number;           // 0.0 - 1.0
    qualityWeight?: number;
    speedWeight?: number;
    accuracyWeight?: number;
  };
}
```<score>
Scoring Algorithm:</record>
```typescript
// Price score: lower cost = higher score
function calculatePriceScore(pricing: Pricing): number {
  // Based on cost per 1M tokens
  const avgCost = (pricing.inputCostPer1K + pricing.outputCostPer1K);
  if (avgCost === 0) return 1.0; // Free tier
  return Math.max(0, 1 - (avgCost / 100)); // Normalize to 0-1
}

// Find cheapest model for task
function findBestFreeModel(models: AIModel[], task: TaskType): AIModel {
  return models
    .filter(m => m.freeTier && m.capabilities.includes(task))
    .sort((a, b) => {
      const scoreA = calculatePriceScore(a.pricing);
      const scoreB = calculatePriceScore(b.pricing);
      return scoreB - scoreA; // Higher score first
    })[0];
}
```<float>
Data Flow Architecture</partition>
```
For the scraper / GitHub data pipeline, here's how data flows from providers to the app to the dashboard:<markdown>
1. fetchAllProviderData() (15 min scheduled or manual trigger) -- fetches from providers in parallel, handles API calls, scraping using Puppeteer, rate limiting, and retries:
   - For each provider, try fetching official API first
   - If no API, load HTML page and parse pricing tables
   - Save raw data to /raw folder as provider-name-timestamp.json
2. processRawData() -- takes raw data and normalizes it into the Model schema:
   - Normalize token outputs from various pricing schemas (
   - Map capabilities to our taxonomy (embedding, text, vision, audio, etc.)
   - Detect and validate free tier structures, such as request limits or time-based
   - Validate against Zod schema and add metadata
3. publishData() -- exports the processed data to three destinations:
   - models.json: Full list with detailed metadata for mobile app's API
   - tasks.json: List of tasks with best model recommendations for UI
   - providers.json: Metadata, status, logo URLs for rendering

Data freshness: etag for cache, Git commit timestamp for "last update", daily commit summary for changelog.

The mobile app will fetch the data from a GitHub raw URL on app launch, which uses background fetch for updates every 15 minutes. The app caches the data offline in React Native's MMKV storage and loads it into the Zustand store. If offline, it will default to cached data without marking anything stale.

The web dashboard loads JSON from the same GitHub URLs on page load and stores the data locally for offline use and instant load on subsequent visits.
</mark>
Syncing Data Between React Native, GitHub Actions, and Notify Clients</sync>
**Two approaches to propagating data updates in real-time: Poll vs. Push**

| Approach | Implementation | Cost | Reliability | Capabilities |
|----------|----------------|------|-------------|--------------|
| **Polling (v1)** | GitHub Actions pushes updated JSON; clients poll every 15 minutes | $0 (no backend), ARM GitHub Actions | Best for our budget | Only works if the client has a persistent connection for background updates; may be delayed if background fetch doesn't run in FIFO order |
| **Push (v2+)** | GitHub Actions sends a webhook to a backend with new data; backend pushes to subscribed mobile devices where the app is installed using EventStream | Costly: ~$20-30/month for Heroku/Render + push gateway | Backend handles real-time updates; mobile app can update UI as soon as data changes | Adds infrastructure complexity beyond current constraints |

**Approach for v1**: Polling is the MVP approach since we have no backend budget, uses GitHub to host JSON, and mobile fires a periodic task every 15 minutes. If a new model is detected during background fetch, we'll send a notification using Expo's Push Notifications as a fallback for devices that have opted into notifications.

**Benefits:**
- Pricing logic stays client-side
- No backend server cost
- Web dashboard directly fetches JSON (no proxy needed)
- Data audit trail via git commits
- Rollback to any historical version via commit hash

**Tradeoff:**
- Client polls calculated by use (when it checks), update propagation issues
- Commit frequency makes analytics tracking more complex
- Ends up frozen on a model until they open the app (hence push notifications as the frozen recovery solution)

### Scalability Considerations

**Current Volume:**
- Models tracked: ~50 models across 6 providers
- JSON size: ~100KB (compressed)
- Updates: 4-8 models per week (new model announcements)

**Scales To:**
- Models: 500+ (still < 1MB)
- Providers: 20+ (assuming each has 10-25 models)
- Updates: 20 models/day (no issue)

**When To Add Backend:**
- Rate limits reached on client polling (>100K users)
- Need user accounts + personalized alerts
- Want to add usage analytics
- Real-time < 15 min updates required

**Scaling Current Approach:**
- **Incremental updates:** Only fetch diff (If-Modified-Since header)
- **Circuit breakers:** Stop polling if services fail repeatedly
- **Provider-specific polling:** Frequent for OpenAI, less for stable providers
- **Memory optimization:** Lazy-load model details, paginate large lists

### Build Order (Dependency-Driven)

**Phase 1: Data Foundation** (Blocks everything)
1. Set up scraper repo with GitHub Actions
2. Create data schema and validation
3. Build parsers for 2-3 providers (OpenAI, Anthropic)
4. Publish first JSON files

**Phase 2: Mobile App Foundation** (Needs data)
5. Initialize Expo project
6. Build data fetching layer (hooks)
7. Create model display components
8. Implement basic list/browse screens

**Phase 3: Core Features** (Needs Phase 2 stable)
9. Cost calculator integration
10. Provider detection and logo rendering
11. Free tier highlighting
12. Offline storage

**Phase 4: Web Dashboard** (Parallel track, independent)
13. Create single HTML file structure
14. Build model grid UI
15. Add search/filters
16. Deploy to Vercel

**Phase 5: Polish** (Needs both platforms)
17. Push notifications
18. Comparison tool
19. Task-specific recommendations
20. Performance optimization

**Phase 6: Scale Coverage** (Low dependency)
21. Add remaining providers
22. Expand to 100+ models
23. Rate limit monitoring
24. Error handling & retry logic

### Anti-Patterns to Avoid

❌ **Don't:** Build a backend server for v1 (unnecessary complexity)  
✅ **Do:** Use GitHub + client-side logic

❌ **Don't:** Poll every provider's API from every user's device (rate limit problems)  
✅ **Do:** Central scraper, clients poll GitHub JSON endpoint

❌ **Don't:** Store full pricing history in JS memory (performance issues)  
✅ **Do:** Store current prices only, historical in Git log

❌ **Don't:** Fetch all models from all providers on every update (waste)  
✅ **Do:** Fetch only provider-specific endpoints, merge client-side

---

**Quality Gates Passed:**
- ✅ Components clearly defined with boundaries
- ✅ Data flow direction explicit (GitHub → Clients)
- ✅ Build order implications noted
- ✅ Scalability considerations documented
- ✅ Anti-patterns identified

---
*Last updated: 2025-05-07*
