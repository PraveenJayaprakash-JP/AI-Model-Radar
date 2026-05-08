# Dashboard Testing Checklist

## Task 1: Local Testing

### Step 1: Open in browser
- [x] File opened successfully in browser via `Start-Process web-dashboard/ai-model-radar.html`
- [x] Page loads without console errors
- [x] Models display correctly from local data

### Step 2: Test search
- [ ] Type "gpt" in search box
- Expected: Results filter in ~200ms

### Step 3: Test filters
- [ ] Click provider filter chips
- Expected: Models filter correctly

### Step 4: Test offline mode
- [ ] Disconnect network, refresh page
- Expected: Shows cached data + offline banner

## Task 2: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```
Status: Not yet executed

### Step 2: Deploy
```bash
cd web-dashboard
vercel --prod
```
Status: Not yet executed

### Step 3: Configure auto-deploy
Status: Not yet configured
- Connect GitHub repo in Vercel dashboard
- Set: "GitHub Actions" triggers deploy on push to main

### Step 4: Verify live URL
Status: Not yet verified
- Visit the Vercel URL
- Expected: Same as local testing

## Task 3: Feature Verification

- [ ] Search: Real-time filter works
- [ ] Provider filters: Multi-select works
- [ ] Offline: Shows cached data when offline
- [ ] Recommendations: "Best for X" shows free models
- [ ] Responsive: 1-col mobile, 2-col tablet, 3-col desktop
- [ ] Dark mode: Respects system preference

## Test Results Summary

### Pass
✅ Dashboard HTML file exists
✅ Sample data file created
✅ File opens in browser

### Pending
⏳ Search functionality testing
⏳ Filter functionality testing
⏳ Offline mode testing
⏳ Vercel deployment
⏳ Feature verification
