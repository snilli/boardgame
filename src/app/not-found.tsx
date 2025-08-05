import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-2 sm:p-4 md:p-8">
			<div className="mx-auto max-w-md space-y-4 text-center sm:space-y-6">
				<div className="text-6xl sm:text-8xl">404</div>
				<h1 className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">Page Not Found</h1>
				<p className="text-base text-gray-600 sm:text-lg">
					The page you&apos;re looking for doesn&apos;t exist.
				</p>

				<div className="flex flex-col justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
					<Link
						href="/"
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base"
					>
						🏠 Home
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
