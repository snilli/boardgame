import typescriptParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
	// Global ignores
	{
		ignores: [
			'dist/**', 
			'.next/**', 
			'out/**',
			'node_modules/**', 
			'.turbo/**',
			'**/*.min.js',
			'**/build/**',
			'**/coverage/**'
		],
	},

	// Basic config for source files only
	{
		files: ['src/**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			'no-unused-vars': 'off', // TypeScript handles this
			'no-console': 'warn',
		},
	},
]