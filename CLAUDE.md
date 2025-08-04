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
- **Zustand** for state management with persistence and devtools
- **usehooks-ts** for common React hooks (useLocalStorage, useInterval, useDebounce, etc.)
- **es-toolkit** for utility functions (replaces lodash - lighter and faster)
- **immer** for immutable state updates in Zustand

### Project Structure

- `src/app/` - Next.js App Router structure
    - `layout.tsx` - Root layout component
    - `page.tsx` - Home page with Sudoku game
- `src/components/` - React components (SudokuApp, SudokuBoard, GameStartScreen, DifficultyScreen)
- `src/domain/` - Business logic and domain models (Sudoku game implementation)
- `src/patterns/` - Design patterns (GameState, PuzzleFactory, DifficultyStrategy)
- `src/utils/` - Utility functions (cn for class names, es-toolkit utilities)
- `src/stores/` - Zustand state management stores
- `src/hooks/` - Custom React hooks using usehooks-ts

### Routing Architecture

Uses Next.js App Router:

- File-based routing in `src/app/` directory
- Automatic route generation based on folder structure
- Server and client components support
- Built-in optimization with SWC and React Compiler

### Domain Logic

The `src/domain/sudoku-game.ts` file contains a comprehensive Sudoku game implementation with:

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

- **Premium UI design** - Gradients, 3D effects, and engaging animations throughout
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
			<motion.button className="w-full rounded-2xl bg-green-500 px-16 py-4 text-xl font-bold text-white shadow-lg">
				Easy
			</motion.button>
			<motion.button className="w-full rounded-2xl bg-yellow-500 px-16 py-4 text-xl font-bold text-white shadow-lg">
				Medium
			</motion.button>
			<motion.button className="w-full rounded-2xl bg-red-500 px-16 py-4 text-xl font-bold text-white shadow-lg">
				Hard
			</motion.button>
		</div>

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
- **State Management**: `zustand`, `immer` for state management with immutable updates
- **Utility Libraries**: `es-toolkit`, `usehooks-ts` for common functions and hooks
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

## State Management Architecture

### Zustand Stores - MANDATORY for State Management

**ALWAYS use Zustand for state management - NEVER use useState for complex state:**

```tsx
// ✅ CORRECT - Zustand stores
import { useGameStore, useUIStore, useSettingsStore } from '@app/stores'

const { gameState, createNewGame, handleCellInput } = useGameStore()
const { selectedCell, handleCellSelection } = useUIStore()
const { gameSettings, updateSettings } = useSettingsStore()

// ❌ WRONG - Complex useState
const [gameState, setGameState] = useState<SudokuGameState | null>(null)
const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
```

**Zustand Store Structure:**
- `src/stores/gameStore.ts` - Game state, actions, undo/redo
- `src/stores/uiStore.ts` - UI state, selections, modals
- `src/stores/settingsStore.ts` - User preferences with localStorage persistence

**Store Features:**
- **Immer middleware** for immutable updates
- **Persist middleware** for localStorage persistence
- **Devtools middleware** for debugging
- **Type-safe** with TypeScript

### React Hooks Philosophy

**ALWAYS use usehooks-ts when available - NEVER implement custom hooks for common patterns:**

```tsx
// ✅ CORRECT - Use usehooks-ts
import { useLocalStorage, useInterval, useDebounceValue, useWindowSize, useMediaQuery } from 'usehooks-ts'

const [settings, setSettings] = useLocalStorage('game-settings', defaultSettings)
const { width } = useWindowSize()
const isMobile = useMediaQuery('(max-width: 768px)')
const [debouncedValue] = useDebounceValue(inputValue, 500)

// ❌ WRONG - Custom implementation
const [settings, setSettings] = useState(() => {
  const saved = localStorage.getItem('game-settings')
  return saved ? JSON.parse(saved) : defaultSettings
})
```

**Available usehooks-ts hooks:**
- `useLocalStorage` / `useSessionStorage` - Persistent storage
- `useInterval` / `useTimeout` - Timing hooks
- `useDebounceValue` / `useDebounceCallback` - Debouncing
- `useWindowSize` / `useMediaQuery` - Responsive design
- `useEventListener` - Event handling
- `useBoolean` / `useToggle` - Boolean state management

### Utility Functions Philosophy

**ALWAYS use es-toolkit when available - NEVER implement custom utility functions:**

```tsx
// ✅ CORRECT - Use es-toolkit
import { chunk, flatten, uniq, groupBy, debounce, throttle, cloneDeep } from 'es-toolkit'

const chunks = chunk(array, 3)
const unique = uniq(duplicates)
const cloned = cloneDeep(complexObject)

// ❌ WRONG - Custom implementation
const chunks = []
for (let i = 0; i < array.length; i += 3) {
  chunks.push(array.slice(i, i + 3))
}
```

**Available es-toolkit functions:**
- **Array**: `chunk`, `flatten`, `uniq`, `groupBy`, `partition`, `shuffle`
- **Object**: `cloneDeep`, `pick`, `omit`, `isEqual`, `merge`
- **Function**: `debounce`, `throttle`, `once`, `memoize`
- **Math**: `random`, `sample`, `mean`, `sum`

### Import Aliases

**ALWAYS use @app alias for imports - NEVER use relative paths:**

```jsx
// ✅ CORRECT - @app alias
import { useGameStore } from '@app/stores'
import { cloneDeep } from 'es-toolkit'
import SudokuApp from '@app/components/SudokuApp'

// ❌ WRONG - relative paths
import { useGameStore } from '../stores/gameStore'
import { cloneDeep } from '../../utils/objectUtils'
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

## SOLID Principles Implementation

**This codebase follows SOLID principles - CRITICAL for maintainability:**

### ✅ Single Responsibility Principle (SRP)
- Each store has ONE clear responsibility
- `gameStore` → Game state and logic only
- `uiStore` → UI state and selections only  
- `settingsStore` → User preferences only
- Components focus on rendering, stores handle state

### ✅ Open/Closed Principle (OCP)
- Use interfaces for extensibility
- Zustand stores are open for extension, closed for modification
- New game modes can be added without changing existing code

### ✅ Dependency Inversion Principle (DIP)
- Depend on abstractions (Zustand stores) not concrete implementations
- Use dependency injection via custom hooks
- Services implement interfaces, not direct dependencies

**Example SOLID-compliant code:**
```tsx
// ✅ CORRECT - SOLID principles
import { useGameStore, useUIStore } from '@app/stores'

const SudokuApp = () => {
  const { gameState, handleCellInput } = useGameStore()
  const { selectedCell, handleCellSelection } = useUIStore()
  
  // Component focuses on UI only, stores handle state
  return (
    <SudokuBoard 
      gameState={gameState}
      onCellClick={(row, col) => handleCellSelection(row, col, gameState?.board[row][col])}
    />
  )
}
```

## Architectural Guidelines

### State Management Rules
1. **Zustand for ALL complex state** - Never use useState for game/app state
2. **Immer middleware** for immutable updates - No manual spreading
3. **Persist middleware** for localStorage - Automatic persistence
4. **Devtools middleware** for debugging - Always enabled in development

### Utility Function Rules  
1. **es-toolkit FIRST** - Check if function exists before implementing
2. **usehooks-ts FIRST** - Check if hook exists before implementing
3. **NO custom implementations** for common patterns (arrays, objects, timing, storage)
4. **Type-safe utilities** - Always use TypeScript with proper typing

### Component Design Rules
1. **SOLID principles** - Single responsibility, dependency injection
2. **Tailwind ONLY** - NO inline styles ever (`style={}` forbidden)
3. **Motion animations** - For game-like feel and smooth transitions
4. **Responsive design** - Mobile-first with useMediaQuery/useWindowSize
5. **Accessibility** - Proper ARIA labels, keyboard navigation

### Performance Rules
1. **React Compiler** - Automatic optimization, avoid manual memo unless needed
2. **Build-first development** - Test with `pnpm build` not dev server
3. **Bundle size monitoring** - Keep additions minimal and justified
4. **Tree-shaking** - Import only what you need from libraries

### Code Quality Rules
1. **TypeScript strict mode** - No `any` types unless absolutely necessary
2. **ESLint + Prettier** - Auto-fix on save, never commit unformatted code
3. **@app alias imports** - Never use relative paths (`../../../`)
4. **Clean interfaces** - Well-defined contracts between components/services

### Git Workflow Rules
1. **NO AI attribution** in commit messages - Professional commits only
2. **Descriptive commits** - Explain WHY not just WHAT
3. **Test before commit** - `pnpm build` must pass
4. **Clean history** - No WIP commits in main branch

### Documentation Rules
1. **Update CLAUDE.md** when adding new patterns or rules
2. **Code comments** only when business logic is complex
3. **Interface documentation** - Clear parameter and return types
4. **README updates** - When major features are added

### Debugging Best Practices
1. **Systematic testing** - Test in multiple scenarios/devices
2. **Zustand devtools** - Use for state debugging
3. **Console logs** - Remove after debugging, use proper logging levels
4. **Error boundaries** - Proper error handling in React components

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
