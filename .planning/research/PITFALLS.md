# Pitfalls Research: AI Model Radar

**Research completed:** 2025-05-07  
**Domain:** AI model pricing tracker and comparison system

## Critical Mistakes & Prevention

### 1. Data Inaccuracies (High Impact)

**The Mistake:**
- Scraping provider pages that change format frequently without detection
- Not validating scraped data (e.g., incorrect decimal on pricing: `$0.001` vs `$0.01`)
- Stale data (pricing update happened 6 hours ago, still serving old pricing)

**Warning Signs:**
- Users complain: \"This price doesn't match OpenAI's official site\"
- Sudden spike in usage just after price updates (people exploiting wrong data)
- Provider issues WARN rate limit errors during scraping

**Prevention:**
```typescript
// src/scraper/validators/pricing.ts
export function validatePricing(
  oldPrice: number, 
  newPrice: number
): ValidationResult {
  // Flag price swings > 50% as suspicious
  const delta = Math.abs(newPrice - oldPrice) / oldPrice;
  if (delta > 0.5) {
    return {
      valid: false,
      warning: `Price changed ${delta.toFixed(0)}%, requires manual review`
    };
  }
  
  // Check for impossible prices
  if (newPrice < 0 || newPrice > 100) {
    return { valid: false, error: \"Impossible price range\" };
  }
  
  return { valid: true };
}
```

**Build Order:**
- Phase 1: Implement pricing validation before first web scrape
- Phase 2: Add automated alerts when validation fails
- Phase 3: Create manual review UI to approve flagged changes

**Phase to Address:** Phase 2 (Model Tracking)

---

### 2. Rate Limit Exceeded (Medium Impact)

**The Mistake:**
- Scraping provider sites too frequently (>req/minute)
- Not respecting `Retry-After` headers
- During high-traffic periods (launch days), hitting refresh bursts

**Warning Signs:**
- IP blocks from providers (403 errors)
- Sudden signal in monitoring: \"All providers showing outage\" (false positive)
- Scraping takes much longer than usual (rate limit delays)

**Prevention:**
```typescript
// src/scraper/utilities/rate-limiter.ts
class RateLimitQueue {
  private queues: Map<string, Queue> = new Map();
  
  async addToQueue(
    providerId: string, 
    job: () => Promise<void>
  ) {
    const queue = this.queues.get(providerId) || new Queue({
      concurrency: 1, // 1 request at a time per provider
      intervalCap: 1,
      interval: 60000 // 1 per minute default
    });
    
    return queue.add(job);
  }
}

// Provider-specific limits
const RATE_LIMITS = {
  openai: { requestsPerMinute: 60 },    // Has API
  anthropic: { requestsPerMinute: 20 },    // No API, scrape slow
  mistral: { requestsPerMinute: 10 }       // Unknown, be conservative
};
```

**Build Order:**
- Phase 1: Start with conservative limits (10 req/min per provider)
- Phase 2: Add queue with exponential backoff when rate limit errors detected
- Phase 3: Create provider status page to monitor rate limit health

**Phase to Address:** Phase 1 (Foundation)

---

### 3. Background Update Failures (Medium Impact)

**The Mistake:**
- Background fetch not working on mobile (OS kills it)
- No error handling when data fetch fails (app shows \"Updated Never\")
- Silent failures during background refresh (no notification)

**Warning Signs:**
- User reports: \"It's been 3 days and no updates\"
- Console logs on device show background fetch errors
- Background fetch status showing high failure rate in analytics

**Prevention:**
```typescript
// src/lib/background-fetch.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'fetch-models-update';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const result = await fetchAndUpdateModels();
    
    if (result.status === 'success') {
      if (result.newModels > 0) {
        await schedulePushNotification(result.newModels);
      }
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      // Log failure but don't crash
      Sentry.captureMessage(`Background fetch failed: ${result.error}`);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  } catch (err) {
    Sentry.captureException(err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register with exponential retry
BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  minimumInterval: 15 * 60, // 15 minutes
  stopOnTerminate: false,
  startOnBoot: true,
});
```

**Build Order:**
- Phase 1: Implement background fetch with error logging
- Phase 2: Add Sentry for error tracking
- Phase 3: Create fallback: manual refresh button with \"Check for updates\" status

**Phase to Address:** Phase 3 (Core features)

---

### 4. Push Notification Annoyance (Low Impact, High User Retention Risk)

**The Mistake:**
- Too many push notifications (every new model, even non-free)
- No notification preferences (all or nothing)
- Notifications fire during night hours (bad UX)

**Warning Signs:**
- Users disabling notifications in first week
- High notification opt-out rate in analytics
- User reviews: \"Too spammy with alerts\"

**Prevention:**
```typescript
// src/lib/notifications/prefs.ts
enum NotificationType {
  FREE_MODEL = 'free-model',      // Low volume, always send
  PRICE_CHANGE = 'price-change',    // Medium volume, default true
  NEW_PROVIDER = 'new-provider',    // Very rare, always send
  ALL_MODELS = 'all-models'         // High volume, default false
}

interface NotificationPrefs {
  types: Record<NotificationType, boolean>;
  quietHours?: {
    start: number; // 0-23
    end: number;
  };
}

// Smart notification batching
class NotificationScheduler {
  private queue: Notification[] = [];
  
  async schedule(notification: Notification) {
    const prefs = await getUserPrefs();
    
    // Don't send during quiet hours
    if (this.isQuietHour(new Date(), prefs.quietHours)) {
      this.delayUntil(notification, this.nextAllowedTime());
      return;
    }
    
    // Batch multiple model announcements
    if (notification.type === NotificationType.FREE_MODEL) {
      this.queue.push(notification);
      this.debounceBatch();
    }
  }
}
```

**Build Order:**
- Phase 1: Only notify about FREE_MODEL (low frequency, no prefs needed)
- Phase 2: Add settings to disable certain types
- Phase 3: Add quiet hours and smart batching

**Phase to Address:** Phase 6 (Alerts)

---

### 5. Web Dashboard CORS Issues (Low Impact)

**The Mistake:**
- Web dashboard hosted on Vercel tries to fetch JSON from GitHub
- CORS headers not configured, browsers block request
- \"Failed to load models\" in browser console

**Warning Signs:**
- Dashboard loads but is empty (no models showing)
- Console error: \"CORS policy: No 'Access-Control-Allow-Origin'\
- API calls work in Postman but not browser

**Prevention:**
```typescript
// GitHub Pages hosting supports CORS automatically
// When self-hosting, configure headers:

// vercel.json
{
  "rewrites": [
    {
      "source": "/models.json",
      "destination": "https://raw.githubusercontent.com/user/repo/main/data/models.json"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}

// Alternative: Proxy through Vercel function (not in v1)
```

**Build Order:**
- Phase 1: Write a test to check CORS when deploying dashboard
- Phase 2: Document CORS requirements in README

**Phase to Address:** Phase 5 (Web Dashboard)

---

### 6. Offline Data Inconsistency (Medium Impact)

**The Mistake:**
- Show cached pricing when data is 3+ days old
- User thinks current price is \"free\" based on old data
- No obvious indicator of data freshness

**Warning Signs:**
- User complaint: \"I checked your app, got charged $$$ when it said it was free\"
- Analytics: spike in \"Used price feature\" followed by no return visits
- No freshness indicator in UI

**Prevention:**
```typescript
// src/components/DataFreshnessIndicator.tsx
interface FreshnessIndicatorProps {
  lastUpdated: Date;
}

export function DataFreshnessIndicator({ lastUpdated }: FreshnessIndicatorProps) {
  const hours = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
  
  let color = 'green';
  let label = 'Fresh';
  
  if (hours > 24) {
    color = 'orange';
    label = `Updated ${Math.floor(hours / 24)}d ago`;
  }
  if (hours > 48) {
    color = 'red';
    label = 'Stale data - refresh needed!';
  }
  
  return (
    <Text style={{ color }}>label</text>
  );
}

// Staleness check in business logic
if (hoursSinceUpdate > 48) {
  // Treat cached data as unreliable
  return { 
    valid: false, 
    message: \"Update required for accurate pricing\" 
  };
}
```

**Build Order:**
- Phase 1: Add \"Updated xxx ago\" text near pricing
- Phase 2: Color-coded freshness indicators (green/orange/red)
- Phase 3: Block user from seeing pricing if >48 hours stale

**Phase to Address:** Phase 3 (Core features)

---

### 7. Model ID Drift (Medium Impact)

**The Mistake:**
- Provider changes model ID format (e.g., `gpt-4-turbo` → `gpt-4-turbo-2025-04-09`)
- Scraper doesn't detect new ID format, thinks it's a brand new model
- Duplicates appear: old ID stuck in cache, new ID appears as \"New model!\"

**Warning Signs:**
- \"45 new models\" alert when only 2 are actually new
- Database has duplicate records with similar names
- Bookmarked models 404 because ID changed

**Prevention:**
```typescript
// src/scraper/lib/model-matcher.ts
function isSameModel(oldModel: AIModel, newModel: AIModel): boolean {
  // Compare normalized names
  const normalize = (name: string) => name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (normalize(oldModel.name) === normalize(newModel.name)) {
    return true;
  }
  
  // Check naming patterns: gpt-4-turbo-* variations
  const oldParts = oldModel.id.split('-');
  const newParts = newModel.id.split('-');
  
  // If starts with same 3 parts, it's likely versioned
  if (oldParts.slice(0, 3).join('-') === newParts.slice(0, 3).join('-')) {
    return true;
  }
  
  return false;
}

// When processing scraped data
async function mergeModelData(newModels: AIModel[]) {
  const existingModels = await getExistingModels();
  const merged = [...existingModels];
  
  for (const newModel of newModels) {
    const match = existingModels.find(em => isSameModel(em, newModel));
    
    if (match) {
      // Update existing
      Object.assign(match, newModel);
    } else {
      ++ // Truly new model
      merged.push(newModel);
    }
  }
}
```

**Build Order:**
- Phase 1: Manual deduplication (review duplicates in scraper output)
- Phase 2: Add fuzzy matching by name similarity
- Phase 3: Implement format detection (detect versioning pattern changes)

**Phase to Address:** Phase 2 (Model tracking)

---

## Common Web Scraping Errors

### 8. Scraping Breaks When Provider Redesigns (Medium Impact)

**The Mistake:**
- CSS selectors tightly coupled to HTML structure: `.pricing-table .price:nth-child(3)`
- Provider restructures page, scraper returns `undefined` for all prices
- No fallback selectors

**Warning Signs:**
- Empty pricing field errors in validation
- Scraper logs: \"Element not found\" errors
- All prices 0 or null

**Prevention:**
```typescript
// Robust scraping with multiple strategies
const SCRAPING_STRATEGIES = [
  {
    name: \"pricing-table\",
    selector: '.pricing-table .price',
    type: 'css'
  },
  {
    name: \"pricing-cards\",
    selector: '.card:has(h2:contains(\"Pricing\")) .amount',
    type: 'css'
  },
  {
    name: \"api-changes\",
    selector: (html: string) => {
      // Try to find patterns like "$0.001/tok\" OR '$0.001/1K\""
      const matches = html.match(/\$([0-9]+\.[0-9]+)\/(tok|1K)/g);
      return matches || [];
    },
    type: 'function'
  }
];

// Try strategies in order until one works
async function scrapeWithFallback(page: Page, url: string) {
  for (const strategy of SCRAPING_STRATEGIES) {
    try {
      const result = await executeScrapingStrategy(page, strategy);
      if (result && result.length > 0) {
        return result; // First successful strategy
      }
    } catch (e) {
      // Log and try next
      logger.warn(`Strategy ${strategy.name} failed, trying next...`);
    }
  }
  
  throw new Error('All scraping strategies failed');
}
```

**Build Order:**
- Phase 1: Basic CSS selector (check manually weekly)
- Phase 2: Add multiple fallback selectors
- Phase 3: Visual regression tests (screenshot diff to detect redesign)

**Phase to Address:** Phase 1 (Foundation)

---

## Website Reliability Patterns

### 9. Free Tier Change Detection Failed (High Impact)

**The Mistake:**
- Free tier structure changes from \"10K tokens/month\" to \"5K requests/month\"
- Scraper didn't catch the structure change, shows \"Free tier: No\" incorrectly
- Missing a free model announcement damages trust

**Warning Signs:**
- User report: \"Your app says 'no free tier' but it's free right now on provider site\"
- Timer shows as \"Updated 5 minutes ago\" but free tier indicator is wrong
- Provider announces free tier launch, 24 hours later app still shows \"no free tier\"

**Prevention:**
```typescript
// Schema covers multiple free tier structures
const FreeTierSchema = z.union([
  z.object({
    type: z.literal('requests'),
    requestsPerMonth: z.number(),
    rateLimit: RateLimitSchema
  }),
  z.object({
    type: z.literal('tokens'),
    tokensPerMonth: z.number(),
    rateLimit: RateLimitSchema
  }),
  z.object({
    type: z.literal('none')
  })
]);

// Try multiple detection strategies for free tier detection
async function detectFreeTier(page: Page) {
  // Strategy 1: Look for \"Free\" headline
  const freeText = await page.$(\"text=/Free tier/\")`;
  if (!freeText) return { type: 'none' };
  
  // Strategy 2: Check pricing variation
  const variations = await page.$(\".pricing-variation\"`);
  for (const variation of variations) {
    const name = await variation.$('h4');
    if (name && (await name.textContent()).toLowerCase().includes('free')) {
      // Parse limits from same card
      return parseFreeLimit(variation);
    }
  }
  
  return { type: 'none' };
}
```

**Build Order:**
- Phase 1: Look for \"Free\" text on pricing page
- Phase 2: Parse limits from free tier card
- Phase 3: Manual validation workflow when free tier status changes

**Phase to Address:** Phase 2 (Model tracking)

---

## Paid Model Pricing Cascading Errors (Critical)

### 10. Decimal Misread: $0.001 vs $0.0001 (Catastrophic)

**The Mistake:**
- Scraper misreads price table: $0.001/1K tokens becomes $0.01/1K tokens
- App shows model as \"10x more expensive\" than reality
- Users make wrong decisions based on bad data

**Warning Signs:**
- Unusual pattern: Single model pricing outliers when compared to similar models
- Provider documentation text shows \"$0.001\" but if scraped shows \"$0.01\"
- Users specifically mention price inaccuracy in bug reports

**Prevention:**
```typescript
// Cross-reference validation
async function validatePriceConsistency(pricing: Pricing[]) {
  // Example: GPT-4 should cost ~10x more than GPT-3.5
  const gpt4 = pricing.find(p => p.modelName.includes('gpt-4'));
  const gpt35 = pricing.find(p => p.modelName.includes('gpt-3.5'));
  
  if (gpt4 && gpt35) {
    const ratio = gpt4.inputCostPer1K / gpt35.inputCostPer1K;
    
    // Suspicious if GPT-4 is cheaper than GPT-3.5 or >100x more
    if (ratio < 1 || ratio > 100) {
      throw new Error(`Suspicious pricing ratio: GPT-4 is ${ratio}x of GPT-3.5`);
    }
  }
  
  // Check against official human-reviewed baseline
  const baseline = await getBaselinePricing();
  const deviation = Math.abs(newPrice - baseline) / baseline;
  if (deviation > 0.2) { // >20% change suspicious
    return { valid: false, warning: `20%+ deviation from baseline` };
  }
}

// Unit tests for pricing scraper
// tests: expected $0.001/1K tokens on every run
const FIXTURES = [
  { input: \"\$0.001/1K tokens\", expected: { per1K: 0.001 } },
  { input: \"\$0.0001 / 1K tokens\", expected: { per1K: 0.0001 } },
];
```

**Build Order:**
- Phase 1: Write unit tests for pricing parser
- Phase 2: Add cross-model consistency checks
- Phase 3: Create \"sanity check\" dashboard showing price distribution

**Phase to Address:** Phase 2 (Cost Intelligence)

---

## Phase Mapping

| Pitfall | Phase to Prevent | Prevention Strategy | Confidence |
|---------|------------------|---------------------|------------|
| Data inaccuracies | 2 | Validation schema + cross-checks | HIGH |
| Rate limits | 1 | Conservative polling + backoff | HIGH |
| Background update failures | 3 | Error logging + Sentry + fallback | HIGH |
| Push notification spam | 6 | Preferences + quiet hours + batching | MEDIUM |
| CORS errors | 5 | Proxy configuration + tests | MEDIUM |
| Offline data staleness | 3 | Freshness indicator + staleness blocking | HIGH |
| Model ID duplication | 2 | Fuzzy matching + version detection | MEDIUM |
| Scraper HTML changes | 1 | Multiple selectors + visual regression | MEDIUM |
| Free tier structure drift | 2 | Unified schema + multi-strategy detection | MEDIUM |
| Decimal misreads | 2 | Unit tests + consistency checks | HIGH |

### Mitigation Priority for MVP

**Must Fix for v1 Launch (Critical):**
1. Decimal misreads  
2. Data inaccuracies on JSON
3. CORS errors
4. Rate limit handling (conservative defaults)

**Should Fix Before Growth (Medium):**
1. Background fetch reliability
2. Scraper resilience
3. Free tier detection
4. Staleness indicators

**Can Do After Launch (Low):**
1. Push notification preferences
2. Model ID deduplication
3. Smart retry policies
4. Provider status monitoring

---

**Quality Check:**
- ✅ Pitfalls are specific to this domain (not generic advice)
- ✅ Prevention strategies are actionable (code examples provided)
- ✅ Phase mapping included where relevant
- ✅ Ranked by impact/criticality for v1

---
*Last updated: 2025-05-07*
