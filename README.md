# Media Attribution Dashboard - Installation & Testing Guide

## 🎉 What Was Built

A fully functional media attribution dashboard that:
- ✅ Parses real CSV files from The Trade Desk
- ✅ Aggregates duplicate publishers (combines all "Hulu" entries into one)
- ✅ Calculates CPM: (Spend / Impressions) × 1000
- ✅ Filters by campaign with dropdown
- ✅ Displays interactive charts (bar charts, pie chart)
- ✅ Shows sortable table of top 25 publishers
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful UI with shadcn/ui components

---

## 📦 Installation Instructions

### 1. Install dependencies

```bash
# Using pnpm (recommended - faster)
pnpm install

# OR using npm
npm install
```

**Expected install time:** 2-3 minutes

### 2. Start the development server

```bash
# Using pnpm
pnpm dev

# OR using npm
npm run dev
```

The dashboard should open at: **http://localhost:3000**

---

## 🧪 Complete Testing Checklist

### ✅ Test 1: Initial Load (Empty State)
What you should see:
- [ ] Dashboard loads without errors
- [ ] Header shows "MA" logo and "Media Attribution"
- [ ] "Upload CSV" button is visible
- [ ] Hero stats show "—" and "Upload CSV to begin"
- [ ] Charts show "No data available"
- [ ] Table shows "Upload a CSV file to see publisher data"
- [ ] Campaign filter is NOT visible (no data loaded yet)

---

### ✅ Test 2: Upload Your CSV

1. **Click "Upload CSV"** button in top right
2. **Dialog opens** - You should see upload area
3. **Drag & drop** the `example_data.csv` file
   - Or click to browse and select file
4. **File appears** with name and size (e.g., "example_data.csv - 82.34 KB")
5. **Click "Upload"** button
6. **Watch the magic:**
   - Shows "Processing CSV..." with spinner
   - After 1-2 seconds: "Successfully uploaded! Loading dashboard..."
   - Dialog closes automatically

**Expected processing time:** 1-2 seconds for ~700 rows

---

### ✅ Test 3: Verify Dashboard Populated

After upload, ALL components should update instantly:

#### Header Section:
- [ ] Campaign filter dropdown appears next to Upload button
- [ ] Dropdown shows "All Campaigns" selected
- [ ] Click dropdown - should show all campaigns from your CSV:
  - "All Campaigns"
  - "CAMG | TTD | MVA/PI | Ohio | Lawrence : 4374"
  - "DNU"

#### Hero Stats Cards (The Big Numbers):
- [ ] **Total Impressions:** Shows large number (e.g., 220,000+) with commas
- [ ] **Total Spend:** Shows currency (e.g., $15,000.00)
- [ ] **Average CPM:** Shows currency (e.g., $40-60 range)
- [ ] All have blue/green/purple colored top borders
- [ ] Subtext says "across all campaigns"

#### Charts (3 visualizations):
- [ ] **Impressions Chart (left):** Horizontal blue bars showing ~10-15 publishers
- [ ] **Spend Chart (center):** Pie chart with colorful segments and percentages
- [ ] **CPM Chart (right):** Horizontal purple bars with $ values
- [ ] Hover over bars/segments → Tooltip appears with exact numbers
- [ ] Publisher names are visible on left side of bar charts

#### Table (Bottom):
- [ ] Header shows "Top 25 Publishers"
- [ ] Shows count (e.g., "Showing 15 publishers • Click column headers to sort")
- [ ] Top 3 rows have medal emojis: 🥇 🥈 🥉
- [ ] All 6 columns display:
  1. Rank (1, 2, 3...)
  2. Publisher (Hulu, Disney+, Pluto, etc.)
  3. Impressions (formatted with commas)
  4. Spend (formatted as $X,XXX.XX)
  5. CPM (formatted as $XX.XX)
  6. % Spend (formatted as XX.X%)
- [ ] Hover over row → Background highlights in light gray

---

### ✅ Test 4: Campaign Filtering (The Cool Part!)

**Test "All Campaigns" → Specific Campaign:**
1. [ ] Click campaign dropdown
2. [ ] Select "CAMG | TTD | MVA/PI | Ohio | Lawrence : 4374"
3. [ ] **Watch everything update INSTANTLY** (no page reload!):
   - Hero stats numbers change
   - Charts redraw with new data
   - Table updates with different publishers
   - Subtext changes to "for CAMG | TTD..."

**Test DNU Campaign:**
1. [ ] Click dropdown again
2. [ ] Select "DNU"
3. [ ] Should show very different data (only DNU campaign rows)
4. [ ] Likely fewer publishers (maybe only 2-3)
5. [ ] Numbers are much smaller

**Return to All Campaigns:**
1. [ ] Select "All Campaigns" again
2. [ ] Should return to original totals
3. [ ] All publishers back in table

**Why is this cool?** No page reload, no re-uploading CSV - instant filtering! ⚡

---

### ✅ Test 5: Table Sorting

Click each column header to test sorting:

1. [ ] **Click "Rank"** → Sorts by rank (1, 2, 3...)
2. [ ] **Click "Rank" again** → Reverses (25, 24, 23...)
3. [ ] **Click "Publisher"** → Alphabetical (A-Z)
4. [ ] **Click "Publisher" again** → Reverse alphabetical (Z-A)
5. [ ] **Click "Impressions"** → Highest to lowest impressions
6. [ ] **Click "Spend"** → Highest to lowest spend
7. [ ] **Click "CPM"** → Highest to lowest CPM
8. [ ] **Click "% Spend"** → Highest to lowest percentage

**Visual feedback:**
- [ ] Active sort column shows **blue arrow** (↑ or ↓)
- [ ] Inactive columns show gray double arrow (⇅)
- [ ] Ranks update based on sort (if sorting by CPM, rank 1 = highest CPM)

---

### ✅ Test 6: Verify Math is Correct

Let's make sure the calculations are accurate!

**Quick spot check:**
1. Open `example_data.csv` in Excel or Google Sheets
2. Filter to show only "Hulu" rows
3. **Manually calculate:**
   - Sum all Hulu impressions
   - Sum all Hulu "Advertiser Cost (Adv Currency)"
   - Calculate CPM: (Total Cost / Total Impressions) × 1000
4. Compare with "Hulu" row in dashboard

**Expected result:** Your manual calculation should match dashboard numbers exactly!

**Example:**
```
CSV has 4 Hulu rows:
Row 1: 42,910 impressions, $2,068.95
Row 2: 27,055 impressions, $1,364.32
Row 3: 23,206 impressions, $1,230.83
Row 4: 17,081 impressions, $908.65

Dashboard should show:
Impressions: 110,252 (sum of all)
Spend: $5,572.75 (sum of all)
CPM: $50.54 (calculated: 5572.75 / 110252 × 1000)
```

---

### ✅ Test 7: Error Handling

Test that errors are handled gracefully:

**Test 1: Wrong file type**
1. [ ] Try uploading a `.txt` or `.xlsx` file
2. [ ] Should show red error message: "Please upload a CSV file"
3. [ ] Upload button should be disabled

**Test 2: Empty CSV**
1. [ ] Create a blank CSV file
2. [ ] Try to upload it
3. [ ] Should show error: "CSV file is empty. Please upload a file with data."

**Test 3: CSV missing required columns**
1. [ ] Create CSV with only "Name, Age" columns (no Publisher Name, etc.)
2. [ ] Try to upload
3. [ ] Should show error listing missing columns

---

### ✅ Test 8: Responsive Design

Test on different screen sizes (use browser dev tools - F12, toggle device toolbar):

**Desktop (1920x1080):**
- [ ] All components visible side-by-side
- [ ] Hero stats: 3 columns
- [ ] Charts: 3 columns
- [ ] Table: Full width, no horizontal scroll
- [ ] Campaign filter shows full text

**Tablet (768-1024px):**
- [ ] Hero stats: 3 columns (maybe stacking at smaller sizes)
- [ ] Charts: 2 columns
- [ ] Table: May have horizontal scroll
- [ ] Campaign filter width adjusts

**Mobile (<768px):**
- [ ] Logo text hides (just shows "MA" icon)
- [ ] Upload button text shortens to just "Upload"
- [ ] Hero stats: Stacked vertically (1 column)
- [ ] Charts: Stacked vertically (1 column)
- [ ] Table: Horizontal scroll
- [ ] Campaign filter: Full width

---

### ✅ Test 9: Re-Upload

Test uploading multiple times:

1. [ ] Dashboard has data loaded
2. [ ] Click "Upload CSV" again
3. [ ] Upload the same file again
4. [ ] Should process successfully
5. [ ] Dashboard updates with same data (no duplicates)
6. [ ] No errors in console

---

## 🐛 Common Issues & Solutions

### Issue: `pnpm: command not found`
**Solution:** Install pnpm first or use npm
```bash
npm install -g pnpm
# OR just use npm instead
npm install
npm run dev
```

### Issue: Dashboard shows blank page
**Solution:** Check browser console (F12 → Console tab)
- Look for red errors
- Common cause: Dependencies not installed
- Fix: `rm -rf node_modules && pnpm install`

### Issue: "Cannot find module '@/store/useDashboardStore'"
**Solution:** TypeScript path alias issue
- Make sure you're in the project directory
- Try: `pnpm dev` again
- Check `tsconfig.json` has paths configured

### Issue: CSV upload fails with no error
**Solution:** Open browser console, look for error
- Most likely: CSV is missing required columns
- Required columns:
  - Publisher Name (or "Publisher Name (with tail aggregation)")
  - Campaign
  - Impressions
  - Advertiser Cost (Adv Currency)

### Issue: Numbers don't match expectations
**Check these:**
- [ ] Are you filtering by a campaign? (Try "All Campaigns")
- [ ] Is the CSV formatted correctly? (Commas in numbers are OK)
- [ ] Did you manually calculate from filtered data only?

### Issue: Campaign filter doesn't appear
**Solution:**
- Filter only appears AFTER uploading CSV
- If CSV uploaded but no filter: Check CSV has "Campaign" column
- Try refreshing page and re-uploading

---

## 📊 Understanding Your Data

### How Publisher Aggregation Works

Your CSV has **multiple rows per publisher** (different sites/apps):

```
CSV Structure:
Row 1: Hulu, Site: com.hulu.plus,    42,910 impressions, $2,068.95
Row 2: Hulu, Site: 2285,              27,055 impressions, $1,364.32
Row 3: Hulu, Site: b00f4a1gn6,        23,206 impressions, $1,230.83
Row 4: Hulu, Site: g16534661441,      17,081 impressions, $908.65
Row 5: Disney+, Site: 291097,         48,421 impressions, $2,740.50
...

Dashboard Aggregates To:
Hulu:    110,252 impressions, $5,572.75 (sum of all Hulu rows)
Disney+:  48,421 impressions, $2,740.50 (only one Disney+ entry in example)
```

**Aggregation logic:**
1. Group all rows by "Publisher Name"
2. Sum impressions for each publisher
3. Sum spend for each publisher
4. Recalculate CPM: (Total Spend / Total Impressions) × 1000

---

### Why is CPM Different From CSV?

**CSV CPM:** Per-row CPM (calculated for that specific site/app)
**Dashboard CPM:** Aggregate CPM (calculated from total spend / total impressions)

**Example:**
```
CSV shows:
- Hulu Site A: $50.00 CPM
- Hulu Site B: $40.00 CPM

Dashboard shows:
- Hulu: $46.67 CPM (weighted average based on totals)
```

The dashboard CPM is more accurate for overall publisher performance because it's weighted by volume.

---

### Top 25 Publishers

- **Default sort:** By spend (highest first)
- **Table:** Shows top 25 publishers
- **Charts:** Show top 10 publishers (for readability)
- **Sortable:** Click any column to re-sort

---

## 🚀 What's Next? (Future v2 Features)

What was built (but could in v2):

### Not in v1:
- ❌ Date range filtering (CSV doesn't have date columns)
- ❌ Month-over-month comparison
- ❌ API integration with Trade Desk (waiting for partner approval!)
- ❌ Data persistence (data clears on page refresh)
- ❌ Export to PDF/CSV (button is there, just disabled)
- ❌ Site-level drill-down (currently publisher-level only)
- ❌ Multiple file comparison
- ❌ User authentication
- ❌ Saved dashboard configurations

### Ready for v2:
This codebase is **perfectly structured** for API integration:
- Just swap CSV upload with API calls
- State management (Zustand) stays the same
- All components already reactive
- Easy to add date filtering when data includes dates

---

## 🎓 For Developers: Code Architecture

### Data Flow:
```
1. User uploads CSV
   ↓
2. csv-parser.ts reads file → RawCSVRow[]
   ↓
3. data-processor.ts aggregates → ProcessedPublisherData[]
   ↓
4. useDashboardStore.ts stores data
   ↓
5. All components read from store → UI updates!
```

### State Management Pattern:
```typescript
// In any component:
import { useDashboardStore } from '@/store/useDashboardStore'

function MyComponent() {
  // Read from store
  const data = useDashboardStore(state => state.processedData)
  
  // Call actions
  const uploadCSV = useDashboardStore(state => state.uploadCSV)
  
  // Component automatically re-renders when store updates!
}
```

### Key Functions:
- **parseCSV():** File → RawCSVRow[]
- **processCSVData():** RawCSVRow[] → ProcessedPublisherData[]
- **calculateDashboardStats():** ProcessedPublisherData[] → DashboardStats
- **sortPublishers():** Sort table by any column

---

## 📞 Questions?

If something doesn't work:
1. Check this README's troubleshooting section
2. Open browser console (F12) and look for errors
3. Verify CSV has required columns
4. Try `rm -rf node_modules && pnpm install`

---

## ✅ Success Criteria

You know it's working when:
- ✅ Can upload `media_ad_buys.csv`
- ✅ See real numbers in all 3 hero cards
- ✅ See charts with your publisher names
- ✅ See table with 15+ publishers
- ✅ Campaign filter changes all data instantly
- ✅ Table sorting works on all columns
- ✅ Manual math matches dashboard calculations

**Enjoy your dashboard!** 🎉
