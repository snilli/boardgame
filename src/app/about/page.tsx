import Link from 'next/link'

export default function AboutPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
			<div className="mx-auto max-w-2xl space-y-6 text-center">
				<h1 className="text-5xl font-bold text-gray-800">About Sudoku Game</h1>

				<div className="space-y-4 rounded-lg bg-white p-8 shadow-lg">
					<p className="text-lg text-gray-700">A modern Sudoku game built with cutting-edge technologies:</p>

					<div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
						<div className="space-y-2">
							<h3 className="font-semibold text-blue-600">🚀 Framework</h3>
							<ul className="space-y-1 text-sm text-gray-600">
								<li>• Next.js 15.4+</li>
								<li>• React 19</li>
								<li>• TypeScript 5.8</li>
								<li>• React Compiler</li>
							</ul>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-green-600">🎨 Styling</h3>
							<ul className="space-y-1 text-sm text-gray-600">
								<li>• Tailwind CSS v4</li>
								<li>• VIS-X for graphics</li>
								<li>• Responsive design</li>
								<li>• Modern animations</li>
							</ul>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-purple-600">⚡ Performance</h3>
							<ul className="space-y-1 text-sm text-gray-600">
								<li>• SWC compiler</li>
								<li>• React Compiler</li>
								<li>• Automatic optimization</li>
								<li>• Fast builds</li>
							</ul>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-orange-600">🎮 Features</h3>
							<ul className="space-y-1 text-sm text-gray-600">
								<li>• Multiple difficulties</li>
								<li>• Timer & progress</li>
								<li>• Note-taking mode</li>
								<li>• Keyboard controls</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="flex justify-center space-x-4">
					<Link
						href="/"
						className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
					>
						🏠 Back to Game
					</Link>
					<Link
						href="/sudoku"
						className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
					>
						🎯 Play Sudoku
					</Link>
				</div>
			</div>
		</div>
	)
}
