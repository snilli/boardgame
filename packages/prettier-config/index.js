/** @type {import('prettier').Config} */
const config = {
	semi: false,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'all',
	bracketSpacing: true,
	arrowParens: 'always',
	endOfLine: 'auto',
	useTabs: true,
	printWidth: 120,
	plugins: ['prettier-plugin-tailwindcss'],
	tailwindFunctions: ['cn'],
}

export default config