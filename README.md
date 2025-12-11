# Vinlotteri Kurva

A modern, well-structured web application for managing wine lottery prize distributions.

## Features

- **Interactive prize curve visualization** using Chart.js
- **Dynamic participant count** - works with any number of participants
- **Control points** at positions 1, 2, 3, 5, 10, 20, and last position
- **Vertical sliders** to adjust prize values at control points
- **Linear interpolation** between control points
- **Budget tracking** - shows income vs. total costs with visual indicator
- **Sponsored bottles** - add specific bottles that replace closest-value positions
- **Auto-save** - uses localStorage to persist your settings
- **Print-friendly** - table-only view when printing

## Tech Stack (v2.1)

- **Vue 3.4** - Modern reactive framework
- **Chart.js 4.4** - Interactive charts
- **Vite 5** - Lightning-fast build tool
- **Vitest** - Unit testing framework
- **ESLint + Prettier** - Code quality tools

## Project Structure

```
lotterycurve/
├── src/
│   ├── App.vue              # Main Vue component
│   ├── main.js              # App entry point
│   ├── style.css            # Global styles
│   ├── utils/
│   │   ├── calculations.js  # Business logic
│   │   ├── storage.js       # LocalStorage utilities
│   │   └── chart.js         # Chart.js helpers
│   └── tests/               # Unit tests
├── index.html               # Vite entry HTML
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── netlify.toml             # Deployment config
```

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development commands.

### Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## What's New in v2.1?

### Improved Architecture
- ✅ **Modular structure** - Separated concerns (UI, logic, utilities)
- ✅ **Vite build system** - Modern, fast development experience
- ✅ **TypeScript-ready** - Easy migration path to TypeScript
- ✅ **Unit tests** - Comprehensive test coverage with Vitest
- ✅ **Code quality** - ESLint + Prettier for consistent code
- ✅ **Better maintainability** - Clean separation of business logic

### Future-Proofing
- ✅ **Versioned dependencies** - Pinned Vue and Chart.js versions
- ✅ **Build optimization** - Tree-shaking, minification, code splitting
- ✅ **Developer experience** - Hot module replacement, fast builds
- ✅ **Testing infrastructure** - Easy to add new tests
- ✅ **Scalable** - Ready for feature expansion

## Deployment

This project is configured for Netlify deployment. Simply push to your repository and Netlify will automatically build and deploy.

The build command is `npm run build` and outputs to the `dist/` directory.
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
