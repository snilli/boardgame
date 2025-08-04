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
		icon: '🌟',
		emoji: '😊',
		description: 'Perfect for beginners',
		clues: '45-50 clues',
		gradient: 'from-emerald-400 to-green-500',
		hoverGradient: 'hover:from-emerald-500 hover:to-green-600',
		shadowColor: 'shadow-green-200',
		borderColor: 'border-green-300'
	},
	{
		name: 'Medium',
		key: 'medium',
		icon: '⚡',
		emoji: '🤔',
		description: 'Good challenge',
		clues: '35-40 clues',
		gradient: 'from-amber-400 to-orange-500', 
		hoverGradient: 'hover:from-amber-500 hover:to-orange-600',
		shadowColor: 'shadow-orange-200',
		borderColor: 'border-orange-300'
	},
	{
		name: 'Hard',
		key: 'hard',
		icon: '🔥',
		emoji: '😤',
		description: 'Expert level',
		clues: '25-30 clues',
		gradient: 'from-red-400 to-rose-500',
		hoverGradient: 'hover:from-red-500 hover:to-rose-600',
		shadowColor: 'shadow-red-200',
		borderColor: 'border-red-300'
	},
]

export default function DifficultyScreen({ onSelectDifficulty, onBack }: DifficultyScreenProps) {
	return (
		<div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
			<div className="w-full max-w-4xl text-center">
				{/* Title */}
				<motion.div
					className="mb-16"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<h1 className="mb-4 text-6xl font-black text-slate-800 md:text-7xl">
						Choose Your
					</h1>
					<h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
						Challenge
					</h2>
				</motion.div>

				{/* Difficulty Cards Grid */}
				<motion.div
					className="mb-16 grid gap-8 md:grid-cols-3"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					{difficulties.map((diff, index) => (
						<motion.div
							key={diff.key}
							className="group relative"
							initial={{ opacity: 0, y: 50, rotateY: -20 }}
							animate={{ opacity: 1, y: 0, rotateY: 0 }}
							transition={{ 
								delay: 0.5 + index * 0.2, 
								duration: 0.7,
								type: "spring",
								stiffness: 100
							}}
							whileHover={{ 
								scale: 1.05, 
								rotateY: 5,
								transition: { duration: 0.3 }
							}}
							whileTap={{ scale: 0.95 }}
						>
							<button
								onClick={() => onSelectDifficulty(diff.key)}
								className={cn(
									'relative w-full overflow-hidden rounded-3xl border-2 p-8 shadow-2xl transition-all duration-300',
									'bg-gradient-to-br text-white',
									diff.gradient,
									diff.hoverGradient,
									diff.shadowColor,
									diff.borderColor,
									'hover:shadow-3xl hover:border-white/50',
									'focus:outline-none focus:ring-4 focus:ring-white/50'
								)}
							>
								{/* Background Pattern */}
								<div className="absolute inset-0 opacity-10">
									<div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
								</div>

								{/* Content */}
								<div className="relative z-10">
									{/* Icon & Emoji */}
									<div className="mb-4 flex items-center justify-center gap-3">
										<span className="text-5xl drop-shadow-lg">{diff.icon}</span>
										<span className="text-4xl">{diff.emoji}</span>
									</div>

									{/* Name */}
									<h3 className="mb-3 text-3xl font-black tracking-wide drop-shadow-lg">
										{diff.name}
									</h3>

									{/* Description */}
									<p className="mb-2 text-lg font-semibold opacity-90">
										{diff.description}
									</p>

									{/* Clues Info */}
									<div className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
										<p className="text-sm font-bold text-white/90">
											{diff.clues}
										</p>
									</div>
								</div>

								{/* Hover Glow Effect */}
								<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							</button>
						</motion.div>
					))}
				</motion.div>

				{/* Back Button */}
				<motion.button
					onClick={onBack}
					className="group relative overflow-hidden rounded-2xl border-2 border-slate-300 bg-white/80 px-8 py-4 text-xl font-bold text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-slate-400 hover:bg-white/90 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-300/50"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.2, duration: 0.6 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<span className="relative z-10 flex items-center gap-2">
						<span>←</span>
						<span>Back to Menu</span>
					</span>
					
					{/* Hover effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-slate-200/0 via-slate-200/50 to-slate-200/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</motion.button>
			</div>
		</div>
	)
}