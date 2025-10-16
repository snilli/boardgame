# @repo/prettier-config

Shared Prettier configuration for monorepo projects with Tailwind CSS support.

## Installation

```bash
npm install @repo/prettier-config
```

### Required peer dependencies:

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

## Usage

Add to your `package.json`:

```json
{
  "prettier": "@repo/prettier-config"
}
```

Or create a `prettier.config.js`:

```js
export { default } from '@repo/prettier-config'
```

## Configuration

This config includes:

- **Tailwind CSS class sorting** via `prettier-plugin-tailwindcss`
- **Custom function support** for `cn()` utility
- **Consistent formatting** across all projects

### Settings:

- No semicolons
- Single quotes
- Tab width: 4 spaces (with tabs)
- Trailing commas
- Print width: 120 characters

## Features

- ✅ **Publishable** - Works as standalone package
- ✅ **Peer dependencies** - Users control versions
- ✅ **Tailwind support** - Automatic class sorting
- ✅ **TypeScript support** - Full type definitions