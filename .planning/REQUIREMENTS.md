# Requirements: AI Model Radar

**Defined:** 2025-05-07  
**Core Value:** Developers quickly find the best free or low-cost AI model for their specific task without researching each provider individually.

## v1 Requirements

### Model Tracking (MODEL)

- [ ] **MODEL-01**: Display list of all AI models from tracked providers  
  **Acceptance:** Shows models from OpenAI, Anthropic, Google, Mistral, Replicate, Together.ai

- [ ] **MODEL-02**: Show model metadata: provider name, launch date, context window, capabilities  
  **Acceptance:** Each model card displays: provider logo, model name, launch date, context window (e.g., "128K tokens"), capability tags (text, vision, audio)

- [ ] **MODEL-03**: Indicate free tier availability with limits  
  **Acceptance:** Free models show "FREE" badge with monthly limit (e.g., "10K requests/mo") in orange accent

- [ ] **MODEL-04**: Display cost-per-token pricing for all paid models  
  **Acceptance:** Shows both input ($0.001/1K) and output ($0.002/1K) pricing, calculated per model

- [ ] **MODEL-05**: Show free tier rate limits  
  **Acceptance:** Displays requests per minute and per day limits when applicable

- [ ] **MODEL-06**: Show \"last updated\" freshness indicator  
  **Acceptance:** \"Updated 5 minutes ago\" with green (fresh), orange (stale >24h), red (stale >48h) color coding

- [ ] **MODEL-07**: Sort models by launch date (newest first)  
  **Acceptance:** Default sort shows newest models at top of list

### Discovery & Search (DISC)

- [ ] **DISC-01**: Search models by name or provider  
  **Acceptance:** Search box returns matches within 200ms, autofocus on mount

- [ ] **DISC-02**: Filter by provider (multi-select)  
  **Acceptance:** Checkbox list shows active providers, filters apply immediately

- [ ] **DISC-03**: Filter by capability (text, vision, audio, embeddings, code, multimodal)  
  **Acceptance:** Toggle buttons for each capability, multi-select supported

- [ ] **DISC-04**: \"New Models\" section highlighting models launched within 30 days  
  **Acceptance:** Dedicated tab/section with \"NEW\" badge showing launch date

- [ ] **DISC-05**: \"Free Models\" spotlight section  
  **Acceptance:** Separate section showing only models with active free tiers

### Pricing Intelligence (PRIC)

- [ ] **PRIC-01**: Calculate cost-per-token for text generation models  
  **Acceptance:** Formula validated: (input_tokens × input_cost) + (output_tokens × output_cost)

- [ ] **PRIC-02**: Display input vs output cost breakdown  
  **Acceptance:** Side-by-side comparison showing why output costs more

- [ ] **PRIC-03**: Batch pricing display (where applicable)  
  **Acceptance:** Shows \"Batch: -25%\" discount indicator for providers with batch endpoints

### Task Recommendations (TASK)

- [ ] **TASK-01**: Categorize models by primary capability  
  **Acceptance:** Categories: Text Generation, Vision, Audio, Embeddings, Code Generation, Multimodal

- [ ] **TASK-02**: Recommend best free model for each task type  
  **Acceptance:** \"Best for Text Generation: GPT-3.5 Turbo (FREE)\" - one recommendation per task

- [ ] **TASK-03**: Display \"confidence\" level for recommendations  
  **Acceptance:** \"Recommended for most use cases\" with green check, \"Specialized\" with info icon

### Offline Support (OFFL)

- [ ] **OFFL-01**: Cache model data locally on device  
  **Acceptance:** App loads with cached data when offline, shows \"Offline mode\" indicator

- [ ] **OFFL-02**: Store fallback JSON on device  
  **Acceptance:** Last successful fetch stored persistently, survives app restarts

### Mobile App (MOB)

- [ ] **MOB-01**: Implement tab-based navigation  
  **Acceptance:** Tabs: Discover, Browse, Compare, Profile (settings)

- [ ] **MOB-02**: Display model list with cards  
  **Acceptance:** Card shows provider logo, model name, short description, price badge, capability tags

- [ ] **MOB-03**: Pull-to-refresh gesture  
  **Acceptance:** Pull down triggers refresh animation, updates data if changed

- [ ] **MOB-04**: Error state handling for failed API/JSON fetch  
  **Acceptance:** Shows \"Failed to load\\\" with retry button, logs error to Sentry

- [ ] **MOB-05**: Background fetch every 15 minutes  
  **Acceptance:** GitHub Actions cron runs, mobile pulls when app active

- [ ] **MOB-06**: Share model details via OS share sheet  
  **Acceptance:** Share button on model detail page shares name, provider, pricing link

### Web Dashboard (WEB)

- [ ] **WEB-01**: Single HTML file with embedded CSS/JS  
  **Acceptance:** file loads without external dependencies (except CDN: Tailwind, Chart.js)

- [ ] **WEB-02**: Responsive grid layout for model cards  
  **Acceptance:** 1-column mobile, 2-column tablet, 3-column desktop

- [ ] **WEB-03**: Search bar with real-time filtering  
  **Acceptance:** Filters as you type, no page reloads

- [ ] **WEB-04**: Feature parity with mobile app  
  **Acceptance:** Can perform all mobile actions (search, filter, view pricing, see recommendations)

- [ ] **WEB-05**: Deploy to Vercel on push  
  **Acceptance:** Vercel git integration auto-deploys on main branch push

### Data Pipeline (DATA)

- [ ] **DATA-01**: Scraper runs every 15 minutes via GitHub Actions  
  **Acceptance:** .github/workflows/scrape-data.yml triggers cron, commits JSON to data/ folder

- [ ] **DATA-02**: Fetch from provider APIs (OpenAI, Anthropic)  
  **Acceptance:** API keys stored in GitHub Secrets, fetch with rate limiting

- [ ] **DATA-03**: Scrape providers without APIs (Mistral, Google)  
  **Acceptance:** Uses Playwright/Cheerio, respects robots.txt

- [ ] **DATA-O4**: Validate pricing data structure  
  **Acceptance:** JSON schema validation using Zod/Joi, prevents formatting errors

- [ ] **DATA-05**: Publish models.json to repository  
  **Acceptance:** File at .github.io/repo/data/models.json accessible via raw URL

- [ ] **DATA-06**: Publish tasks.json with recommendations  
  **Acceptance:** File generated matching models.json update cadence

## v2 Requirements (Future Release)

### Enhanced Intelligence (INT v2)

- **INT-V2-01**: Historical pricing trends (price over time charts)
- **INT-V2-02**: Regional pricing comparison (US vs EU endpoints where applicable)
- **INT-V2-03**: Advanced cost calculator with token estimation
- **INT-V2-04**: Provider uptime/downtime monitoring

### Alert System (ALERTS v2)

- **ALERT-V2-01**: Push notifications for new free models
- **ALERT-V2-02**: Price drop notifications when costs decrease
- **ALERT-V2-03**: New provider announcements
- **ALERT-V2-04**: Custom alert preferences (by provider, task, cost threshold)

### Social Features (SOCIAL v2)

- **SOCIAL-V2-01**: Share cost comparison results (image export)
- **SOCIAL-V2-02**: Bookmark favorite models for comparison
- **SOCIAL-V2-03**: Community trending models (most viewed)

### Advanced Comparisons (COMP v2)

- **COMP-V2-01**: Side-by-side model comparison (up to 3 models)
- **COMP-V2-02**: Break-even analysis (when paid model becomes cheaper than free tier limits)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Model performance benchmarks | Scope creep - focus on pricing, not quality/capability/latency |
| Real-time usage monitoring | Privacy concerns - tracking actual usage crosses privacy line |
| Direct API proxy or billing management | Legal liability - touching money creates tax implications |
| Custom fine-tuned model pricing | Too niche - 95% of users use base models |
| Provider status uptime dashboard | Low value - users check provider status pages if needed |
| Mobile push notifications from backend | Complexity - requires backend server for v2 |
| User reviews/ratings of models | Subjective - creates credibility liability |
| Prompt engineering playground | Feature creep - people use ChatGPT for this |

## v1 Requirements Count

**Total: 27 requirements**

- Model tracking: 7 (MODEL-01 to MODEL-07)
- Discovery & search: 5 (DISC-01 to DISC-05)
- Pricing intelligence: 3 (PRIC-01 to PRIC-03)
- Task recommendations: 3 (TASK-01 to TASK-03)
- Offline support: 2 (OFFL-01 to OFFL-02)
- Mobile app: 6 (MOB-01 to MOB-06)
- Web dashboard: 5 (WEB-01 to WEB-05)
- Data pipeline: 6 (DATA-01 to DATA-06)

---

*Last updated: 2025-05-07 after research synthesis*

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MODEL-01 | Phase 1 | Pending |
| MODEL-02 | Phase 1 | Pending |
| ... | ... | ... |
| WEB-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: TBD
- Unmapped: 27 ⚠️
