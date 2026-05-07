# AI Model Radar

## What This Is

A live tracker and pricing intelligence hub that helps developers quickly find the best free or low-cost AI models for their specific task without researching each provider individually. Delivers transparent cost-per-token comparison across all major API providers with real-time alerts for new models with free or low-cost access.

**Primary target:** React Native (Expo) mobile app for iOS + Android  
**Companion:** Single-file web dashboard (ai-model-radar.html) hosted on Vercel

## Core Value

If everything else fails, this must work: Developers make informed model choices with transparent cost-per-token comparison and discover the best free tier options available.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Aggregate models from all major API providers (OpenAI, Anthropic, Google, Mistral, Replicate, etc.)
- [ ] Calculate cost-per-token pricing for all models
- [ ] Identify and display free tier availability and limits
- [ ] Categorize models by capability (text generation, embeddings, image, audio, code, multimodal)
- [ ] Recommend best free/low-cost model per task type
- [ ] Real-time alerts for new models with free/low-cost access
- [ ] React Native (Expo) mobile app with offline support
- [ ] Full-feature parity single-file web dashboard on Vercel
- [ ] Search and filter by provider, cost, capability

### Out of Scope

- User authentication for browsing (required only for personalized alerts)
- Commercial API usage tracking per user (privacy concern)
- Direct API proxy or billing management
- Custom fine-tuned model pricing (tracking for specific use)
- Real-time inference metrics (must include latency if data available)
- Provider-specific features beyond pricing comparison
- Model performance benchmarks (beyond price optimization)
- Non-official model routes or pirate APIs

## Context

**Technical Approach:**
- Hybrid data collection: Official APIs (when available) + scraping (fallback)
- Background polling every 15 minutes with manual refresh option
- GitHub-hosted JSON endpoints for web dashboard consumption
- No backend server for v1 (local storage on mobile, static JSON for web)
- Offline-first mobile experience with cached data

**MVP Provider Coverage:**
Start with OpenAI, Anthropic (Claude), Google (Gemini), Mistral, Replicate, Together.ai — expand to all providers after v1 launch

**Mobile-First Design:**
- Native push notifications when new free/low-cost models launch
- Offline mode with locally cached pricing data
- Share recommended models via deep link
- Bookmark models for quick comparison

**Web Dashboard Strategy:**
- Single embedded HTML/CSS/JS file (ai-model-radar.html)
- Deployed to Vercel for localhost-free access
- Feature parity with mobile app
- Responsive desktop-optimized layout
- Loads JSON from GitHub repo for model/pricing data

## Constraints

- **Data Freshness**: 15-30 minute polling delay acceptable (not real-time)
- **Hosting**: No serverless functions or backend database for v1 (static JSON only)
- **API Rate Limits**: Must respect provider rate limits when polling
- **Storage**: Local mobile storage is primary, no user accounts or cloud sync for v1
- **Offline Support**: Must work fully offline after initial data fetch
- **Vercel Hosting**: 10MB size limit for web dashboard, no server-side code

## Key Decisions

| Decision | Rationale | Status |
|----------|-----------|---------|
| **Use React Native (Expo) over separate native apps** | Code sharing between iOS/Android, faster development, OTA updates | — Pending |
| **Single-file web dashboard vs Next.js** | Simpler deployment, no hydration issues, matches mobile simplicity | — Pending |
| **Hybrid API + scraping data collection** | API data is reliable but not all providers have it; scraping provides comprehensive coverage | — Pending |
| **No backend server for v1** | Faster MVP, lower cost, GitHub JSON serves web dashboard adequately | — Pending |
| **Push + Email alerts (implement push only after v1)** | Push requires backend for tokens. Email alerts easier for MVP. | — Pending |
| **GitHub-hosted JSON for data persistence** | Free, version-controlled, accessible to web dashboard, but manual update process | — Pending |
| **15-minute polling schedule** | Balances freshness with API costs and respect for rate limits | — Pending |

---
*Last updated: 2025-05-07 after project initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
