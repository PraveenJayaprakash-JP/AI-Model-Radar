# Website Feature Parity Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add favorites, compare, and discover features to web-dashboard/ai-model-radar.html to match mobile app functionality.

**Architecture:** Single HTML file with vanilla JavaScript. Add slide-in drawers and modals for new features. Use localStorage for persistence.

**Tech Stack:** HTML, Tailwind CSS (CDN), Vanilla JavaScript, localStorage

---

### Task 1: Add Header Navigation & Favorites Button

**Files:**
- Modify: `web-dashboard/ai-model-radar.html:98-134`

**Steps:**

- [ ] **Step 1: Add navigation tabs and favorites button to header**

Replace the header actions section (lines 125-131) with:

```html
<!-- Navigation Tabs -->
<div class="hidden md:flex items-center gap-1">
  <button data-tab="browse" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white">Browse</button>
  <button data-tab="discover" class="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]">Discover</button>
</div>

<!-- Actions -->
<div class="flex items-center gap-2">
  <button id="favoritesBtn" class="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] relative" title="Favorites">
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
    <span id="favoritesBadge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hidden">0</span>
  </button>
  <button id="refreshBtn" class="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]" title="Refresh data">
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
  </button>
</div>
```

- [ ] **Step 2: Add CSS for favorites active state**

Add to `<style>` section (before `</style>`):

```css
.favorite-active {
  color: #ef4444 !important;
  fill: #ef4444;
}
```

- [ ] **Step 3: Add tab styling script**

Add to `<script>` section after `selectedProviders` declaration:

```javascript
// Tab state
let activeTab = 'browse';
```

- [ ] **Step 4: Add discover section container**

After the recommendations section (line 148), add:

```html
<!-- Discover Section (hidden by default) -->
<section id="discoverSection" class="hidden mb-12">
  <h2 class="text-2xl font-bold mb-6">Discover Models</h2>
  
  <!-- New This Month -->
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <span class="w-2 h-2 bg-green-500 rounded-full"></span>
      New This Month
    </h3>
    <div id="newModels" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
  </div>
  
  <!-- Free to Try -->
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
      Free to Try
    </h3>
    <div id="freeModels" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
  </div>
  
  <!-- Top Recommended -->
  <div>
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
      Top Recommended
    </h3>
    <div id="recommendedModels" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
  </div>
</section>
```

- [ ] **Step 5: Add Compare floating button**

Before `</body>`, add:

```html
<!-- Compare Floating Button -->
<div id="compareBar" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 z-50 hidden">
  <span id="compareCount" class="font-medium">0 selected</span>
  <button id="compareBtn" class="px-4 py-1.5 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100">
    Compare
  </button>
  <button id="clearCompare" class="p-1 hover:bg-primary-700 rounded">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  </button>
</div>
```

- [ ] **Step 6: Add Favorites Drawer**

Before `</body>`, add:

```html
<!-- Favorites Drawer -->
<div id="favoritesDrawer" class="fixed inset-y-0 right-0 w-80 bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-xl transform translate-x-full transition-transform z-50">
  <div class="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
    <h3 class="text-lg font-bold">Favorites</h3>
    <button id="closeFavorites" class="p-1 hover:bg-[var(--color-surface)] rounded">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
  <div id="favoritesList" class="p-4 overflow-y-auto h-[calc(100%-60px)]">
    <p class="text-[var(--color-text-muted)] text-center py-8">No favorites yet</p>
  </div>
</div>

<!-- Drawer Overlay -->
<div id="favoritesOverlay" class="fixed inset-0 bg-black/50 hidden z-40"></div>
```

- [ ] **Step 7: Add Compare Modal**

Before `</body>`, add:

```html
<!-- Compare Modal -->
<div id="compareModal" class="fixed inset-0 bg-black/50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-[var(--color-bg)] rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
    <div class="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
      <h3 class="text-lg font-bold">Compare Models</h3>
      <button id="closeCompare" class="p-1 hover:bg-[var(--color-surface)] rounded">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div id="compareContent" class="p-4 overflow-auto max-h-[calc(90vh-60px)]">
      <!-- Compare table rendered here -->
    </div>
  </div>
</div>
```

---

### Task 2: Add JavaScript State & Functions

**Files:**
- Modify: `web-dashboard/ai-model-radar.html:205-460`

**Steps:**

- [ ] **Step 1: Add state variables**

After `let selectedProviders = new Set();` add:

```javascript
// Favorites state
let favorites = JSON.parse(localStorage.getItem('aiModelRadar_favorites') || '[]');
let compareList = JSON.parse(localStorage.getItem('aiModelRadar_compare') || '[]');
```

- [ ] **Step 2: Add initialization calls**

In `document.addEventListener("DOMContentLoaded"`, add after `initRefresh()`:

```javascript
initFavorites();
initCompare();
initTabs();
updateFavoritesBadge();
```

- [ ] **Step 3: Add favorites functions**

Add these functions before `</script>`:

```javascript
// ============ Favorites ============
function initFavorites() {
  document.getElementById('favoritesBtn').addEventListener('click', openFavoritesDrawer);
  document.getElementById('closeFavorites').addEventListener('click', closeFavoritesDrawer);
  document.getElementById('favoritesOverlay').addEventListener('click', closeFavoritesDrawer);
  renderFavoritesList();
}

function toggleFavorite(modelId) {
  const index = favorites.indexOf(modelId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(modelId);
  }
  localStorage.setItem('aiModelRadar_favorites', JSON.stringify(favorites));
  updateFavoritesBadge();
  renderFavoritesList();
  renderAll();
}

function isFavorite(modelId) {
  return favorites.includes(modelId);
}

function updateFavoritesBadge() {
  const badge = document.getElementById('favoritesBadge');
  if (favorites.length > 0) {
    badge.textContent = favorites.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function openFavoritesDrawer() {
  document.getElementById('favoritesDrawer').classList.remove('translate-x-full');
  document.getElementById('favoritesOverlay').classList.remove('hidden');
}

function closeFavoritesDrawer() {
  document.getElementById('favoritesDrawer').classList.add('translate-x-full');
  document.getElementById('favoritesOverlay').classList.add('hidden');
}

function renderFavoritesList() {
  const container = document.getElementById('favoritesList');
  const favModels = allModels.filter(m => favorites.includes(m.id));
  
  if (favModels.length === 0) {
    container.innerHTML = '<p class="text-[var(--color-text-muted)] text-center py-8">No favorites yet</p>';
    return;
  }
  
  container.innerHTML = favModels.map(model => `
    <div class="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg mb-2">
      <div class="flex-1 min-w-0">
        <div class="font-medium text-sm truncate">${model.name}</div>
        <div class="text-xs text-[var(--color-text-muted)]">${model.provider}</div>
      </div>
      <button onclick="toggleFavorite('${model.id}')" class="p-1 text-red-500 hover:bg-red-50 rounded">
        <svg class="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `).join('');
}

function removeFavorite(modelId) {
  favorites = favorites.filter(f => f !== modelId);
  localStorage.setItem('aiModelRadar_favorites', JSON.stringify(favorites));
  updateFavoritesBadge();
  renderFavoritesList();
  renderAll();
}
```

- [ ] **Step 4: Add compare functions**

Add before `</script>`:

```javascript
// ============ Compare ============
function initCompare() {
  document.getElementById('compareBtn').addEventListener('click', openCompareModal);
  document.getElementById('closeCompare').addEventListener('click', closeCompareModal);
  document.getElementById('clearCompare').addEventListener('click', clearCompareList);
  document.getElementById('compareModal').addEventListener('click', (e) => {
    if (e.target.id === 'compareModal') closeCompareModal();
  });
}

function toggleCompare(modelId) {
  const index = compareList.indexOf(modelId);
  if (index > -1) {
    compareList.splice(index, 1);
  } else if (compareList.length < 5) {
    compareList.push(modelId);
  }
  localStorage.setItem('aiModelRadar_compare', JSON.stringify(compareList));
  updateCompareBar();
  renderAll();
}

function isInCompare(modelId) {
  return compareList.includes(modelId);
}

function updateCompareBar() {
  const bar = document.getElementById('compareBar');
  const count = document.getElementById('compareCount');
  if (compareList.length >= 2) {
    count.textContent = `${compareList.length} selected`;
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
}

function clearCompareList() {
  compareList = [];
  localStorage.setItem('aiModelRadar_compare', JSON.stringify(compareList));
  updateCompareBar();
  renderAll();
}

function openCompareModal() {
  const modal = document.getElementById('compareModal');
  const content = document.getElementById('compareContent');
  const compareModels = allModels.filter(m => compareList.includes(m.id));
  
  const fields = [
    { label: 'Provider', key: 'provider' },
    { label: 'Input Price', key: 'pricing.input_cost_per_1k', format: v => v ? `$${v}/1K` : '-' },
    { label: 'Output Price', key: 'pricing.output_cost_per_1k', format: v => v ? `$${v}/1K` : '-' },
    { label: 'Context Length', key: 'context_length', format: v => v ? v.toLocaleString() : '-' },
    { label: 'Free Tier', key: 'free_tier', format: v => v ? '✓ Yes' : '✗ No' },
    { label: 'Capabilities', key: 'capabilities', format: v => v ? v.join(', ') : '-' },
  ];
  
  let html = '<table class="w-full text-sm"><thead><tr>';
  compareModels.forEach(m => {
    html += `<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">${m.name}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  fields.forEach(field => {
    html += '<tr>';
    compareModels.forEach(m => {
      let value = field.key.split('.').reduce((obj, k) => obj?.[k], m);
      value = field.format ? field.format(value) : value || '-';
      html += `<td class="p-3 border-b border-[var(--color-border)]">${value}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  content.innerHTML = html;
  modal.classList.remove('hidden');
}

function closeCompareModal() {
  document.getElementById('compareModal').classList.add('hidden');
}
```

- [ ] **Step 5: Add tab navigation**

Add before `</script>`:

```javascript
// ============ Tabs ============
function initTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      activeTab = tab;
      
      // Update button styles
      document.querySelectorAll('[data-tab]').forEach(b => {
        if (b.dataset.tab === tab) {
          b.classList.add('bg-primary-600', 'text-white');
          b.classList.remove('text-[var(--color-text-muted)]');
        } else {
          b.classList.remove('bg-primary-600', 'text-white');
          b.classList.add('text-[var(--color-text-muted)]');
        }
      });
      
      // Show/hide sections
      const discoverSection = document.getElementById('discoverSection');
      const recommendationsSection = document.querySelector('section:nth-of-type(2)');
      const filtersSection = document.querySelector('section:nth-of-type(3)');
      const modelsSection = document.querySelector('section:nth-of-type(4)');
      
      if (tab === 'discover') {
        discoverSection.classList.remove('hidden');
        recommendationsSection.classList.add('hidden');
        filtersSection.classList.add('hidden');
        modelsSection.classList.add('hidden');
        renderDiscoverSection();
      } else {
        discoverSection.classList.add('hidden');
        recommendationsSection.classList.remove('hidden');
        filtersSection.classList.remove('hidden');
        modelsSection.classList.remove('hidden');
      }
    });
  });
}

function renderDiscoverSection() {
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  // New this month
  const newModels = allModels
    .filter(m => m.launch_date && m.launch_date * 1000 > thirtyDaysAgo)
    .slice(0, 6);
  
  // Free models
  const freeModels = allModels.filter(m => m.free_tier).slice(0, 6);
  
  // Recommended (has capabilities)
  const recommendedModels = allModels.filter(m => m.capabilities?.length).slice(0, 6);
  
  document.getElementById('newModels').innerHTML = newModels.map(m => renderModelCard(m, false)).join('') || '<p class="text-[var(--color-text-muted)]">No new models</p>';
  document.getElementById('freeModels').innerHTML = freeModels.map(m => renderModelCard(m, false)).join('') || '<p class="text-[var(--color-text-muted)]">No free models</p>';
  document.getElementById('recommendedModels').innerHTML = recommendedModels.map(m => renderModelCard(m, false)).join('') || '<p class="text-[var(--color-text-muted)]">No recommendations</p>';
}
```

---

### Task 3: Update Model Card & Render Functions

**Files:**
- Modify: `web-dashboard/ai-model-radar.html:382-418`

**Steps:**

- [ ] **Step 1: Update renderModelCard to include favorite and compare checkboxes**

Replace `renderModelCard` function with:

```javascript
function renderModelCard(model, showCompare = true) {
  const pricing = model.pricing || {};
  const isFree = model.free_tier;
  const favActive = isFavorite(model.id) ? 'favorite-active' : '';
  const compareChecked = isInCompare(model.id) ? 'checked' : '';
  const canCompare = compareList.length >= 5 && !compareChecked ? 'disabled' : '';
  
  return `
    <article class="card rounded-xl p-6 hover:shadow-lg transition-shadow relative">
      <!-- Compare Checkbox -->
      ${showCompare ? `
        <label class="absolute top-4 right-4 flex items-center gap-2 cursor-pointer ${canCompare}" title="${canCompare ? 'Max 5 models' : 'Select to compare'}">
          <input type="checkbox" ${compareChecked} ${canCompare} onchange="toggleCompare('${model.id}')" 
            class="w-4 h-4 rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500">
          <span class="text-xs text-[var(--color-text-muted)]">Compare</span>
        </label>
      ` : ''}
      
      <!-- Favorite Button -->
      <button onclick="toggleFavorite('${model.id}')" class="absolute top-4 left-4 ${favActive}" title="${favActive ? 'Remove from favorites' : 'Add to favorites'}">
        <svg class="w-6 h-6" fill="${favActive ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
      
      <div class="flex items-start justify-between mb-4 mt-8">
        <div>
          <h3 class="font-semibold text-lg">${model.name || 'Unknown'}</h3>
          <span class="text-sm text-[var(--color-text-muted)]">${model.provider || 'Unknown'}</span>
        </div>
        ${isFree ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">FREE</span>' : ''}
      </div>
      
      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-[var(--color-text-muted)]">Input</span>
          <span class="font-medium">$${pricing.input_cost_per_1k || '--'}/1K</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[var(--color-text-muted)]">Output</span>
          <span class="font-medium">$${pricing.output_cost_per_1k || '--'}/1K</span>
        </div>
      </div>
      
      ${model.capabilities?.length ? `
        <div class="mt-4 flex flex-wrap gap-1">
          ${model.capabilities.map(cap => `
            <span class="px-2 py-0.5 bg-[var(--color-surface)] text-xs text-[var(--color-text-muted)] rounded">
              ${cap}
            </span>
          `).join('')}
        </div>
      ` : ''}
    </article>
  `;
}
```

- [ ] **Step 2: Verify no JavaScript errors**

Run a quick syntax check by opening the HTML file in a browser and checking console for errors.

---

### Task 4: Test & Deploy

**Files:**
- None (testing and deployment)

**Steps:**

- [ ] **Step 1: Test locally**

Open `web-dashboard/ai-model-radar.html` in browser and verify:
- Browse/Discover tabs switch correctly
- Can favorite/unfavorite models
- Favorites persist after page refresh
- Can select 2-5 models for comparison
- Compare modal shows side-by-side data
- Discover shows new/free/recommended sections

- [ ] **Step 2: Deploy to Vercel**

```bash
cd web-dashboard
npx vercel --prod
```

- [ ] **Step 3: Verify live URL**

Open the deployed URL and test all features work in production.

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch subagents per task

**2. Inline Execution** - Execute tasks in this session

Which approach?