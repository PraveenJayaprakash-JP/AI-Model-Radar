# Roadmap: AI Model Radar

**Created:** 2025-05-07  
**Granularity:** Coarse (4 phases)  
**Mode:** YOLO (Auto-approve, YOLO execution)  
**Project Path:** D:\Opencode\New folder

---

## Phase 1: Foundation & Data Pipeline

**Goal:** Establish data collection pipeline that continuously scrapes pricing data from AI providers and publishes structured JSON files. This foundation enables all downstream consumer applications.

**Mode:** mvp  
**Estimated Duration:** 5-7 days

### Requirements (6 total)
- [x] **DATA-01**: Scraper runs every 15 minutes via GitHub Actions
- [x] **DATA-02**: Fetch from provider APIs (OpenAI, Anthropic)  
- [x] **DATA-03**: Scrape providers without APIs (Mistral, Google)
- [x] **DATA-04**: Validate pricing data structure
- [x] **DATA-05**: Publish models.json to repository
- [x] **DATA-06**: Publish tasks.json with recommendations

### Success Criteria
1. GitHub Actions workflow runs successfully (cron triggers observed)
2. models.json file accessible at raw GitHub URL and contains data
3. Scraper handles both API responses and HTML parsing correctly
4. 6 providers covered: OpenAI, Anthropic, Google, Mistral, Replicate, Together.ai
5. Data validation prevents malformed JSON from being committed

### Key Decisions
- **Provider polling frequency:** 15 minutes (balance data freshness vs rate limits)
- **Schema structure:** Denormalized for client convenience (one JSON per file type)
- **API vs scraping:** Use official APIs when available (OpenAI, Anthropic), scrape for rest

### Next Phase Trigger
When DATA-05 is complete (models.json published and accessible), proceed to Phase 2.

---

## Phase 2: Core Mobile App

**Goal:** Build cross-platform mobile app using React Native (Expo) that consumes published JSON data and provides intuitive browsing/search experience for AI models.

**Mode:** mvp  
**Estimated Duration:** 8-10 days

### Requirements (18 total)

#### Model Tracking (MODEL-01 to MODEL-07)
- [ ] Display list of all models with metadata
- [ ] Show free tier availability with limits
- [ ] Display cost-per-token pricing
- [ ] Show rate limits
- [ ] Display freshness indicator
- [ ] Sort by launch date

#### Discovery & Search (DISC-01 to DISC-05)
- [ ] Search models by name or provider
- [ ] Filter by provider (multi-select)
- [ ] Filter by capability
- [ ] \"New Models\" section
- [ ] \"Free Models\" spotlight

#### Mobile App (MOB-01 to MOB-06)
- [ ] Tab-based navigation (Discover, Browse, Compare, Profile)
- [ ] Model cards with provider logo, name, pricing, tags
- [ ] Pull-to-refresh gesture
- [ ] Error state handling with Sentry
- [ ] Background fetch every 15 minutes
- [ ] Share model details via OS share sheet

### Success Criteria
1. App runs on both iOS and Android (physical or emulated devices)
2. Model list displays within 2 seconds of app launch
3. Search returns results within 200ms
4. Filters apply immediately without reload
5. Pull-to-refresh updates data successfully
6. Background fetch runs without blocking UI
7. Error states show \"retry\" button and log to Sentry
8. No blocking UI thread operations

### Key Decisions
- **Navigation:** Expo Router with file-based routing
- **State management:** Zustand for global state, TanStack Query for server state
- **Storage:** react-native-mmkv for speed and encryption
- **List performance:** @shopify/flash-list instead of FlatList

### Next Phase Trigger
When MOB-01 through MOB-04 are complete (navigation, cards, search, filters working), proceed to Phase 3.

---

## Phase 3: Web Dashboard & Intelligence

**Goal:** Deliver single-file web dashboard with feature parity to mobile and implement cost calculation intelligence. Web dashboard proves the data pipeline works for all clients.

**Mode:** mvp  
**Estimated Duration:** 8-10 days

### Requirements (17 total)

#### Web Dashboard (WEB-01 to WEB-05)
- [ ] Single HTML file with embedded assets
- [ ] Responsive grid layout (1/2/3 columns)
- [ ] Real-time search with filtering
- [ ] Feature parity with mobile app
- [ ] Deployed to Vercel

#### Offline Support (OFFL-01 to OFFL-02)
- [ ] Cache model data locally
- [ ] Store fallback JSON for offline mode

#### Pricing Intelligence (PRIC-01 to PRIC-03)
- [ ] Calculate cost-per-token for all models
- [ ] Show input vs output cost breakdown
- [ ] Display batch pricing discounts
- [ ] \"Cheapest for X tokens\" calculator

#### Task Recommendations (TASK-01 to TASK-03)
- [ ] Categorize models by capability
- [ ] Recommend best free model per task
- [ ] Display confidence level and use cases

### Success Criteria
1. Web dashboard deployed at vercel.app URL
2. Loads in <1 second on desktop Chrome
3. Search/filter works identically to mobile
4. Task recommendations show \"Best for X\" with confidence
5. Cost calculator shows accurate prices for sample token counts
6. Works offline after first load (cached JSON)
7. Feature parity verified (compare checklist against mobile)

### Key Decisions
- **Tech stack:** Single HTML file, Tailwind CSS via CDN, vanilla JavaScript
- **Offline:** localStorage for JSON cache, Cache API for offline support
- **Performance:** Lazy loading for model details, virtual scrolling if needed

### Next Phase Trigger
When WEB-01 through WEB-03 are complete (deployed, functional, parity verified), proceed to Phase 4.

---

## Phase 4: Polish & Launch Prep

**Goal:** Finalize production-ready features: model comparison, sharing, comprehensive error handling, performance optimization, and app store submission preparation.

**Mode:** mvp  
**Estimated Duration:** 5-7 days

### Requirements (Remaining items)

#### Mobile Enhancement (MOB-06)
- [ ] Share model details via OS share sheet

#### Web Enhancement (WEB-05)
- [ ] Finalize deployment configuration

#### Performance & Stability
- [ ] Optimize list scrolling performance (target: 60fps)
- [ ] Add loading states for all async operations
- [ ] Implement graceful error boundaries
- [ ] Reduce bundle size (lazy load non-critical components)

#### Quality Assurance
- [ ] Manual testing on iOS device (iPhone)
- [ ] Manual testing on Android device (multiple screen sizes)
- [ ] Cross-browser testing for web dashboard (Chrome, Firefox, Safari)
- [ ] Accessibility audit (screen readers, keyboard navigation)

#### App Store Preparation
- [ ] Generate app icons for iOS/Android
- [ ] Write App Store description and keywords
- [ ] Create screenshots for App Store
- [ ] Build production APK/AAB for Android
- [ ] Build for iOS App Store (requires Apple Developer account)

### Success Criteria
1. App scrolling maintains 60fps on low-end devices
2. No unhandled JavaScript errors in production
3. Share functionality works on both iOS and Android
4. App store listings ready (descriptions, icons, screenshots)
5. Web dashboard performs Core Web Vitals thresholds (LCP < 2.5s, FID < 100ms)
6. All critical bugs resolved (none with "critical\" or \"high\" severity)

### Key Decisions
- **Launch strategy:** iOS App Store + Google Play Store simultaneous (if possible)
- **Web hosting:** Vercel for simplicity, custom domain optional
- **Monitoring:** Sentry for error tracking, no analytics to respect privacy

### Completion Definition
When all requirements mapped to Phase 4 are complete and success criteria met, project is ready for \"v1.0 Launch Milestone.\"

---

## Roadmap Statistics

| Metric | Count |
|--------|-------|
| Total Phases | 4 |
| Total v1 Requirements | 27 |
| Requirements in Phase 1 | 6 |
| Requirements in Phase 2 | 18 |
| Requirements in Phase 3 | 17 |
| Requirements in Phase 4 | ~8 |
| Total Estimated Duration | 26-34 days (3.5-5 weeks) |

## Phase Dependencies

`
Phase 1 (Data Pipeline)
    ↓
[DATA-05 complete]
    ↓
Phase 2 (Mobile App) ← can start once DATA-05 done
    ↓
[MOB-04 complete]
    ↓
Phase 3 (Web + Intelligence) ← can start when mobile basic UI works
    ↓
[WEB-03 complete]
    ↓
Phase 4 (Polish) ← final phase, all features done
`

**Parallel Work Tracks:**
- Mobile app development can begin as soon as data pipeline works
- Web dashboard can be worked in parallel with mobile (after data pipeline)
- Intelligence features (cost calc, recommendations) need stable data

---

## Milestones

### 🎯 v1.0 Launch Milestone
**Definition:** All Phase 1-4 requirements complete, apps submitted to stores

**Success Criteria:**\n- iOS App Store submission approved or \"Waiting for Review\"\n- Google Play Console submission approved or \"In Review\"\n- Web dashboard deployed and accessible\n- Sentry configured (no unhandled errors in last 7 days)\n- Performance meets targets (60fps scrolling, <2s load)\n
**Estimated Date:** 4-6 weeks from 2025-05-07

---

## Evolution Notes

**How roadmap changes:**\n- Add phases via /gsd-new-milestone for major features\n- Adjust phases via /gsd-transition when requirements shift\n- Phase requirements may move if priorities change (vertical MVP structure)\n
**Validation checkpoints:**\n- After Phase 1: Verify JSON structure with sample consumers\n- After Phase 2: User testing on physical devices\n- After Phase 3: Dashboard performance audit\n- Before launch: Full regression testing across iOS/Android/Web

---

*Last updated: 2025-05-07 during roadmap creation*
*Updated by: gsd-new-project workflow*
