# Research Summary: AI Model Radar

**Synthesized:** 2025-05-07

## Key Findings

### Technology Stack
- Mobile: React Native (Expo) + TypeScript
- Web: Single-file HTML with Tailwind CSS
- Backend: No server required (GitHub Actions + static JSON)

### Architecture
- Centralized scraper runs every 15 minutes via GitHub Actions
- Data published to GitHub repository as JSON
- Mobile and web fetch JSON from GitHub raw URLs
- Offline-first design with local storage

### Critical Requirements
- Table stakes: Search, filter, pricing display, free tier indicators
- Differentiators: Task recommendations, cost calculator, new model alerts
- Anti-features (do not build): Performance benchmarks, usage monitoring, user accounts

### Pitfalls to Avoid
- Pricing decimal errors (unit tests needed)
- Background fetch failures (add error logging)
- Data staleness (show freshness indicators)
- Rate limiting (conservative polling: 10 req/min per provider)

### Competitive Advantage
- Only comprehensive, real-time cross-provider pricing tracker
- Unique free tier discovery and task-based model recommendations
- Zero hosting costs for MVP (GitHub + Vercel free tiers)

**Confidence: HIGH** - Architecture proven in similar projects
