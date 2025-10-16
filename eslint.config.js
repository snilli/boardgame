/** @type {import('eslint').Linter.Config} */
export default [
	{
		files: ['**/*.js', '**/*.ts', '**/*.tsx'],
		plugins: {
			turbo: (await import('eslint-plugin-turbo')).default,
		},
		rules: {
			'turbo/no-undeclared-env-vars': 'error',
		},
		settings: {
			turbo: {
				config: './turbo.json',
			},
		},
	},
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'**/build/**',
			'**/.next/**',
			'**/.turbo/**',
			'**/out/**',
		],
	},
]