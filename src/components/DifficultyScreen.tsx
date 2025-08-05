import { cn } from '@app/utils/cn'
import { motion } from 'motion/react'
import { FLOATING_NUMBERS, FLOATING_POSITIONS } from '@app/constants/sudoku'

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
	},
	{
		name: 'Medium',
		key: 'medium',
		icon: '⚡',
		emoji: '🤔',
		description: 'Good challenge',
		clues: '35-40 clues',
		gradient: 'from-amber-400 to-orange-500',
	},
	{
		name: 'Hard',
		key: 'hard',
		icon: '🔥',
		emoji: '😤',
		description: 'Expert level',
		clues: '25-30 clues',
		gradient: 'from-red-400 to-rose-500',
	},
]

export default function DifficultyScreen({ onSelectDifficulty, onBack }: DifficultyScreenProps) {
	return (
		<div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
			{/* GPU-Accelerated Background Elements */}
			<div className="absolute inset-0">
				{/* Optimized Floating Numbers - GPU accelerated */}
				{FLOATING_NUMBERS.map((num, index) => (
					<motion.div
						key={num}
						className="absolute text-6xl font-bold text-white/8 will-change-[transform,opacity] transform-gpu"
						style={{
							left: `${FLOATING_POSITIONS.LEFT_OFFSET + index * FLOATING_POSITIONS.HORIZONTAL_SPACING}%`,
							top: `${FLOATING_POSITIONS.TOP_OFFSET + (index % 2) * FLOATING_POSITIONS.VERTICAL_SPACING}%`,
						}}
						animate={{
							y: [-12, 12, -12],
							opacity: [0.08, 0.15, 0.08],
						}}
						transition={{
							duration: 8 + index * 1.5,
							repeat: Infinity,
							ease: 'easeInOut',
							type: 'tween',
						}}
					>
						{num}
					</motion.div>
				))}

				{/* Static Grid Pattern */}
				<div className="absolute inset-0 opacity-20">
					<div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
				</div>

				{/* GPU-Accelerated Glowing Orbs */}
				<motion.div
					className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl will-change-[transform,opacity] transform-gpu"
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.35, 0.2],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: 'easeInOut',
						type: 'tween',
					}}
				/>
				<motion.div
					className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-3xl will-change-[transform,opacity] transform-gpu"
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.35, 0.2, 0.35],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
						type: 'tween',
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="relative z-10 flex min-h-screen items-center justify-center p-2 landscape:items-center landscape:py-4 sm:p-4">
				<div className="w-full max-w-4xl text-center landscape:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
					{/* Title Section - LG as scaled MD */}
					<motion.div
						className="mb-8 landscape:mb-4 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16"
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: 'easeOut',
							type: 'tween',
						}}
					>
						<motion.h1
							className="mb-2 text-4xl font-black tracking-wider text-white drop-shadow-2xl sm:mb-2 sm:text-5xl md:mb-3 md:text-6xl lg:mb-4 lg:text-7xl xl:text-8xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.2,
								duration: 0.5,
								type: 'tween',
							}}
						>
							Choose Your
						</motion.h1>
						<motion.h2
							className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.4,
								duration: 0.5,
								type: 'tween',
							}}
						>
							Challenge
						</motion.h2>
					</motion.div>

					{/* Difficulty Cards Grid - Improved Responsive */}
					<motion.div
						className="mb-6 grid gap-4 px-4 landscape:mb-4 landscape:grid-cols-3 landscape:gap-3 landscape:px-8 sm:mb-8 sm:grid-cols-3 sm:gap-4 sm:px-6 md:mb-10 md:grid-cols-3 md:gap-6 md:px-0 lg:mb-12 lg:grid-cols-3 lg:gap-8 lg:px-4 xl:gap-12 xl:px-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: 0.6,
							duration: 0.5,
							type: 'tween',
						}}
					>
						{difficulties.map((diff, index) => (
							<motion.div
								key={diff.key}
								className="group relative will-change-[transform,opacity] transform-gpu"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: 0.8 + index * 0.1,
									duration: 0.3,
									type: 'tween',
								}}
								whileHover={{
									scale: 1.03,
									transition: {
										duration: 0.15,
										type: 'tween',
									},
								}}
								whileTap={{
									scale: 0.97,
									transition: {
										duration: 0.1,
										type: 'tween',
									},
								}}
							>
								<button
									onClick={() => onSelectDifficulty(diff.key)}
									className={cn(
										'group relative w-full overflow-hidden rounded-xl border-2 border-white/20 p-4 text-white shadow-2xl transition-all duration-200 sm:rounded-xl sm:p-4 md:rounded-2xl md:p-6 lg:rounded-3xl lg:p-8',
										'bg-gradient-to-br backdrop-blur-sm',
										diff.gradient,
										'hover:shadow-3xl hover:border-white/30',
										'focus:ring-4 focus:ring-white/30 focus:outline-none',
									)}
								>
									{/* Background Pattern */}
									<div className="absolute inset-0 opacity-8">
										<div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:25px_25px]" />
									</div>

									{/* Content */}
									<div className="relative z-10">
										{/* Icon & Emoji */}
										<div className="mb-3 flex items-center justify-center gap-2 sm:mb-3 sm:gap-2 md:mb-4 md:gap-2 lg:mb-4 lg:gap-3">
											<span className="text-3xl drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">{diff.icon}</span>
											<span className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl">{diff.emoji}</span>
										</div>

										{/* Name */}
										<h3 className="mb-2 text-xl font-black tracking-wide drop-shadow-lg sm:mb-2 sm:text-xl md:mb-2 md:text-2xl lg:mb-3 lg:text-3xl">
											{diff.name}
										</h3>

										{/* Description */}
										<p className="mb-2 text-sm font-semibold text-white/90 sm:mb-2 sm:text-sm md:mb-2 md:text-base lg:mb-3 lg:text-lg">
											{diff.description}
										</p>

										{/* Clues Info */}
										<div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm sm:px-3 sm:py-1 md:px-3 md:py-1 lg:px-4 lg:py-2">
											<p className="text-sm font-bold text-white/90 sm:text-sm md:text-sm lg:text-base">{diff.clues}</p>
										</div>
									</div>

									{/* Optimized Hover Effect */}
									<div
										className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 will-change-[transform,opacity] transform-gpu"
									/>
								</button>
							</motion.div>
						))}
					</motion.div>

					{/* Back Button - Related Scale */}
					<motion.button
						onClick={onBack}
						className="group hover:shadow-3xl relative overflow-hidden rounded-xl border-2 border-white/30 bg-white/10 px-12 py-4 text-xl font-bold text-white shadow-2xl backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/15 focus:ring-4 focus:ring-white/30 focus:outline-none sm:rounded-xl sm:px-10 sm:py-3 sm:text-lg md:rounded-2xl md:px-14 md:py-4 md:text-xl lg:rounded-3xl lg:px-18 lg:py-6 lg:text-2xl will-change-[transform,opacity] transform-gpu"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: 1.2,
							duration: 0.4,
							type: 'tween',
						}}
						whileHover={{
							scale: 1.02,
							transition: {
								duration: 0.15,
								type: 'tween',
							},
						}}
						whileTap={{
							scale: 0.98,
							transition: {
								duration: 0.1,
								type: 'tween',
							},
						}}
					>
						<span className="relative z-10 flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-4">
							<span className="text-2xl sm:text-xl md:text-2xl lg:text-3xl">←</span>
							<span>Back to Menu</span>
						</span>

						{/* Optimized Hover Effect */}
						<div
							className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 will-change-[transform,opacity] transform-gpu"
						/>
					</motion.button>
				</div>
			</div>
		</div>
	)
}
