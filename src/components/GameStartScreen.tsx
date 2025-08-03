import { motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '@app/utils/cn'

interface GameStartScreenProps {
	onStartGame: () => void
}

export default function GameStartScreen({ onStartGame }: GameStartScreenProps) {
	const [isAnimating, setIsAnimating] = useState(false)

	const handleStartClick = () => {
		setIsAnimating(true)
		setTimeout(() => {
			onStartGame()
		}, 300)
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 text-red-500">
			<div className="text-center">
				{/* Simple Game Title */}
				<motion.h1
					className="mb-12 text-6xl font-bold text-slate-800"
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					Sudoku
				</motion.h1>

				{/* Play Button */}
				<motion.button
					onClick={handleStartClick}
					disabled={isAnimating}
					className={cn(
						'cursor-pointer rounded-2xl border-none px-20 py-6 text-2xl font-bold shadow-2xl transition-colors',
						isAnimating ? 'bg-blue-400 text-blue-100' : 'bg-blue-600 text-white hover:bg-blue-700',
					)}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					{isAnimating ? 'Starting...' : 'Play'}
				</motion.button>
			</div>
		</div>
	)
}
