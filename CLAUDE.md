# CLAUDE.md

This file tells Claude Code how to work with this codebase.

## Quick Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build and verify everything works
- `pnpm lint` - Fix code style and format

**Always run both `pnpm build` and `pnpm lint` after making changes.**

## Tech Stack

- **React 19** + **Next.js 15.4.5** with App Router
- **TypeScript** with SWC + React Compiler
- **Tailwind CSS v4** - ONLY Tailwind classes, NO `style={}`
- **Zustand** for state management
- **usehooks-ts** for common hooks
- **es-toolkit** for utility functions
- **Motion** for animations

## Core Principles

### Code Quality (CRITICAL)

- **SOLID Principles** - Single responsibility, dependency injection, clean interfaces
- **Design Patterns** - Use existing patterns in `src/patterns/` directory
- **Performance First** - React Compiler optimizations, minimal re-renders, efficient algorithms
- **Dead Code Elimination (MANDATORY)** - After every refactoring, immediately remove ALL dead code:
    - Unused files, functions, interfaces, imports
    - Empty implementations and placeholder comments
    - Deprecated patterns replaced by new architecture
    - Update exports in index files
    - **Test attributes and debug code** - Remove `data-testid`, debug logs, console statements
    - **Never keep code "just in case" - delete ruthlessly**

### Styling & Mobile-First Design (CRITICAL)

**NEVER use `style={}` inline styles** - Only Tailwind classes:

```jsx
// ❌ WRONG - inline styles
<div style={{ display: 'flex', justifyContent: 'center' }}>

// ✅ CORRECT - Tailwind classes
<div className="flex justify-center">
```

**ALWAYS use mobile-first approach with progressive enhancement:**

```jsx
// ✅ CORRECT - Mobile-first progressive enhancement
<div className="px-4 py-3 text-base sm:px-6 sm:py-4 sm:text-lg md:px-8 md:py-5 md:text-xl">

// ❌ WRONG - Desktop-first or missing intermediate steps
<div className="px-8 py-5 text-xl sm:px-4 sm:py-3 sm:text-base">
```

**Tailwind Breakpoint Strategy:**

- **Base (mobile)**: 0px - 639px - Design for smallest screens first
- **sm**: 640px+ - Small tablets and large phones
- **md**: 768px+ - Tablets and small laptops
- **lg**: 1024px+ - Laptops and desktop
- **xl**: 1280px+ - Large desktop screens
- **2xl**: 1536px+ - Extra large screens

**Mobile-First Design Rules:**

1. **Touch Targets**: Minimum 44px for interactive elements

    ```jsx
    // ✅ Mobile-first button sizing
    className = 'h-12 w-12 sm:h-10 sm:w-10 md:h-8 md:w-8'
    ```

2. **Typography Scaling**: Progressive from mobile up

    ```jsx
    // ✅ Systematic font scaling
    className = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
    ```

3. **Spacing Patterns**: Start small, scale up

    ```jsx
    // ✅ Progressive spacing
    className = 'p-2 sm:p-4 md:p-6 lg:p-8'
    className = 'gap-2 sm:gap-4 md:gap-6 lg:gap-8'
    ```

4. **Responsive Visibility**: Show/hide based on screen size
    ```jsx
    // ✅ Mobile-first visibility
    className = 'block md:hidden' // Mobile only
    className = 'hidden md:block' // Desktop only
    className = 'hidden sm:flex md:grid' // Progressive layout
    ```

**Use Responsive Design Hooks when needed:**

```jsx
import { useMediaQuery, useWindowSize } from 'usehooks-ts'

const isMobile = useMediaQuery('(max-width: 768px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')
const { width, height } = useWindowSize()
```

**Always test on mobile devices first** - If it works on mobile, it will work everywhere.

- Use `cn()` utility for conditional classes

### State Management

- **Use Zustand stores** for complex state, not `useState`
- Import: `import { useGameStore } from '@app/stores'`

### Imports

- **Use @app alias** - Never relative paths like `../../../`
- Example: `import SudokuApp from '@app/components/SudokuApp'`

### Libraries

- **Use usehooks-ts first** - `useInterval`, `useLocalStorage`, `useDebounce`
- **Use es-toolkit first** - `chunk`, `uniq`, `cloneDeep`

## Game UI Pattern

For game start screens, use this pattern:

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

## Project Structure

```
src/
├── app/           # Next.js pages
├── components/    # React components
├── stores/        # Zustand stores
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── domain/        # Business logic
```

## Development Workflow

1. Make changes
2. **Clean up immediately** - Remove any dead code, unused imports, empty functions
3. Run `pnpm build` - must pass
4. Run `pnpm lint` - fixes formatting
5. Commit with clean messages (no AI attribution)

**After refactoring checklist:**

- [ ] Removed all unused files
- [ ] Updated index.ts exports
- [ ] Deleted deprecated interfaces/types
- [ ] No empty functions or placeholder comments
- [ ] Removed test-ids, debug attributes, console logs
- [ ] Build passes without warnings

## Testing & Debugging

**Playwright Testing:**

- Playwright installed via Volta and ready to use
- When functionality seems broken: open new terminal → `pnpm dev` → write tests → fix code → **clean up all test files**

**Debug Tips:**

- Test in multiple scenarios, not just one case
- Keep debug logs until feature is confirmed working
- Use Zustand devtools for state debugging
- Sometimes the code works fine - check your testing method first

## Package Management

**Use pnpm** not npm.

**Remove unused packages immediately** - run `pnpm build` to test.

**Required packages (don't remove):**

- `eslint-plugin-react-hooks` - Required by Next.js ESLint config
- `babel-plugin-react-compiler` - Required by Next.js for React Compiler

## Configuration

- All `.js` config files need JSDoc: `/** @type {import('package').Type} */`
- Turbopack is stable in Next.js 15.4.5 (not experimental)
- @app alias works in both dev and production
