# Phase 1: Foundation & Data Pipeline - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish a data collection pipeline that continuously scrapes pricing data from AI providers (OpenAI, Anthropic, Google, Mistral, Replicate, Together.ai) and publishes structured JSON files (`models.json`, `tasks.json`). This enables all downstream consumer applications (mobile app, web dashboard) to access up-to-date model metadata and pricing.

</domain>

<decisions>
## Implementation Decisions

### Provider Scraping Strategy
- **D-01:** Use a unified interface with provider-specific implementations (e.g., `ProviderClient` base class abstracting API vs. scraping details). Clients expose a consistent `fetch_models()` method for maintainability and testability.

### JSON Schema Design
- **D-02:** Denormalized `models.json` with embedded provider data (e.g., provider name, logo). Simplifies client usage and reduces request overhead. File will include:
  - Model metadata (name, launch date, context window, capabilities)
  - Pricing data (input/output costs, free tier limits)
  - Provider information (name, logo)

### GitHub Actions Workflow
- **D-03:** Modular workflow (`scrape-data.yml`) with reusable matrix jobs (e.g., `provider: ['openai', 'mistral']`). Balances reusability and debuggability while keeping the workflow DRY.

### Error Handling
- **D-04:** Graceful degradation: Skip failed providers but publish partial JSON with success status. Prioritizes availability over completeness. Failed providers will:
  - Log errors to GitHub Actions console
  - Be excluded from the published JSON
  - Include a `"status": "failed"` flag if cached data is used

### Pricing Data Validation
- **D-05:** Schema validation using a library (Zod for JS/Python, Pydantic for Python). Ensures correctness and reduces maintenance burden.

### the agent's Discretion
- No discretionary decisions required; all implementation choices were explicitly discussed and decided.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Pipeline
- `.planning/ROADMAP.md` — Phase 1 scope, requirements (DATA-01 to DATA-06), and success criteria
- `.planning/REQUIREMENTS.md` — Detailed requirements for DATA-01 to DATA-06, including acceptance criteria for JSON publication and validation
- `.planning/PROJECT.md` — Constraints (polling frequency, rate limits, hosting) and key decisions (hybrid API/scraping, GitHub-hosted JSON)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- *None found*: No existing scraping logic, provider API clients, JSON validation utilities, or GitHub Actions workflows.

### Established Patterns
- *None found*: No observable patterns for environment variable management, error handling, or JSON file publication.

### Integration Points
- **GitHub Actions**: New workflow (`scrape-data.yml`) will be created in `.github/workflows/
- **Data Publications**: `models.json` and `tasks.json` will be written to the repository (exact paths TBD, e.g., `/data/`) and accessible via raw GitHub URLs
- **Clients**: Mobile app and web dashboard will consume JSON via HTTP requests (future phases)

</code_context>

<specifics>
## Specific Ideas

- **Denormalized JSON**: Client convenience prioritized over normalization (single request for all model data)
- **Matrix-based Workflow**: Debugging parity maintained via provider-specific job IDs in GitHub Actions
- **Schema Validation**: Zod/Pydantic selected to balance correctness and maintainability

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Foundation & Data Pipeline*
*Context gathered: 2026-05-07*