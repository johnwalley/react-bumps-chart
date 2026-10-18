# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Bumps Chart is a React library for rendering rowing bumps charts - specialized visualizations used in Oxford and Cambridge university rowing events. The library visualizes crew positions and movements over multi-day racing events, supporting both SVG rendering and PDF export.

## Commands

- `npm run storybook` - Start Storybook dev server (port 6006) for development
- `npm run build` - Compile TypeScript and build with Vite (outputs to `dist/`)
- `npm test` - Run Vitest tests (`test/`); `npx vitest run test/calculate-join.test.ts` for one file, `-u` to update snapshots
- `npm run build-storybook` - Build static Storybook
- `npm run release` - Create release using standard-version

Tests snapshot the pure `src/utils` layout functions against the event fixtures in `stories/*.json`. CI (`.github/workflows/ci.yml`) runs `tsc`, tests and build on every PR. No linting is configured.

## Architecture

### Main Components

**BumpsChart** - Single event chart (SVG)
- Props: `data: Event`, `blades?: boolean`, `spoons?: boolean`
- Renders crew trajectories as polylines showing position changes across racing days

**BumpsChartMultiYear** - Multiple consecutive years (SVG)
- Props: `data: Event[]`, `blades?: boolean`
- Handles year labels, coordinate alignment, and visual connections between years

**PDF Components** (`src/components/pdf/`) - Parallel components using `@react-pdf/renderer` for PDF export

### Directory Structure

```
src/
├── components/          # React SVG components
│   ├── blades/         # Rowing blade icons
│   ├── crews/          # Crew name labels
│   ├── division/       # Main chart (polylines, positions)
│   ├── numbers/        # Position numbers
│   ├── stripes/        # Background patterns
│   └── pdf/            # React-PDF versions of above
├── utils/              # Pure calculation functions
│   ├── layout-chart.ts         # Positions every part of a single-event chart
│   ├── layout-chart-multi-year.ts  # Same for consecutive events
│   ├── calculate-divisions.ts  # Core trajectory algorithm
│   ├── measure-text.ts         # SVG text measurement + useMeasureText hook
│   ├── get-string-width.ts     # DOM text measurement (cached)
│   └── ...
└── types.ts            # TypeScript interfaces (Event, Crew)

stories/                # Storybook stories with test data
```

### Key Patterns

- **Namespace pattern for Props**: Components use TypeScript namespaces (e.g., `BumpsChart.Props`)
- **CSS Modules**: Component-scoped styling with `.module.css` files
- **Path aliases**: `@/components` and `@/utils` configured in Vite/TypeScript
- **Shared layout**: SVG and PDF components only render. All positions come from `layoutChart` / `layoutChartMultiYear`, which take a `measureText` function: `useMeasureText()` for SVG (estimates on the server, DOM after mount, re-measures when fonts load) and `measurePdfText` (Helvetica metrics) for PDF. Change layout there, not in components
- **Memoization**: `get-string-width.ts` caches DOM measurements (cleared when web fonts load), `useMemo` for layouts
- **Coordinate system**: Canvas-based positioning with scale factor (default: 16)

### Core Data Types

The `Event` interface represents a racing event with properties like `set` (event name), `days`, `crews`, and position data. The `Crew` interface tracks individual boat data including `start`/`end` positions, `gain`, `withdrawn` status, and `blades` highlighting.

### Build Configuration

- **Vite** with SWC compiler, outputting ES modules only
- **TypeScript** strict mode enabled
- **External dependencies**: React/React-DOM not bundled
- Declarations generated via `vite-plugin-dts`

## Dependencies

Key external libraries:
- `@react-pdf/renderer` - PDF generation
- `d3-*` packages - Data manipulation and scaling
- `react-rowing-blades` - Boat blade SVG icons
