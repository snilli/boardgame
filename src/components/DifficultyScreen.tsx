import { cn } from '@app/utils/cn'
import { motion } from 'motion/react'

interface DifficultyScreenProps {
	onSelectDifficulty: (difficulty: string) => void
	onBack: () => void
}

const difficulties = [
	{
		name: 'Easy',
		key: 'easy',
		icon: '🟢',
		color: 'bg-green-500 hover:bg-green-600',
	},
	{
		name: 'Medium',
		key: 'medium',
		icon: '🟡',
		color: 'bg-yellow-500 hover:bg-yellow-600',
	},
	{
		name: 'Hard',
		key: 'hard',
		icon: '🔴',
		color: 'bg-red-500 hover:bg-red-600',
	},
]

export default function DifficultyScreen({ onSelectDifficulty, onBack }: DifficultyScreenProps) {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100">
			<div className="text-center">
				{/* Title */}
				<motion.h1
					className="mb-12 text-5xl font-bold text-slate-800"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					Choose Difficulty
				</motion.h1>

				{/* Difficulty Buttons */}
				<motion.div
					className="mb-12 flex flex-col gap-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.6 }}
				>
					{difficulties.map((diff, index) => (
						<motion.button
							key={diff.key}
							onClick={() => onSelectDifficulty(diff.key)}
							className={cn(
								'flex cursor-pointer items-center justify-center gap-4 rounded-2xl border-none px-16 py-6 text-2xl font-bold text-white shadow-2xl',
								diff.key === 'easy' && 'bg-green-500 hover:bg-green-600',
								diff.key === 'medium' && 'bg-yellow-500 hover:bg-yellow-600',
								diff.key === 'hard' && 'bg-red-500 hover:bg-red-600',
							)}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="text-3xl">{diff.icon}</span>
							<span>{diff.name}</span>
						</motion.button>
					))}
				</motion.div>

				{/* Back Button */}
				<motion.button
					onClick={onBack}
					className="cursor-pointer rounded-xl border-none bg-slate-200 px-12 py-4 text-xl font-bold text-gray-700 transition-colors hover:bg-slate-300"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.6 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Back
				</motion.button>
			</div>
		</div>
	)
}
