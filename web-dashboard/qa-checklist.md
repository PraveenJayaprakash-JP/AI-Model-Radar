# Web Dashboard QA Checklist

**Date:** May 8, 2026
**URL:** https://web-dashboard-omega-cyan.vercel.app

## Cross-Browser Testing

### Chrome (Desktop)
- [ ] Page loads successfully (HTTP 200)
- [ ] Search bar filters models in real-time (~200ms response)
- [ ] Provider filter toggles work (multi-select)
- [ ] Responsive layout adapts: 3-column desktop, 2-column tablet, 1-column mobile
- [ ] Dark mode respects system preference
- [ ] Model cards render correctly (provider logo, name, pricing)
- [ ] Free tier badges display in orange accent
- [ ] "Cheapest for X tokens" calculator works (if implemented)
- [ ] Offline mode: disconnect network, verify cached data loads
- [ ] Console: no JavaScript errors (DevTools Console)
- [ ] Performance: LCP < 2.5s, FID < 100ms (Lighthouse)

### Firefox (Desktop)
- [ ] Page loads successfully
- [ ] Search and filters work identically to Chrome
- [ ] Responsive layout adapts correctly
- [ ] Dark mode respects system preference
- [ ] No console errors (Firefox DevTools Console)
- [ ] Performance similar to Chrome (within 10%)

### Safari (Desktop - Mac only)
- [ ] Page loads successfully
- [ ] Search and filters work
- [ ] Responsive layout adapts correctly
- [ ] Dark mode respects system preference
- [ ] No console errors (Safari Web Inspector)

### Safari (iOS - iPhone)
- [ ] Page loads on mobile Safari
- [ ] 1-column responsive layout (not 3-column)
- [ ] Touch targets ≥ 44x44px (iOS spec)
- [ ] Search bar focuses on load (autofocus)
- [ ] Filter chips are tappable with finger
- [ ] Pull-to-refresh not needed (static page, but verify scroll works)
- [ ] Keyboard dismissal works after search
- [ ] Offline mode works (disconnect WiFi/Cellular, verify cache loads)

### Chrome (Android - Mobile)
- [ ] Page loads on mobile Chrome
- [ ] 1-column responsive layout
- [ ] Touch targets ≥ 48x48px (Android spec)
- [ ] Search bar works with virtual keyboard
- [ ] Filter chips tappable
- [ ] Back button navigation returns to previous page (if using router)

## Feature Verification

### Search Functionality
- [ ] Search box filters by model name (e.g., "GPT" returns GPT models)
- [ ] Search filters by provider (e.g., "OpenAI" returns OpenAI models)
- [ ] Search case-insensitive (returns results for "gpt" or "GPT")
- [ ] Search debounced (~200ms delay, no flickering)
- [ ] Empty search shows all models
- [ ] No search results found shows message

### Provider Filters
- [ ] Provider filter chips toggle on/off
- [ ] Multi-select: can select OpenAI AND Anthropic
- [ ] "Clear filters" button resets all filters
- [ ] Filter results update immediately (no page reload)

### Model Cards
- [ ] Provider logos render correctly (OpenAI, Anthropic, Google, etc.)
- [ ] Model names display correctly
- [ ] Pricing shows input/output cost per 1K tokens
- [ ] Free tier badges show "FREE" with limit (e.g., "10K req/mo")
- [ ] Free tier badges are orange accent color
- [ ] Capability tags display (text, vision, audio, etc.)
- [ ] Newest models highlighted (if implemented)

### Responsive Design
- [ ] Desktop (> 1024px): 3-column grid
- [ ] Tablet (768px - 1024px): 2-column grid
- [ ] Mobile (< 768px): 1-column grid
- [ ] No horizontal scroll on mobile
- [ ] Images scale properly (no pixelation or overflow)
- [ ] Text readability maintained at all sizes

### Dark Mode
- [ ] Respects system dark mode preference (CSS `@media (prefers-color-scheme: dark)`)
- [ ] Manual dark mode toggle (if implemented)
- [ ] High contrast in both light and dark modes
- [ ] Color contrast ratio ≥ 4.5:1 for text (Lighthouse accessibility audit)

### Offline Mode
- [ ] First visit populates localStorage with model data
- [ ] Subsequent visits load from localStorage (if no network)
- [ ] "Offline mode" indicator shows when offline
- [ ] Data refreshes when network reconnects

## Accessibility Audit

### Keyboard Navigation
- [ ] Tab key focuses search box on load (autofocus)
- [ ] Tab navigates through interactable elements (search, filter chips)
- [ ] Enter key searches in search box
- [ ] Space/Enter toggles filter chips
- [ ] All interactive elements have visible focus indicator

### Screen Reader Support
- [ ] (Mac) VoiceOver announces model names, pricing, provider
- [ ] (Windows) NVDA or JAWS reads Alt text for provider logos
- [ ] Semantic HTML used (proper headings, lists, buttons)
- [ ] ARIA labels on icons (e.g., "Search models", "Filter by OpenAI")

### Color Contrast
- [ ] Lighthouse accessibility audit passes (score ≥ 90)
- [ ] Text compared to background has contrast ≥ 4.5:1
- [ ] Reserve colors for links and interactive elements
- [ ] Error messages have high contrast (red on white/red on dark)

### Screen Size Zoom
- [ ] Content readable at 200% zoom (WCAG 2.1 AA)
- [ ] No horizontal scroll at 150% zoom
- [ ] Text reflows at 200% zoom (maintains readability)

## Performance Verification

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Lighthouse Performance score ≥ 90

### Load Time
- [ ] Initial load < 1.5s on desktop (Chrome DevTools Network: Clear cache, hard reload)
- [ ] Initial load < 2.5s on mobile (3G throttling)
- [ ] Image loading: provider logos load without blocking render
- [ ] JavaScript bundle size < 100KB (Check Sources panel in DevTools)

---

**Testing Status:**
- Chrome (Desktop): [ ] PASS / [ ] FAIL
- Firefox (Desktop): [ ] PASS / [ ] FAIL
- Safari (Desktop): [ ] PASS / [ ] FAIL
- Safari (iOS): [ ] PASS / [ ] FAIL
- Chrome (Android): [ ] PASS / [ ] FAIL
- Accessibility (Lighthouse): Score: ___/100
- Performance (Lighthouse): Score: ___/100

**Overall Pass Rate:** ___/100 (e.g., 95/100 items checked)

**Blocking Issues:**
1.
2.
3.

**Non-Blocking Issues:**
1.
2.
3.

**Tester:** [Your Name]
**Date:** May 8, 2026