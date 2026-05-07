# Web Dashboard Implementation Plan

> **For agentic workers:** Phase 3 web dashboard is already implemented in `web-dashboard/ai-model-radar.html`. This plan covers verification and deployment.

**Goal:** Verify the single-file web dashboard works correctly and deploy to Vercel for public access.

**Architecture:** 
- Single HTML file with embedded CSS/JS (Tailwind via CDN)
- Offline-first with localStorage caching
- Responsive grid (1/2/3 columns)

**Tech Stack:**
- HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- Vercel for hosting

---

## Verification Tasks

### Task 1: Local Testing

- [ ] **Step 1: Open in browser**
  ```bash
  # Open directly in browser
  open web-dashboard/ai-model-radar.html
  # Or serve locally
  npx serve web-dashboard/
  ```
  Expected: Page loads, models display

- [ ] **Step 2: Test search**
  Type "gpt" in search box
  Expected: Results filter in ~200ms

- [ ] **Step 3: Test filters**
  Click provider filter chips
  Expected: Models filter correctly

- [ ] **Step 4: Test offline mode**
  Disconnect network, refresh page
  Expected: Shows cached data + offline banner

---

### Task 2: Vercel Deployment

- [ ] **Step 1: Install Vercel CLI**
  ```bash
  npm i -g vercel
  ```

- [ ] **Step 2: Deploy**
  ```bash
  cd web-dashboard
  vercel --prod
  ```
  Expected: Deploys to Vercel URL

- [ ] **Step 3: Configure auto-deploy**
  Connect GitHub repo in Vercel dashboard
  Set: "GitHub Actions" triggers deploy on push to main

- [ ] **Step 4: Verify live URL**
  Visit the Vercel URL
  Expected: Same as local testing

---

### Task 3: Feature Verification

- [ ] **Search**: Real-time filter works
- [ ] **Provider filters**: Multi-select works  
- [ ] **Offline**: Shows cached data when offline
- [ ] **Recommendations**: "Best for X" shows free models
- [ ] **Responsive**: 1-col mobile, 2-col tablet, 3-col desktop
- [ ] **Dark mode**: Respects system preference

---

## Deployment Checklist

| Step | Status |
|------|--------|
| Local test passed | ☐ |
| Vercel deploy success | ☐ |
| Auto-deploy configured | ☐ |
| Custom domain (optional) | ☐ |

---

**Plan complete.** Ready for verification and deployment.