/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: true,
	},

	// Disable linting during build to avoid monorepo ESLint issues
	eslint: {
		ignoreDuringBuilds: true,
	},

	// GitHub Pages configuration
	output: 'export',
	trailingSlash: true,
	// basePath: '/boardgame',
	// assetPrefix: '/boardgame',
	images: {
		unoptimized: true,
	},

	turbopack: {
		resolveAlias: {
			'@app': './src',
		},
	},

	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@app': './src',
		}
		return config
	},
}

export default nextConfig
