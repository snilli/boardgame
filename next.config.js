/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: true,
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
