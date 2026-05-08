# Mobile App QA Checklist

**Date:** May 8, 2026
**Build:** Expo Preview Build (or Production Build)

## iOS Testing (iPhone)

### Basic Functionality
- [ ] App launches within 2 seconds of icon tap
- [ ] Splash screen displays with app icon
- [ ] All 4 tabs load: Discover, Browse, Compare, Profile
- [ ] Tab navigation works without lag
- [ ] Back button returns to previous screen (if stack navigation added)
- [ ] App doesn't crash on launch or navigation

### Data Loading
- [ ] Models load from GitHub (data fetch works)
- [ ] Initial load shows "Loading AI models..." (ActivityIndicator)
- [ ] Background refresh shows "Updating models..." banner
- [ ] Stale data > 15 minutes shows orange warning banner
- [ ] Offline mode: disconnect WiFi, verify cached data loads from MMKV

### Search & Filters (Browse Tab)
- [ ] Search box filters models in real-time (~200ms)
- [ ] Search focus autofocus on Browse screen load
- [ ] Provider filter chips toggle on/off
- [ ] Multiple providers can be selected (multi-select)
- [ ] Capability filters work (text, vision, audio, etc.)
- [ ] Clear filters button resets all filters

### Discover Tab
- [ ] "New Models" section shows (< 30 day launch)
- [ ] "Free Models" section shows (free tier badge)
- [ ] Sections scroll independently from main model list
- [ ] Spotlight sections render ModelCards correctly

### Model Cards
- [ ] Provider logo displays correctly (OpenAI, Anthropic, etc.)
- [ ] Model name displays correctly
- [ ] Contact window shows (e.g., "128K tokens")
- [ ] Pricing displayed (/input cost) if paid
- [ ] Free tier badge shows "FREE" with limit
- [ ] Capability tags display
- [ ] Share button on every model card (from Plan 04-01)
- [ ] Share button opens iOS share sheet with model name/URL
- [ ] Share to Messages, Email, Twitter works

### List Scrolling Performance
- [ ] FlashList scrolls smoothly at 60fps (verify with Performance Monitor)
- [ ] No frame drops when scrolling through 50+ models
- [ ] Pull-to-refresh gesture works
- [ ] Scroll position maintained during refresh
- [ ] Overscroll bounce effect works (iOS native)

### Error Handling
- [ ] Error banner displays if fetch fails
- [ ] Retry button on error banner works
- [ ] Error boundary catches crashes and shows "Something went wrong" UI
- [ ] Sentry logs errors (check Sentry dashboard if DSN configured)
- [ ] No white screen on error

### Accessibility (iOS)
- [ ] VoiceOver reads model names, pricing, provider
- [ ] Touch targets ≥ 44x44px (iOS spec)
- [ ] Color contrast ≥ 4.5:1 (use Accessibility Inspector)
- [ ] Keyboard navigation works with external keyboard (Tab, arrows)

### Dark Mode
- [ ] Toggle in Profile Settings switches between light/dark
- [ ] Dark mode persists across app restarts (Zustand store)
- [ ] High contrast in both modes
- [ ] Text readability maintained in dark mode

## Android Testing (Phone)

### Basic Functionality
- [ ] App launches within 2 seconds
- [ ] Splash screen displays (or Android adaptive icon animation)
- [ ] All 4 tabs load correctly
- [ ] Tab navigation works without lag
- [ ] Back button returns to previous screen
- [ ] App doesn't crash

### Data Loading
- [ ] Models load from GitHub
- [ ] Initial load shows ActivityIndicator
- [ ] Background refresh shows banner
- [ ] Offline mode works (disconnect WiFi, verify MMKV cache)

### Search & Filters (Browse Tab)
- [ ] Search box works with virtual keyboard
- [ ] Keyboard dismisses after search
- [ ] Provider filter chips switch on/off (toggle)
- [ ] Multiple providers selectable
- [ ] Capability filters work

### Model Cards & Sharing
- [ ] Provider logos display
- [ ] Share button exists on model cards
- [ ] Share button opens Android share menu (Intent.Action_SEND)
- [ ] Share to Gmail, Twitter, WhatsApp works

### List Scrolling Performance
- [ ] FlashList scrolls smoothly
- [ ] No frame drops (verify with Flipper Performance Monitor)
- [ ] Pull-to-refresh gesture works (RTL support?)
- [ ] Scroll position maintained

### Accessibility (Android)
- [ ] TalkBack reads model names, pricing, provider
- [ ] Touch targets ≥ 48x48px (Android spec)
- [ ] Color contrast ≥ 4.5:1 (verify with Accessibility Scanner)
- [ ] Keyboard navigation works (Tab, arrows, Enter)

### Responsive Design (Multiple Screen Sizes)
- [ ] Phone (360x640 - common size): Model cards render correctly
- [ ] Phone (411x731 - large phone): Model cards scale appropriately
- [ ] Tablet (800x1280): Verify if app supports landscape
- [ ] No horizontal scroll on phone sizes

## Device-Specific Edge Cases

### Low-RAM Device (e.g., iPhone 8, Samsung Galaxy A series)
- [ ] App launches without Out of Memory error
- [ ] List scrolling doesn't cause jank on low-end device
- [ ] Background refresh doesn't freeze UI
- [ ] App handles low memory warnings gracefully (React Native warnings)

### Older OS Versions
- [ ] iOS 13+ compatible (minimum iOS version in app.json)
- [ ] Android 8.0+ compatible (minimum Android version)
- [ ] No crashes on older OS versions

### Network Conditions
- [ ] Slow 3G connection (< 1 Mbps): Models still load (timeout handled)
- [ ] Offline mode: Cache works without network
- [ ] Network reconnect: Auto-refresh triggers

---

**Testing Status:**
- iOS (iPhone): [ ] PASS / [ ] FAIL
- Android (Phone): [ ] PASS / [ ] FAIL
- Accessibility (iOS VoiceOver/Android TalkBack): [ ] PASS / [ ] FAIL
- Performance (60fps scrolling): [ ] PASS / [ ] FAIL

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