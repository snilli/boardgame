import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
	title: 'Sudoku Game',
	description: 'A beautiful Sudoku game built with Next.js, React 19, and React Compiler',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
