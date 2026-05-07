# Stack Research: AI Model Radar

**Research completed:** 2025-05-07  
**Domain:** Cross-platform mobile app (React Native / Expo) + web dashboard for AI model pricing intelligence

## Recommendation: React Native (Expo) for Mobile

**Rationale:**
- **Single codebase for iOS + Android:** Share 95%+ of code between platforms
- **Rapid prototyping:** Expo's `npx create-expo-app` gets you running in minutes
- **Over-the-air updates:** Push updates without app store review cycles
- **Rich ecosystem:** 1000+ native modules available
- **Active community:** Expo team works directly with React Native team at Meta

**Versions (current as of 2025-05-07):**
- Expo SDK 52+ (latest stable)
- React Native 0.77+
- TypeScript 5.x+ (recommended for type safety)

**Key Libraries to Use:**

| Library | Purpose | Why This One |
|---------|---------|--------------|
| **Expo Router** | Navigation | File-based routing, built into Expo |
| **@tanstack/react-query** | Data fetching | Industry standard, caching, optimistic updates |
| **Zustand** | State management | Lightweight, no boilerplate, popular |
| **Expo Notifications** | Push alerts | Native push without native files |
| **Expo Background Fetch** | Background polling | Handles background data updates |
| **react-native-mmkv** | Local storage | 30x faster than AsyncStorage, encryption |
| **@shopify/flash-list** | Virtualized lists | Better performance than FlatList |
| **Expo Web** | Web deployment | Same code for mobile + web |

**Architecture Patterns:**
- **Feature-based folders:** Each screen/feature gets its own folder with components, hooks, utils
- **Custom hooks:** Encapsulate data fetching (useModels, usePricing)
- **Presenter/container:** Separate UI from business logic

**Testing Style:**
- **Jest + Testing Library** for unit tests
- **Maestro** for end-to-end testing (recommended for mobile)
- **Test on real devices:** Expo's EAS Build simplifies building for device testing

**What NOT to Use:**
- ❌ **Redux** - Too much boilerplate for this app size
- ❌ **React Navigation (without Expo Router)** - Extra setup without benefits
- ❌ **Native directories** (ios/, android/) - Let Expo manage
- ❌ **Expo Managed Workflow** - Use Bare Workflow for npm module flexibility

## Web Dashboard: Single-File Approach

**Recommendation:** Single HTML file with Tailwind CSS and Vanilla JS

**Rationale:**
- **Zero build process:** No webpack, no bundler complexity
- **Fits Vercel 10MB limit:** Can easily stay under size constraint
- **Ultra-fast deployment:** Just upload the file
- **Easy maintenance:** Single file to manage
- **Web feature parity:** Same features as mobile in desktop layout

**Stack:**
- **Tailwind CSS (CDN):** Utility-first styling without custom CSS
- **Vanilla JS:** No framework needed for single-file dashboard
- **Fetch API:** Pull JSON from GitHub-hosted data files
- **LocalStorage:** Cache for offline viewing
- **Chart.js:** If needed for cost comparison visualizations

**Structure:**
```
ai-model-radar.html
├── <style> (Tailwind CDN + custom utilities)
├── <script> (Vanilla JS with functions for:)
│   ├── fetchModelData()        // Load from GitHub JSON
│   ├── renderModelList()       // Display models
│   ├── renderComparisonTable() // Side-by-side costs
│   └── searchAndFilter()       // Real-time filtering
└── <body> (Responsive grid layout)
    ├── Header with search
    ├── Model cards (price, provider, free tier status)
    └── Free models spotlight section
```

**What NOT to Use:**
- ❌ **Next.js / React** - Overkill for single file, adds bundle size
- ❌ **Vue / Angular** - Same reasoning
- ❌ **npm dependencies** - Should be able to double-click and open file

## Data Collection Strategy: Hybrid Approach

### API Data (Preferred)

**Providers with Official APIs:**
- **OpenAI:** `/v1/models` endpoint gives model list
- **Anthropic:** Pricing published in docs, accessible via API
- **Together.ai:** API for model list + pricing

**Access Pattern:**
```typescript
// Fetch with rate limiting
const fetchWithRetry = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Backoff
    return fetchWithRetry(url, options); // Retry
  }
};
```

### Web Scraping (Fallback)

**When APIs unavailable (Mistral, Google):**
- Use **Playwright** or **Cheerio** for static HTML parsing
- Scheduled scraping via **GitHub Actions** or **Vercel Cron Jobs**
- Cache results in GitHub repo as JSON
- **Respect robots.txt** and rate limits

**Scraping Setup:**
```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'] }}
  ],
  webServer: {
    command: 'npm run start',
    port: 3000
  }
};
```

**Data Pipeline:**
1. **GitHub Actions workflow** runs every 15 minutes
2. **Scraper script** fetches provider HTML
3. **Parser extracts:** model names, pricing, free tier details
4. **Output JSON** committed back to repo
5. **Mobile app** triggers background fetch  
6. **Web dashboard** loads JSON from raw.githubusercontent.com

**Scheduling:**
```yaml
# .github/workflows/scrape-models.yml
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:  # Manual trigger
```

**What NOT to Use:**
- ❌ **Puppeteer** - More overhead than Playwright for simple scraping
- ❌ **Real-time streaming APIs** - Not needed, polling is fine
- ❌ **Paid data providers** - Free tier + scraping is sufficient
- ❌ **Cloud databases** - Static JSON in GitHub works for v1

## Build, Test, Deploy

**Mobile App (Expo):**
```bash
# Development
npx expo start                    # Start dev server
npx expo install <package>        # Install native-compatible package

# Testing on device
npx expo prebuild                # Generate native projects (if needed)
npx expo run:android             # Run on Android emulator
npx expo run:ios                 # Run on iOS simulator

# Build for production
npx eas build --platform android # Build APK/AAB
npx eas build --platform ios     # Build for App Store

# Over-the-air updates
npx eas update --auto            # Push update to users
```

**Web Dashboard:**
```bash
# Development
# Just open ai-model-radar.html in browser   
# Or serve locally: npx serve .

# Deploy to Vercel
npx vercel --prod
```

**Scraper:**
```bash
# Run locally
node scraper/index.js

# Test GitHub Actions
act -j scrape-models
```

## Cost Analysis

**Free Tier Coverage:**
- **Expo EAS** - Free tier includes OTA updates
- **Vercel** - Free tier for web dashboard
- **GitHub Actions** - 2000 minutes/month free (adequate for 15-min scraper)
- **Expo Cloud Builds** - Some free, paid for store submissions
- **Push notifications** - Expo free tier (install time limit)

**When Costs Could Increase:**
1. User base grows > 10K daily active users (push notifications)
2. Scraping frequency to 5-min intervals (GitHub Actions minutes)
3. Add user accounts + backends (database hosting)

---

**Quality Check:**
- ✅ Versions are current (Expo SDK 52+, React 18+)
- ✅ Rationale explains WHY (not just WHAT)  
- ✅ Confidence levels: HIGH for stack choices, MEDIUM for hybrid approach, HIGH for client-side architecture

---
*Last updated: 2025-05-07*
