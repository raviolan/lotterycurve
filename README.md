# Vinlotteri Kurva

A simple, modern single-file web application for managing wine lottery prize distributions.

## Features

- **Interactive prize curve visualization** using Chart.js
- **Dynamic participant count** - works with any number of participants (not limited to 29)
- **Control points** at positions 1, 2, 3, 5, 10, 20, and last position
- **Vertical sliders** to adjust prize values at control points
- **Linear interpolation** between control points
- **Budget tracking** - shows income vs. total costs with visual indicator
- **Sponsored bottles** - add specific bottles that replace closest-value positions
- **Auto-save** - uses localStorage to persist your settings
- **Print-friendly** - table-only view when printing

## What's Different from the Old Version?

### Removed (Unnecessary Complexity)
- ❌ Node.js build system (Vue CLI, webpack, babel)
- ❌ 1,300+ npm dependencies
- ❌ Separate component files
- ❌ Build step and deployment complexity
- ❌ Old Vue 2 / Bootstrap 4
- ❌ Cookie-based storage (replaced with localStorage)

### Kept (Essential Functionality)
- ✅ Interactive chart with vertical sliders
- ✅ Dynamic participant count
- ✅ Control points and interpolation logic
- ✅ Budget calculation and display
- ✅ Sponsored bottles feature
- ✅ Position table with all prizes
- ✅ Data persistence

### Added (Modern Improvements)
- ✅ Vue 3 (latest stable)
- ✅ Chart.js 4 (modern charting)
- ✅ Single-file application (no build needed)
- ✅ Modern CSS with CSS Grid
- ✅ Clean, readable code
- ✅ Better mobile responsiveness

## How to Use

### Option 1: Open Directly
Simply open `index.html` in your web browser. That's it!

### Option 2: Serve Locally
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if you have it)
npx serve

# Then open http://localhost:8000
```

### Option 3: Deploy to Netlify
Just drag and drop the `index.html` file into Netlify's web interface. Done!

## Controls

1. **Antal personer** - Number of participants
2. **Insats från VX** - Sponsorship amount in kr
3. **Första pris** - First place prize value
4. **Sista pris** - Last place prize value
5. **Vertical sliders** - Adjust intermediate control points (2, 3, 5, 10, 20)

## Sponsored Bottles

Add specific wine bottles with names and prices. The system will automatically place them at the position with the closest prize value.

## Technical Details

- **Zero build step** - runs directly in the browser
- **No dependencies to install** - uses CDN for Vue and Chart.js
- **~350 lines** of clean, readable code (vs. thousands in the old version)
- **Works offline** once loaded (browser caches CDN files)
- **Auto-saves** to localStorage every time you make a change

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge) from the last 2-3 years.

## License

MIT
