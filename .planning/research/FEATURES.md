# Features Research: AI Model Radar

**Research completed:** 2025-05-07  
**Domain:** AI model pricing intelligence and comparison tools

## Table Stakes (Users expect these, must include in v1)

### Model Discovery
- **Comprehensive provider coverage** (At minimum: OpenAI, Anthropic, Google, Mistral, Replicate)
- **Search by model name** with autocomplete
- **Filter by provider** (checkbox multi-select)
- **Filter by capability** (text, vision, audio, embeddings, code)
- **Sort by launch date** (newest first)
- **Model detail page** with specs (context window, parameters, knowledge cutoff)

**Without this:** Users immediately churn (too limited, can't find models)

### Pricing Transparency
- **Cost-per-token display** for all text generation models
- **Free tier indicator** (yes/no + limits)
- **Pay-as-you-go pricing** for non-free tiers
- **Batch pricing** if provider offers discounts
- **Currency display** (default USD, no conversion needed)

**Without this:** Core value not delivered (can't compare costs)

### Provider Status
- **Current pricing accuracy** (timestamp: "Updated 5 minutes ago")
- **Provider status** (operational, degraded, outage) - via provider status pages
- **Rate limit information** (requests/minute, tokens/minute)

**Without this:** Low trust in data (\"is this current?\")

## Differentiators (Competitive advantage, drive word-of-mouth)

### Task-Specific Recommendations
- **\"Best free model for [task]\"** per capability (text, vision, code, etc.)
- **Confidence indicators** (\"Recommended for most use cases\")
- **Use case examples** (\"Great for long-context document analysis\")
- **Performance context** (\"Fast but less capable\")

**Why this matters:** No one else does this well; users love prescriptive guidance

### Cost Optimization Intelligence
- **\"Cheapest model for 1M tokens\"** calculated across providers
- **Comparison calculator:** Input token count, see cheapest option
- **Hidden cost warnings:** \" Appears cheap but has usage minimums\"
- **Regional pricing differences:** Where applicable (different endpoints)

**Why this matters:** High-value for developers managing budgets

### Alert & Discovery Features
- **New model alerts** (push notifications)
- **Price drop notifications** (when free tier emerges or costs decrease)
- **Provider launch tracking** (sync with announcement events)
- **Trending models** (based on community usage/analytics)

**Why this matters:** Keeps users coming back; time-sensitive value

### Developer Experience
- **Command generator:** Outputs exact API call with chosen model
- **Cost calculator:** Tokens → USD (live preview)
- **Shareable links:** \"Compare GPT-4 vs Claude at x tokens\"
- **Export pricing data:** CSV/JSON for internal analysis

**Why this matters:** Reduces friction from discovery → implementation

## Anti-Features (Intentionally NOT building)

1. **Model performance benchmarks** - Beyond scope (focus on pricing, not quality)
2. **Real-time usage monitoring** - Privacy concern, no user accounts needed for v1
3. **Custom model fine-tuning calculator** - Too niche for MVP
4. **Billing management** - Don't touch money (just inform)
5. **Provider reviews/ratings** - Subjective, creates liability
6. **Prompt engineering tools** - Feature creep (stick to pricing)

**Rationale:** Each adds complexity without reinforcing core value (pricing transparency)

## Competitive Landscape

**Direct Competitors:**
- **AIModels.fyi** - Focused on OpenAI models only (narrow)
- **LLM Pricing Table** (GitHub spreadsheets) - Static, manual updates
- **Official provider calculators** - Siloed, no comparison
- **PromptLayer** - Monitoring + pricing, but not provider-agnostic

**Gap:** No one provides comprehensive, real-time comparison across ALL providers with intelligent cost optimization recommendations. Most are OpenAI-centric or static spreadsheets.

## Business Model Patterns

**Free Model Examples:**
- **GitHub sponsorship:** LLM-Playground/openai-usage
- **Open data + community:** spreadsheets that aggregate pricing
- **Paid walls:** Some tools show limited providers free, rest paid
- **Ad-supported:** Pricebot.ai uses affiliate links

**Pricing Insight:**
- Users expect this to be free (it's data transparency for developer tools)
- Premium could be: API access, white-label, enterprise alerts
- Revenue path: Donations, GitHub sponsors, or "Pro\" version for teams

## User Experience Patterns

**Mobile Navigation Patterns (Expo Router):**
```
Tabs:
  ├─ Discover (new/free models) ← Default tab
  ├─ Browse (by task/provider)
  ├─ Compare (side-by-side calculator)
  └─ Alerts (notifications/settings)
```

**Desktop Web Dashboard:**
- **Single-screen layout:** Filters left panel, model cards/grid main area
- **Comparison mode:** Table view with multiple models side-by-side
- **Spotlight section:** Free models featured prominently
- **Search-first:** Big search bar at top (filters are secondary)

## Complexity Assessment

**Low Complexity / High Value (Do First):**
- Static pricing display
- Sorting/filtering
- Provider coverage

**Medium Complexity / High Value (Do Second):**
- Background polling + refresh
- Task-based recommendations
- Cost calculator comparison

**High Complexity / High Value (Do Last):**
- Push notifications
- Real-time concurrent updates across devices
- Advanced cost optimization (MTU-based pricing, batch discounts)

**Low Value (Don't Do or Deprioritize):**
- Model ratings/reviews
- Performance benchmarks
- Social features

## Version Planning

**v1 Launch:** All table stakes + 2-3 differentiators (task recommendations, cost calculator)
**v2 Expansion:** Full notification system, trending models, more advanced recommendations
**v3 + Enterprise:** API access, team features, white-label for companies

---

**Confidence Levels:**
- **Table stakes:** HIGH confidence (core value required)
- **Task recommendations:** HIGH confidence (validated market need)
- **Cost calculator:** MEDIUM confidence (demand from developers)
- **Alert engine:** MEDIUM confidence (depends on push notification complexity)
- **Trending/trackers:** LOW confidence (requires usage tracking which we don't have yet)

---
*Last updated: 2025-05-07*
