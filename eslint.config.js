/** @type {import('eslint').Linter.Config[]} */
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
	baseDirectory: process.cwd(),
})

export default [
	// Global ignores
	{
		ignores: ['dist/**', '.next/**', 'node_modules/**'],
	},

	// Next.js core-web-vitals only
	...compat.extends('next/core-web-vitals'),

	// Disable display-name rule to allow arrow functions in memo
	{
		rules: {
			'react/display-name': 'off',
		},
	},
]
