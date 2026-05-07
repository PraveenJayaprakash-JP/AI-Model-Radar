# AGENTS.md

**AI Model Radar** - AI Model Pricing Intelligence Hub

Project initialized: 2025-05-07  
Granularity: Coarse (4 phases)  
Mode: YOLO  

## Project Context

### What This Is
A live tracker and pricing intelligence hub that helps developers quickly find the best free or low-cost AI model for their specific task without researching each provider individually.

**Target platforms:**
- Primary: React Native (Expo) mobile app (iOS + Android)
- Companion: Single-file web dashboard (ai-model-radar.html) on Vercel

### Core Value
If everything else fails, this must work: Developers make informed model choices with transparent cost-per-token comparison.

### Key Requirements
- v1: 27 requirements across model tracking, search, pricing, recommendations
- MVP Launch: ~4-6 weeks estimated
- Current phase: Phase 1 (Foundation & Data Pipeline)

**Project Directory:** D:\Opencode\New folder

## Workflow & Patterns

### GSD Workflow
- **Mode:** YOLO (Auto-approve, automatic progression after phases)
- **Granularity:** Coarse (4 phases, 6-7 days per phase estimated)
- **Parallel execution:** Enabled for independent work tracks
- **Git tracking:** Enabled (planning docs committed to repo)

### Navigation Commands
- /gsd-discuss-phase N - Gather context before planning phase N
- /gsd-plan-phase N - Create executable plan for phase N
- /gsd-execute-phase N - Execute phase N with actions
- /gsd-ui-phase N - Generate UI design contract for frontend phases
- /gsd-transition N - Move to next phase when current phase completes
- /gsd-complete-milestone - Mark v1.0 launch milestone complete

### Current State
**Phase 1: Foundation & Data Pipeline** 🟡 Active
- Requirements: 6 (DATA-01 to DATA-06)
- Goal: GitHub Actions scraper publishing JSON every 15 minutes
- Status: Scraping logic being implemented

**Next Up:** Phase 2 (Core Mobile App) - once data pipeline is live

## Architecture Highlights

### Tech Stack
- **Mobile:** React Native (Expo) + TypeScript
  - Navigation: Expo Router (file-based)
  - State: Zustand + TanStack Query
  - Storage: react-native-mmkv (fast, encrypted)
  - Lists: @shopify/flash-list
- **Web:** Single-file HTML + Tailwind CSS
- **Backend:** No server required (GitHub Actions + static JSON)

### Data Flow
`
GitHub Actions (15 min cron)
  ↓
data/models.json (static JSON)
  ↓
Mobile App + Web Dashboard
  ↓
Users (offline-first)
`

### Provider Coverage
Current: OpenAI, Anthropic, Google, Mistral, Replicate, Together.ai  
Expansion: Add more in v2 based on demand

## Critical Requirements Reference

### Phase 1 (Foundation - ACTIVE)
- DATA-01 to DATA-06: Scraper, validation, JSON publishing
- MODEL-01 to MODEL-07: Model metadata display
- **Success:** models.json accessible via raw GitHub URL

### Phase 2 (Core Mobile)
- DISC-01 to DISC-05: Search & filter
- PRIC-01 to PRIC-03: Cost display
- MOB-01 to MOB-06: Navigation, cards, refresh, errors
- **Success:** Working iOS/Android build with browse/search

### Phase 3 (Web + Intelligence)
- TASK-01 to TASK-03: Recommendations
- OFFL-01/02: Offline support
- WEB-01 to WEB-05: Single-file dashboard, Vercel deploy
- **Success:** Dashboard live with feature parity

### Phase 4 (Polish)
- Comparisons, sharing, performance, QA
- App store submission prep
- **Success:** Production-ready, stores submitted

## Key Decisions

1. **No Backend Server** - GitHub Actions + static JSON keeps costs at  for MVP
2. **15-Minute Polling** - Balance data freshness vs rate limits
3. **Coarse Granularity** - Broad phases with milestones within each
4. **YKLO Mode** - Auto-approve for speed, review mechanisms available via /gsd-* commands
5. **Task Recommendations** - Killer feature: \"Best free model for [task]\"

## Research & Documentation Links

- [.planning/PROJECT.md](.planning/PROJECT.md) - Project context and evolution
- [.planning/REQUIREMENTS.md](.planning/REQUIREMENTS.md) - Full requirements with acceptance criteria
- [.planning/ROADMAP.md](.planning/ROADMAP.md) - Phase breakdown and success criteria
- [.planning/STATE.md](.planning/STATE.md) - Current phase and progress tracking
- [.planning/research/](.planning/research/) - Research analysis:
  - STACK.md - Tech stack recommendations
  - FEATURES.md - Table stakes vs differentiators
  - ARCHITECTURE.md - Data flow and structure
  - PITFALLS.md - Mistakes to avoid
  - SYNOPSIS.md - Research synthesis

## Critical Pitfalls to Avoid

From research - must address during execution:

1. **Pricing decimal errors** - Add unit tests + validation, catastrophic impact
2. **Stale data >48h** - Show freshness indicators, prevent trust erosion
3. **Background fetch failures** - Log to Sentry + manual refresh fallback
4. **Rate limit exceeded** - Conservative polling (10 req/min per provider)
5. **Provider HTML changes** - Multiple fallback selectors, visual regression tests
6. **CORS issues** - Proper Vercel/headers configuration

## Development Environment

**Prerequisites installed:**
- Node.js 18+
- Git
- Expo CLI (npm install -g expo-cli)
- Android Studio (optional, for Android sim)
- Xcode (optional, for iOS sim)

**Initial setup after cloning:**
`ash
# Mobile app
cd mobile-app/
npm install
npx expo start

# Web dashboard
cd web-dashboard/
open index.html  # or serve using Python/Node

# Scraper
cd scraper/
npm install
npm run scrape  # Test locally
`

## Deployment Checklist

**Staging:**
- [ ] Scraper pushes to staging branch first
- [ ] Mobile builds via Expo EAS preview
- [ ] Web dashboard deployed to Vercel preview URL
- [ ] Manual testing across devices

**Production:**
- [ ] All tests pass (unit + manual)
- [ ] No unhandled errors in Sentry (7-day window)
- [ ] Performance meets thresholds
- [ ] App store assets ready
- [ ] Privacy policy drafted (for app stores)

## Success Metrics

**v1 Launch Success:**
- Users can browse 50+ models from 6 providers
- Pricing data refreshes every 15 minutes
- Mobile: 60fps scrolling, <2s launch
- Web: <1.5s load time, works offline after first visit
- Zero critical bugs in first week post-launch

**Long-term (v2+):**
- 100+ active daily users (organic growth)
- Expand to 10+ providers based on user demand
- Introduce push notifications for new free models
- Optional user accounts for saved comparisons

## Phase Transition Readiness

**Current phase:** Phase 1 (Foundation)  
**Next phase trigger:** DATA-05 complete (models.json published and accessible)  
**Before starting Phase 2, verify:**
- [ ] models.json is accessible via raw GitHub URL
- [ ] JSON structure validates without errors
- [ ] 6 providers' data present in JSON
- [ ] GitHub Actions cron logging successful runs
- [ ] Mobile app can fetch JSON successfully (test with fetch())

---

*Generated on: 2025-05-07*  
*Template: GSD Project Guide*  
*Next step: /gsd-discuss-phase 1 to begin Phase 1 execution*
