import { motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '@app/utils/cn'
import { SUDOKU_NUMBERS } from '@app/constants/sudoku'
import { PlayIcon, LightBulbIcon, TrophyIcon, DevicePhoneMobileIcon, CpuChipIcon } from '@heroicons/react/24/outline'

interface GameStartScreenProps {
	onStartGame: () => void
}

export default function GameStartScreen({ onStartGame }: GameStartScreenProps) {
	const [isAnimating, setIsAnimating] = useState(false)

	const handleStartClick = () => {
		setIsAnimating(true)
		setTimeout(() => {
			onStartGame()
		}, 400)
	}

	return (
		<div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
			{/* Animated Background Elements */}
			<div className="absolute inset-0">
				{/* Floating Numbers */}
				{SUDOKU_NUMBERS.map((num, index) => (
					<motion.div
						key={num}
						className="absolute text-3xl font-bold text-white/10 sm:text-4xl md:text-5xl lg:text-6xl"
						style={{
							left: `${10 + index * 10}%`,
							top: `${20 + (index % 3) * 30}%`,
						}}
						animate={{
							y: [-20, 20, -20],
							rotate: [-5, 5, -5],
							opacity: [0.1, 0.2, 0.1],
						}}
						transition={{
							duration: 4 + index * 0.5,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					>
						{num}
					</motion.div>
				))}

				{/* Grid Pattern */}
				<div className="absolute inset-0 opacity-20">
					<div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
				</div>

				{/* Glowing Orbs */}
				<motion.div
					className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-pink-400/30 to-orange-400/30 blur-3xl"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.6, 0.3, 0.6],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			</div>

			{/* Main Content */}
			<div className="relative z-10 flex min-h-screen items-center justify-center p-2 sm:p-4 md:p-6">
				<div className="text-center">
					{/* Logo/Title Section */}
					<motion.div
						className="mb-8 sm:mb-12 md:mb-16"
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, ease: 'easeOut' }}
					>
						{/* Sudoku Grid Icon */}
						<motion.div
							className="mb-4 flex justify-center sm:mb-6 md:mb-8"
							initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
							animate={{ opacity: 1, scale: 1, rotateY: 0 }}
							transition={{ delay: 0.3, duration: 1, type: 'spring', stiffness: 100 }}
						>
							<div className="relative">
								{/* Main Grid */}
								<div className="grid grid-cols-3 gap-1 rounded-xl border-2 border-white/30 bg-white/10 p-2 backdrop-blur-sm sm:gap-2 sm:rounded-2xl sm:border-4 sm:p-4">
									{Array.from({ length: 9 }).map((_, i) => (
										<div
											key={i}
											className="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm"
										>
											{SUDOKU_NUMBERS[i]}
										</div>
									))}
								</div>

								{/* Glow Effect */}
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl" />
							</div>
						</motion.div>

						{/* Game Title */}
						<motion.h1
							className="mb-2 text-4xl font-black tracking-wider text-white drop-shadow-2xl sm:mb-3 sm:text-5xl md:mb-4 md:text-6xl lg:text-7xl xl:text-8xl"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.8 }}
						>
							SUDOKU
						</motion.h1>

						{/* Subtitle */}
						<motion.p
							className="text-base font-medium text-white/80 sm:text-lg md:text-xl lg:text-2xl"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.9, duration: 0.8 }}
						>
							The Ultimate Number Puzzle
						</motion.p>
					</motion.div>

					{/* Action Section */}
					<motion.div
						className="space-y-4 sm:space-y-6"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.2, duration: 0.8 }}
					>
						{/* Main Play Button */}
						<motion.button
							onClick={handleStartClick}
							disabled={isAnimating}
							className={cn(
								'group relative overflow-hidden rounded-xl border-2 px-8 py-4 text-lg font-black transition-all duration-300 sm:rounded-2xl sm:px-12 sm:py-5 sm:text-xl md:px-16 md:py-6 md:text-2xl',
								'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl',
								'border-white/30 hover:border-white/50',
								'hover:shadow-3xl hover:shadow-blue-500/30',
								'focus:ring-4 focus:ring-white/30 focus:outline-none',
								'disabled:cursor-not-allowed disabled:opacity-50',
								!isAnimating && 'hover:scale-105 active:scale-95',
							)}
							whileHover={{ scale: isAnimating ? 1 : 1.05 }}
							whileTap={{ scale: isAnimating ? 1 : 0.95 }}
						>
							{/* Background Animation */}
							<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

							{/* Button Content */}
							<span className="relative z-10 flex items-center gap-3">
								{isAnimating ? (
									<>
										<motion.div
											className="h-6 w-6 rounded-full border-2 border-white border-t-transparent"
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
										/>
										<span>Starting Game...</span>
									</>
								) : (
									<>
										<PlayIcon className="h-6 w-6 sm:h-7 sm:w-7" />
										<span>Start Playing</span>
									</>
								)}
							</span>

							{/* Shine Effect */}
							<div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
						</motion.button>

						{/* Feature Pills */}
						<motion.div
							className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.5, duration: 0.8 }}
						>
							{[
								{ Icon: CpuChipIcon, text: 'Train Your Brain' },
								{ Icon: TrophyIcon, text: 'Multiple Levels' },
								{ Icon: LightBulbIcon, text: 'Smart Hints' },
								{ Icon: DevicePhoneMobileIcon, text: 'Mobile Friendly' },
							].map((feature, index) => (
								<motion.div
									key={feature.text}
									className="rounded-full border border-white/20 bg-white/10 px-2 py-1 backdrop-blur-sm sm:px-3 sm:py-2 md:px-4"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
									whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
								>
									<span className="flex items-center gap-1 text-xs font-medium text-white/90 sm:gap-2 sm:text-sm">
										<feature.Icon className="h-4 w-4" />
										<span>{feature.text}</span>
									</span>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
