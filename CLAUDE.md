# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm build` - Build for production and test if everything works (includes TypeScript compilation and React Compiler)
- `pnpm lint` - Run ESLint with auto-fix and format with Prettier (fixes code issues automatically)

**Note**: We don't use `pnpm dev` - we test everything with `pnpm build` instead.

### Package Management

This project uses **pnpm** as the package manager, not npm.

## Architecture

### Technology Stack

- **React 19** with TypeScript
- **Next.js 15.4.5** with App Router for file-based routing
- **SWC + React Compiler** for fast compilation and automatic optimizations
- **Motion** for smooth animations and modern UI interactions
- **VIS-X** for Sudoku board data visualization (SVG-based)
- **Tailwind CSS v4** for styling - ONLY Tailwind classes, NO inline styles
- **ESLint** with Next.js core-web-vitals config
- **cn** for style condition utilities

### Project Structure

- `src/app/` - Next.js App Router structure
    - `layout.tsx` - Root layout component
    - `page.tsx` - Home page with Sudoku game
- `src/components/` - React components (SudokuApp, SudokuBoard, SudokuControls, etc.)
- `src/domain/` - Business logic and domain models (Sudoku game implementation)
- `src/patterns/` - Design patterns (Factory pattern for puzzle generation)
- `src/utils/` - Utility functions (cn for class names)

### Routing Architecture

Uses Next.js App Router:

- File-based routing in `src/app/` directory
- Automatic route generation based on folder structure
- Server and client components support
- Built-in optimization with SWC and React Compiler

### Domain Logic

The `src/domain/b.ts` file contains a comprehensive Sudoku game implementation with:

- Object-oriented design using constraint managers (Row, Column, Box)
- Seeded random number generation for reproducible puzzles
- Backtracking solver with unique solution validation
- Puzzle generation with configurable difficulty levels

### Performance First Philosophy

**Everything in this project is optimized for performance:**

- **Next.js 15.4.5** with React Compiler for automatic optimizations
- **SWC** compiler for fastest builds (replaces Babel)
- **React Compiler** provides automatic memoization without manual optimization
- **Minimize re-renders** - all components use memo, optimized state structure
- **VIS-X + SVG** for efficient Sudoku board rendering
- **Tailwind CSS v4** for optimized CSS generation
- **Build-first workflow** - no dev server, test with production builds

### UX/UI First Philosophy

**UX/UI is the absolute priority - no compromises:**

- **Easy to understand** - Players must understand immediately without thinking
- **Beautiful design** - CSS and design must always be beautiful and modern
- **Suitable for all ages and genders** - Design must be friendly to all user groups
- **Never create components without considering UX/UI** - Every component must prioritize user experience
- **Fast responsiveness** - Interactions must be smooth and clear
- **Accessible design** - Support users with special needs
- **Appropriate colors and fonts** - Choose readable colors and clear fonts

### Modern Game UI Requirements

**This is a GAME - it must look amazing:**

- **Motion animations** - Use Motion package for smooth transitions and micro-interactions
- **Dynamic visual effects** - Gradients, shadows, glows, and particle effects where appropriate
- **Game-like aesthetics** - NOT plain text or boring forms - this should feel like playing a premium game
- **Engaging phase transitions** - Beautiful loading states and screen transitions
- **Visual feedback** - Hover effects, click animations, success celebrations
- **Immersive experience** - UI should make players excited to play and interact

### Styling Rules - CRITICAL

**NEVER use inline styles with `style={}` - ONLY use Tailwind classes:**

```jsx
// ❌ WRONG - inline styles
<div style={{ display: 'flex', justifyContent: 'center' }}>

// ✅ CORRECT - Tailwind classes
<div className="flex justify-center">
```

**Configuration files that require type imports:**

- All `.js` config files MUST have JSDoc: `/** @type {import('package').Type} */`
- Examples: `tailwind.config.js`, `next.config.js`, `eslint.config.js`, `prettier.config.js`, `postcss.config.mjs`

### Game Start Screen Design Pattern

**Use this exact pattern for all future games - based on current Sudoku implementation:**

**Game Start Screen (GameStartScreen):**

```jsx
<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100">
	<div className="text-center">
		<motion.h1 className="mb-12 text-6xl font-bold text-slate-800">Game Name</motion.h1>

		<motion.button className="rounded-3xl bg-blue-600 px-20 py-6 text-2xl font-bold text-white shadow-2xl">
			Play
		</motion.button>
	</div>
</div>
```

**Difficulty Selection Screen (DifficultyScreen):**

```jsx
<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100">
	<div className="space-y-8 text-center">
		<motion.h1 className="mb-12 text-5xl font-bold text-slate-800">Choose Difficulty</motion.h1>

		<div className="space-y-4">
			{/* Difficulty buttons */}
			<motion.button className="w-full rounded-2xl bg-green-500 px-16 py-4 text-xl font-bold text-white shadow-lg">
				🟢 Easy
			</motion.button>
			<motion.button className="w-full rounded-2xl bg-yellow-500 px-16 py-4 text-xl font-bold text-white shadow-lg">
				🟡 Medium
			</motion.button>
			<motion.button className="w-full rounded-2xl bg-red-500 px-16 py-4 text-xl font-bold text-white shadow-lg">
				🔴 Hard
			</motion.button>
		</div>

		{/* Back button */}
		<motion.button className="rounded-xl bg-slate-200 px-12 py-3 text-lg font-semibold text-slate-700">
			Back
		</motion.button>
	</div>
</div>
```

**Key Principles:**

- **ONLY Tailwind classes** - NEVER use `style={}` inline styles
- **Use cn() utility** - For conditional styling with Tailwind classes
- **Perfect center** - Use `fixed inset-0 flex items-center justify-center`
- **Dynamic styling** - Use cn() to handle conditional states (active, hover, disabled)
- **Minimal design** - Only game name + Play button/difficulty buttons + Back button
- **No descriptions** - No features, tips, or long text
- **Motion animations** - Entrance animations only
- **Large buttons** - Big padding for easy clicking

**Root Layout (required):**

```jsx
<body>{children}</body> // Clean body with no additional styles
```

**For new games, say:** "Make start screens like Sudoku - use pattern in CLAUDE.md"

### Package Management

**Dependencies (Runtime)**: Only packages needed in production

- **Core Framework**: `next`, `react`, `react-dom`
- **UI Visualization**: `@visx/*` packages for SVG data visualization
- **Animation**: `motion` for smooth game transitions and micro-interactions
- **Styling**: `clsx`, `tailwind-merge` for conditional classes with cn() utility

**DevDependencies (Build Time)**: Development and build tools only

- **Build Tools**: `typescript`, `@next/eslint-plugin-next`, `babel-plugin-react-compiler`
- **Code Quality**: `eslint`, `eslint-config-next`, `eslint-plugin-react-hooks` (required by Next.js)
- **Styling Tools**: `tailwindcss`, `prettier`, `prettier-plugin-tailwindcss`
- **TypeScript Support**: `@types/*` packages for type definitions

**Package Cleanup Rules**:

- **IMMEDIATELY remove unused packages** - Never keep packages that aren't being used
- **Check dependencies regularly** - Use tools like `pnpm ls --depth=0` to audit
- **Test builds after removing packages** - Always run `pnpm build` to ensure nothing breaks
- **Don't remove packages required by configs** - Some packages are needed by ESLint/Next.js configs even if not directly imported
- **Document hidden dependencies** - If you remove a package and discover it's actually required, note it below and follow this rule strictly

**Known Required Packages (DO NOT REMOVE):**

- `eslint-plugin-react-hooks` - Required by `eslint-config-next/core-web-vitals` even though not directly imported
- `@eslint/eslintrc` - Required by ESLint flat config for compatibility with legacy configs
- `babel-plugin-react-compiler` - Required by Next.js config for React Compiler feature

**Package Removal Protocol:**

1. Remove suspected unused package: `pnpm remove package-name`
2. Test build: `pnpm build`
3. If build fails, immediately re-add: `pnpm add -D package-name` (or without -D for dependencies)
4. Document the package in "Known Required Packages" list above
5. Follow this protocol strictly - no exceptions

### Configuration Notes

- **ESLint** configured with `next/core-web-vitals` only (simplified config)
- **Arrow functions in memo** components are allowed (`react/display-name` disabled)
- **TypeScript** with ES2025 target for modern JavaScript features
- **All config files** have proper JSDoc type annotations: `/** @type {import('package').Type} */`
- **Tailwind CSS v4** with PostCSS plugin configured properly
- **Build Performance**: Cold build ~1 second, incremental builds near-instant
- **Bundle Size**: ~167kB for main game page (includes motion animations)

### Import Aliases

**ALWAYS use @app alias for imports - NEVER use relative paths:**

```jsx
// ✅ CORRECT - @app alias
import SudokuApp from '@app/components/SudokuApp'
import { GameState } from '@app/patterns/GameState'
import { useSudokuGame } from '@app/hooks/useSudokuGame'

// ❌ WRONG - relative paths
import SudokuApp from '../components/SudokuApp'
import { GameState } from '../../patterns/GameState'
```

**@app alias configuration:**

- Maps to `./src` directory
- Works with both Webpack (production) and Turbopack (development)
- Provides clean, consistent imports across the entire codebase

### Important Migration Notes

- **Tailwind CSS v4 setup**: Uses `@import 'tailwindcss'` in globals.css + postcss.config.mjs
- **NO inline styles**: Project uses ONLY Tailwind classes, never `style={}`
- **Config files**: All `.js` config files have JSDoc type imports for TypeScript intellisense
- **Prettier**: Uses JavaScript config file instead of JSON for consistency
- **@app alias**: Configured for both Turbopack (dev) and Webpack (build) compatibility

# Code Cleanup Rules

**Remove unused code, package or anything immediately - never keep code that isn't being used.**

# Development Rules

**Always check official documentation and source before using any configuration - memorize correct patterns in this MD file to avoid repeated mistakes.**

## Notes Feature Debug Experience

**Important lesson learned: Notes feature worked from the beginning - the issue was incorrect testing methodology.**

### Common Debugging Mistakes to Avoid

#### 1. **Testing in Wrong Cells** ❌

- **Mistake**: Clicking on cells with initial numbers (clues)
- **Result**: Notes cannot be added because code prevents modifying initial clues
- **Solution**: Always test in truly empty cells (Hard mode has more empty cells)

#### 2. **Premature Debug Log Removal** ❌

- **Mistake**: Removing console logs before confirming feature works
- **Result**: Unable to track down actual issues
- **Solution**: Keep comprehensive logs until feature is verified working

#### 3. **Single-Point Testing** ❌

- **Mistake**: Testing only one position/scenario
- **Result**: Missing the bigger picture
- **Solution**: Test multiple positions, difficulties, and edge cases

### What Was NOT the Problem

- ✅ SVG positioning was already correct
- ✅ Rendering logic was already correct
- ✅ State management was functional (despite React Compiler quirks)
- ✅ Keyboard handlers were working

### Debugging Best Practices

1. **Systematic Testing**: Test in multiple empty cells across different positions
2. **Environment Variation**: Test in different difficulty modes (Hard mode = more empty cells)
3. **Comprehensive Logging**: Log every step from input → validation → state → render
4. **Assumption Verification**: Don't assume code is broken - verify testing methodology first

**Remember: Sometimes the feature works fine, but we're testing it wrong!** 🎯

### Next.js 15.4.5 Correct Configuration

**Turbopack Configuration (STABLE - not experimental):**

```js
// ✅ CORRECT - Turbopack is stable in Next.js 15.4.5
turbopack: {
    resolveAlias: {
        '@app': './src',
    },
},

// ❌ WRONG - deprecated experimental.turbo
experimental: {
    turbo: { ... } // This causes warnings
}
```

**Current Stack Versions:**

- **Next.js 15.4.5** - Turbopack stable, use `turbopack` config
- **React 19** - Latest stable
- **Tailwind CSS v4** - Latest major version

### GitHub Pages Deployment

**This project is configured for GitHub Pages deployment with automatic CI/CD:**

- **Static Export**: Next.js configured with `output: 'export'` for static generation
- **GitHub Actions**: Auto-deployment on push to main branch
- **Build Command**: `pnpm build` generates static files in `/out` directory
- **Deploy Command**: `pnpm deploy` builds and adds `.nojekyll` file

**GitHub Pages Setup:**
1. Repository Settings → Pages → Source: "GitHub Actions"
2. Push to main branch triggers automatic deployment
3. Site available at: `https://username.github.io/repository-name`

### Git Commit Message Rules

**NEVER include Claude AI attribution in commit messages:**

```bash
# ❌ WRONG - Don't include Claude attribution
git commit -m "Fix bug

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# ✅ CORRECT - Clean, professional commit messages
git commit -m "Fix undo system bug where board didn't update visually

- Use flushSync for immediate state updates
- Implement proper deep copying for React state
- Optimize performance with JSON serialization"
```

**Commit message format:**
- Clear, descriptive title (50 chars max)
- Blank line
- Detailed bullet points if needed
- No AI tool attribution
