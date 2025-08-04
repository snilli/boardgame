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
						className="absolute text-6xl font-bold text-white/8"
						style={{
							left: `${FLOATING_POSITIONS.LEFT_OFFSET + (index * FLOATING_POSITIONS.HORIZONTAL_SPACING)}%`,
							top: `${FLOATING_POSITIONS.TOP_OFFSET + (index % 2) * FLOATING_POSITIONS.VERTICAL_SPACING}%`,
							willChange: 'transform, opacity',
							transform: 'translate3d(0, 0, 0)',
						}}
						animate={{
							y: [-12, 12, -12],
							opacity: [0.08, 0.15, 0.08]
						}}
						transition={{
							duration: 8 + index * 1.5,
							repeat: Infinity,
							ease: "easeInOut",
							type: "tween"
						}}
					>
						{num}
					</motion.div>
				))}

				{/* Static Grid Pattern */}
				<div className="absolute inset-0 opacity-8">
					<div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
				</div>

				{/* GPU-Accelerated Glowing Orbs */}
				<motion.div
					className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
					style={{
						willChange: 'transform, opacity',
						transform: 'translate3d(0, 0, 0)',
					}}
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.35, 0.2]
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "easeInOut",
						type: "tween"
					}}
				/>
				<motion.div
					className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-3xl"
					style={{
						willChange: 'transform, opacity',
						transform: 'translate3d(0, 0, 0)',
					}}
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.35, 0.2, 0.35]
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
						type: "tween"
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="relative z-10 flex min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-4xl text-center">
					{/* Title Section - Optimized animations */}
					<motion.div
						className="mb-16"
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ 
							duration: 0.6, 
							ease: "easeOut",
							type: "tween"
						}}
					>
						<motion.h1
							className="mb-4 text-6xl font-black tracking-wider text-white drop-shadow-2xl md:text-7xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ 
								delay: 0.2, 
								duration: 0.5,
								type: "tween"
							}}
						>
							Choose Your
						</motion.h1>
						<motion.h2
							className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent drop-shadow-lg md:text-6xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ 
								delay: 0.4, 
								duration: 0.5,
								type: "tween"
							}}
						>
							Challenge
						</motion.h2>
					</motion.div>

					{/* Difficulty Cards Grid - Performance optimized */}
					<motion.div
						className="mb-16 grid gap-8 md:grid-cols-3"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ 
							delay: 0.6, 
							duration: 0.5,
							type: "tween"
						}}
					>
						{difficulties.map((diff, index) => (
							<motion.div
								key={diff.key}
								className="group relative"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ 
									delay: 0.8 + index * 0.1, 
									duration: 0.3,
									type: "tween"
								}}
								whileHover={{ 
									scale: 1.03,
									transition: { 
										duration: 0.15,
										type: "tween"
									}
								}}
								whileTap={{ 
									scale: 0.97,
									transition: { 
										duration: 0.1,
										type: "tween"
									}
								}}
								style={{
									willChange: 'transform',
									transform: 'translate3d(0, 0, 0)'
								}}
							>
								<button
									onClick={() => onSelectDifficulty(diff.key)}
									className={cn(
										'group relative w-full overflow-hidden rounded-3xl border-2 border-white/20 p-8 text-white shadow-2xl transition-all duration-200',
										'bg-gradient-to-br backdrop-blur-sm',
										diff.gradient,
										'hover:border-white/30 hover:shadow-3xl',
										'focus:outline-none focus:ring-4 focus:ring-white/30'
									)}
								>
									{/* Background Pattern */}
									<div className="absolute inset-0 opacity-8">
										<div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:25px_25px]" />
									</div>

									{/* Content */}
									<div className="relative z-10">
										{/* Icon & Emoji */}
										<div className="mb-6 flex items-center justify-center gap-3">
											<span className="text-6xl drop-shadow-lg">{diff.icon}</span>
											<span className="text-5xl">{diff.emoji}</span>
										</div>

										{/* Name */}
										<h3 className="mb-4 text-4xl font-black tracking-wide drop-shadow-lg">
											{diff.name}
										</h3>

										{/* Description */}
										<p className="mb-4 text-xl font-semibold text-white/90">
											{diff.description}
										</p>

										{/* Clues Info */}
										<div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
											<p className="text-lg font-bold text-white/90">
												{diff.clues}
											</p>
										</div>
									</div>

									{/* Optimized Hover Effect */}
									<div 
										className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
										style={{
											willChange: 'opacity',
											transform: 'translate3d(0, 0, 0)'
										}}
									/>
								</button>
							</motion.div>
						))}
					</motion.div>

					{/* Back Button - GPU optimized */}
					<motion.button
						onClick={onBack}
						className="group relative overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 px-12 py-4 text-xl font-bold text-white shadow-2xl backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/15 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/30"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ 
							delay: 1.2, 
							duration: 0.4,
							type: "tween"
						}}
						whileHover={{ 
							scale: 1.02,
							transition: { 
								duration: 0.15,
								type: "tween"
							}
						}}
						whileTap={{ 
							scale: 0.98,
							transition: { 
								duration: 0.1,
								type: "tween"
							}
						}}
						style={{
							willChange: 'transform',
							transform: 'translate3d(0, 0, 0)'
						}}
					>
						<span className="relative z-10 flex items-center gap-3">
							<span className="text-2xl">←</span>
							<span>Back to Menu</span>
						</span>
						
						{/* Optimized Hover Effect */}
						<div 
							className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							style={{
								willChange: 'opacity',
								transform: 'translate3d(0, 0, 0)'
							}}
						/>
					</motion.button>
				</div>
			</div>
		</div>
	)
}