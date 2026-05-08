# Feature Verification Guide

## Live Dashboard URL: https://web-dashboard-omega-cyan.vercel.app

### How to Test Each Feature

#### 1. Search Functionality
**Test Steps:**
1. Open the dashboard in your browser
2. Locate the search box at the top of the page
3. Type "gpt" in the search field
4. Observe the results filter (should happen within ~200ms)

**Expected Result:**
- Only models with "gpt" in the name or provider should be displayed
- Other models should be hidden from the grid
- The model count should update to show filtered results

**Verification**: Search bar provides real-time filtering with visual feedback

---

#### 2. Provider Filters (Multi-Select)
**Test Steps:**
1. Scroll down to the "Providers:" section below recommendations
2. Click on a provider chip (e.g., "OpenAI")
3. Click another provider chip (e.g., "Anthropic")
4. Click the same provider chip again to deselect

**Expected Result:**
- Clicking a provider toggles its active state (purple when selected)
- Multiple providers can be selected simultaneously
- The models grid updates to show only models from selected providers
- Deselecting all providers shows all models

**Verification**: Multi-select provider filtering works correctly

---

#### 3. Offline Mode
**Test Steps:**
1. Load the dashboard with an active internet connection
2. Open browser DevTools (F12) → Network tab
3. Check that models.json loaded successfully
4. Use airplane mode or disconnect network
5. Refresh the page

**Expected Result:**
- A red banner appears at the top: "You're offline. Showing cached data."
- Models are still displayed (from browser localStorage cache)
- All features (search, filters) continue to work
- Reconnecting and refreshing fetches fresh data

**Verification**: Offline mode shows cached data with visual indicator

---

#### 4. Recommendations Section
**Test Steps:**
1. Look at the "Best Models for Your Task" section at the top
2. Check for cards labeled "Best for Text Generation", "Best for Code Generation", "Best for Vision/Images"

**Expected Result:**
- Three recommendation cards are displayed
- Each card shows a model name
- Green badge: "✓ Free available"
- Models are free-tier options from the dataset

**Note:** Currently shows mock data since production scraper is not live yet

**Verification**: Recommendations surface free models

---

#### 5. Responsive Design
**Test Steps:**
1. Open browser DevTools (F12) → Device Toolbar (Ctrl+Shift+M)
2. Test viewport widths:
   - **Mobile (375px):** Should show 1 column
   - **Tablet (768px):** Should show 2 columns
   - **Desktop (1024px+):** Should show 3 columns

**Expected Result:**
- Layout smoothly adjusts between 1, 2, or 3 columns
- Model cards maintain readability at all sizes
- Search bar remains accessible (hidden on mobile, visible on desktop)

**Verification**: Grid adapts to screen size (1/2/3 columns)

---

#### 6. Dark Mode
**Test Steps:**
1. Check your system's current theme (Windows: Settings → Personalization → Colors)
2. Set system to **Light mode**, refresh page
3. Set system to **Dark mode**, refresh page

**Expected Result:**
- **Light mode:** White/light gray backgrounds, dark text
- **Dark mode:** Dark slate backgrounds, light text
- Colors transition smoothly (150ms animation)
- All UI elements remain readable in both modes

**Verification**: Dark mode respects system preference

---

## Manual Testing Status

Please test each feature above and mark as complete:

| Feature | Status | Notes |
|---------|--------|-------|
| Search | ⬜ | _Your results_ |
| Provider Filters | ⬜ | _Your results_ |
| Offline Mode | ⬜ | _Your results_ |
| Recommendations | ⬜ | _Your results_ |
| Responsive Design | ⬜ | _Your results_ |
| Dark Mode | ⬜ | _Your results_ |

---

## Known Limitations

1. **Data Source:** Currently using mock data (sample-models.json) since the production scraper from Phase 1 may not be running yet
2. **Refresh Rate:** Dashboard data is static for now — will auto-refresh every 15 minutes once the GitHub Actions scraper is live
3. **Auto-Deploy:** Not yet configured — requires manual setup in Vercel dashboard

---

## Next Steps for Full Production

1. **Complete Phase 1:** Ensure the GitHub Actions scraper is running and pushing to `data/models.json`
2. **Update Dashboard Data URL:** Point to the real GitHub URL (already configured in code)
3. **Configure Auto-Deploy:** Connect this repo to Vercel for automatic deployments on push to main
4. **Custom Domain:** Set up a custom domain (e.g., `radar.ai-models.com`) via Vercel dashboard

---

**Last Updated:** Phase 3 execution in progress
**Dashboard Version:** v1.0 (MVP)
