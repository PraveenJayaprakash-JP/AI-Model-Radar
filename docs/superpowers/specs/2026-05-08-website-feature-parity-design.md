# Website Feature Parity Design

## Overview
Add missing features to web-dashboard/ai-model-radar.html to match mobile app functionality: favorites, compare, and discover features.

## Current State
- Single HTML page with search + provider filters
- Basic model card display
- Recommendations section (static, not full discover)

## Target Features

### 1. Favorites System
- Heart icon on each model card to save/unsave
- Favorites persisted in localStorage
- Favorites drawer (slide-in panel from right)
- "Favorites" button in header to open drawer
- Remove individual favorites from drawer
- Show count badge on favorites button

### 2. Compare Feature
- Checkbox on each model card to select for comparison
- "Compare" button appears when 2+ models selected
- Compare panel/modal showing side-by-side comparison
- Compare fields: name, provider, pricing (input/output), context length, capabilities, free tier
- Clear selection button
- Maximum 5 models for comparison

### 3. Discover Page (Enhanced)
- Keep existing "Best Models for Your Task" section
- Add dedicated "New & Free" spotlight section
- Tabs or sections for: New Arrivals, Free Models, Recommended
- Filter by: recently launched (last 30 days), free tier available

### 4. Profile (Simplified)
- Show in header as avatar/icon
- Dropdown with: Favorites count, Compare history count
- Link to view all favorites

## UI/UX Design

### Layout
- Keep existing header with search
- Add navigation tabs: Browse | Discover
- Add Favorites button (with badge) in header
- Compare button appears floating when models selected

### Color Scheme
- Use existing purple primary (#8b5cf6)
- Favorites: heart icon red (#ef4444) when active
- Compare: checkbox with primary color when selected
- Dark mode support already exists

### Components

#### Favorites Drawer
- Slides in from right (300px width)
- Close button + "X" key to dismiss
- List of saved models with remove button
- Empty state: "No favorites yet"

#### Compare Modal
- Centered modal (max 900px wide)
- Scrollable if many fields
- Table format with model names as columns
- Close button + click outside to dismiss

#### Discover Section
- Toggle between Browse/Discover views
- Discover shows filtered sections:
  - "New This Month" - recently added
  - "Free to Try" - has free tier
  - "Top Recommended" - based on capabilities

## Acceptance Criteria
1. User can favorite/unfavorite any model
2. Favorites persist after page refresh
3. User can select 2-5 models for comparison
4. Compare modal shows all selected models side-by-side
5. Discover page shows new and free model sections
6. All features work in both light and dark mode
7. Responsive: works on mobile (stack vertically) and desktop

## Technical Notes
- Single HTML file (no build step)
- localStorage for persistence
- Vanilla JavaScript (no frameworks)
- Tailwind CSS (already included via CDN)