# AI Model Radar - Product Requirements Document

## 1. Product Overview

**Product Name:** AI Model Radar
**Type:** Mobile Application (React Native/Expo) + Web Dashboard

### What This App Does

AI Model Radar is a pricing intelligence hub that helps developers quickly find the best free or low-cost AI models for their specific tasks. It aggregates pricing data from major AI providers (OpenAI, Anthropic, Google, Mistral, Replicate, Together.ai) and presents transparent cost-per-token comparisons in a user-friendly interface.

### Core Value Proposition

Developers make informed model choices with transparent cost-per-token comparison and discover the best free tier options available — without researching each provider individually.

---

## 2. Target Users

- **Primary:** Developers building AI-powered applications
- **Secondary:** Startups and indie developers on budget
- **Tertiary:** Anyone comparing AI model pricing

---

## 3. Key Features

### 3.1 Model Discovery & Browsing
- Display list of all AI models with metadata (name, provider, capabilities)
- Show free tier availability with limits
- Display cost-per-token pricing (input and output)
- Show rate limits per model
- Display data freshness indicator
- Sort models by launch date

### 3.2 Search & Filtering
- Search models by name or provider
- Filter by provider (multi-select)
- Filter by capability (text, code, vision, multimodal, etc.)
- "New Models" section highlighting recent additions
- "Free Models" spotlight section

### 3.3 Mobile Navigation
- Tab-based navigation: Discover, Browse, Compare, Profile
- Model cards with provider logo, name, pricing, tags
- Pull-to-refresh gesture
- Error state handling with retry button
- Share model details via OS share sheet

### 3.4 Web Dashboard
- Single HTML file with embedded assets
- Responsive grid layout (1/2/3 columns based on screen size)
- Real-time search with filtering
- Feature parity with mobile app
- Deployed to Vercel

### 3.5 Performance & Stability
- 60fps scrolling on mobile
- Loading states for all async operations
- Graceful error boundaries
- Offline support with cached data

### 3.6 App Store Preparation
- App icons and splash screens configured
- App Store metadata (description, keywords)
- EAS Build configuration for iOS/Android
- Privacy policy for compliance

---

## 4. Technical Architecture

### Mobile App (React Native/Expo)
- **Navigation:** @react-navigation with bottom tabs
- **State Management:** Zustand + TanStack Query
- **Storage:** react-native-mmkv for fast, encrypted local storage
- **Lists:** @shopify/flash-list for performance

### Web Dashboard
- Single-file HTML + Tailwind CSS (CDN)
- Vanilla JavaScript
- localStorage for caching

### Data Pipeline
- GitHub Actions scraper (15-minute cron)
- Hybrid: APIs when available, scraping as fallback
- JSON files published to repository (models.json, tasks.json)

---

## 5. UI/UX Requirements

### Visual Design
- Modern, clean interface with primary color #0A84FF
- Dark mode support (automatic)
- Card-based model display
- Consistent spacing and typography

### Accessibility
- Screen reader support
- Keyboard navigation
- Color contrast compliance
- Touch-friendly tap targets (44pt minimum)

### Responsive Behavior
- Mobile: Single column, full-width cards
- Tablet: 2-column grid
- Desktop: 3-column grid (web only)

---

## 6. TestSprite UI Audit Scope

### What to Test

#### 6.1 Core Functionality
- [ ] Model list displays correctly on app launch
- [ ] Search returns relevant results within 200ms
- [ ] Filters apply immediately without reload
- [ ] Pull-to-refresh updates data successfully
- [ ] Tab navigation works between Discover, Browse, Compare, Profile

#### 6.2 Data Display
- [ ] Model cards show provider logo, name, pricing
- [ ] Free tier indicators display correctly
- [ ] Cost-per-token calculations are accurate
- [ ] Data freshness indicator shows last update time

#### 6.3 User Interactions
- [ ] Share button opens OS share sheet
- [ ] Error states show retry button
- [ ] Loading indicators appear during data fetch
- [ ] Offline mode displays cached data

#### 6.4 Navigation & Flow
- [ ] Bottom tab navigation is functional
- [ ] Deep links work correctly
- [ ] Back navigation preserves state

#### 6.5 Performance
- [ ] List scrolling maintains 60fps
- [ ] App launches within 2 seconds
- [ ] No memory leaks during extended use

#### 6.6 Web Dashboard Specific
- [ ] Page loads without errors
- [ ] Responsive layout works across breakpoints
- [ ] Search and filter function correctly
- [ ] Dark mode toggle works

### Test Environment
- **Platform:** Web Dashboard (Single HTML file deployed to Vercel)
- **URL:** https://web-dashboard-omega-cyan.vercel.app/
- **Framework:** TestSprite for automated UI testing

### Test Scenarios

1. **Browse Models**
   - Open https://web-dashboard-omega-cyan.vercel.app/ → Verify model catalog loads → Verify model cards display

2. **Search Functionality**
   - Type in search field → Verify filtered results appear → Clear search → Verify full list returns

3. **Filter by Provider**
   - Click provider filter buttons → Verify only selected provider models show → Click again to deselect

4. **Favorites**
   - Click heart icon on a model card → Verify heart turns red → Click favorites button in header → Verify drawer opens with saved model → Click X to remove → Verify model removed

5. **Compare Models**
   - Check "Compare" checkbox on 2+ model cards → Verify "Compare" button appears at bottom → Click Compare → Verify modal opens with side-by-side comparison table → Close modal

6. **Discover Tab**
   - Click "Discover" tab → Verify New This Month, Free to Try, Top Recommended sections display

7. **Refresh Data**
   - Click refresh button → Verify data reloads → Verify "Last updated" timestamp changes

---

## 7. Success Criteria

- [ ] All core features functional in TestSprite tests
- [ ] No blocking UI bugs detected
- [ ] Performance meets targets (60fps, <2s launch)
- [ ] Accessibility audit passes
- [ ] Web dashboard feature parity verified

---

## 8. Known Issues (For Testing Reference)

1. **Data Loading:** Production web dashboard may show "Failed to load models" if models.json in GitHub is empty (Phase 1 scraper needs to run successfully)
2. **Version Compatibility:** Some npm packages may need version alignment with Expo SDK 54
3. **Offline Display:** Shows "You're offline" message when no network - this is expected behavior

---

*Document created for TestSprite UI Audit*
*Last updated: 2026-05-08*