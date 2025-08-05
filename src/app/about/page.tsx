import Link from 'next/link'

export default function AboutPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 md:p-8">
			<div className="mx-auto max-w-2xl space-y-4 text-center sm:space-y-6">
				<h1 className="text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl">About Sudoku Game</h1>

				<div className="space-y-3 rounded-lg bg-white p-4 shadow-lg sm:space-y-4 sm:p-6 md:p-8">
					<p className="text-base text-gray-700 sm:text-lg">
						A modern Sudoku game built with cutting-edge technologies:
					</p>

					<div className="grid grid-cols-1 gap-3 text-left sm:gap-4 md:grid-cols-2">
						<div className="space-y-1 sm:space-y-2">
							<h3 className="text-sm font-semibold text-blue-600 sm:text-base">🚀 Framework</h3>
							<ul className="space-y-1 text-xs text-gray-600 sm:text-sm">
								<li>• Next.js 15.4+</li>
								<li>• React 19</li>
								<li>• TypeScript 5.8</li>
								<li>• React Compiler</li>
							</ul>
						</div>

						<div className="space-y-1 sm:space-y-2">
							<h3 className="text-sm font-semibold text-green-600 sm:text-base">🎨 Styling</h3>
							<ul className="space-y-1 text-xs text-gray-600 sm:text-sm">
								<li>• Tailwind CSS v4</li>
								<li>• VIS-X for graphics</li>
								<li>• Responsive design</li>
								<li>• Modern animations</li>
							</ul>
						</div>

						<div className="space-y-1 sm:space-y-2">
							<h3 className="text-sm font-semibold text-purple-600 sm:text-base">⚡ Performance</h3>
							<ul className="space-y-1 text-xs text-gray-600 sm:text-sm">
								<li>• SWC compiler</li>
								<li>• React Compiler</li>
								<li>• Automatic optimization</li>
								<li>• Fast builds</li>
							</ul>
						</div>

						<div className="space-y-1 sm:space-y-2">
							<h3 className="text-sm font-semibold text-orange-600 sm:text-base">🎮 Features</h3>
							<ul className="space-y-1 text-xs text-gray-600 sm:text-sm">
								<li>• Multiple difficulties</li>
								<li>• Timer & progress</li>
								<li>• Note-taking mode</li>
								<li>• Keyboard controls</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
					<Link
						href="/"
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base"
					>
						🏠 Back to Game
					</Link>
					<Link
						href="/sudoku"
						className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 sm:px-6 sm:py-3 sm:text-base"
					>
						🎯 Play Sudoku
					</Link>
				</div>
			</div>
		</div>
	)
}
