# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Bumps Chart is a React library for rendering rowing bumps charts - specialized visualizations used in Oxford and Cambridge university rowing events. The library visualizes crew positions and movements over multi-day racing events, supporting both SVG rendering and PDF export.

## Commands

- `npm run storybook` - Start Storybook dev server (port 6006) for development
- `npm run build` - Compile TypeScript and build with Vite (outputs to `dist/`)
- `npm run build-storybook` - Build static Storybook
- `npm run release` - Create release using standard-version

Note: No unit tests or linting are currently configured.

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
│   ├── calculate-divisions.ts  # Core trajectory algorithm
│   ├── get-string-width.ts     # SVG text measurement (memoized)
│   └── ...
└── types.ts            # TypeScript interfaces (Event, Crew)

stories/                # Storybook stories with test data
```

### Key Patterns

- **Namespace pattern for Props**: Components use TypeScript namespaces (e.g., `BumpsChart.Props`)
- **CSS Modules**: Component-scoped styling with `.module.css` files
- **Path aliases**: `@/components` and `@/utils` configured in Vite/TypeScript
- **Memoization**: Custom memoization in `get-string-width.ts`, `useMemo` hooks for performance
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
