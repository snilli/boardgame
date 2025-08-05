'use client'

import { motion } from 'motion/react'
import { useUIStore } from '@app/stores'
import { useKeyboardHandler } from '@app/hooks/useKeyboardHandler'
import { useGameTimer } from '@app/hooks/useGameTimer'
import { useGameActions } from '@app/hooks/useGameActions'
import { cn } from '@app/utils/cn'
import { SUDOKU_NUMBERS, FLOATING_NUMBERS } from '@app/constants/sudoku'
import {
	PencilIcon,
	ArrowUturnLeftIcon,
	PauseIcon,
	ArrowPathIcon,
	TrashIcon,
	PlayIcon,
	SparklesIcon,
	HomeIcon,
} from '@heroicons/react/24/outline'
import DifficultyScreen from './DifficultyScreen'
import GameStartScreen from './GameStartScreen'
import SudokuBoard from './SudokuBoard'

export default function SudokuApp() {
	// Clean separation: Actions handle business logic, UI handles presentation
	const {
		// Actions
		startGame,
		selectDifficulty,
		backToStart,
		newGame,
		pause,
		placeNumber,
		clearCell,
		toggleNotes,
		undo,
		// State
		actionState,
		gameState,
		gameMode,
		selectedCell,
	} = useGameActions()

	const { highlightedNumber, handleCellSelection } = useUIStore()

	// Timer hook for live updates - only when gameState exists
	const { formattedTime } = useGameTimer({
		startTime: gameState?.startTime || 0,
		endTime: gameState?.endTime,
		isPaused: gameState?.isPaused || false,
	})

	// Safe timer display - show proper value or fallback
	const displayTime = gameState ? formattedTime : '0:00'

	// Pure UI handlers - no business logic
	const handleCellClick = (row: number, col: number) => {
		if (!actionState.isGameActive) return
		const cellValue = gameState?.board[row][col] || 0
		handleCellSelection(row, col, cellValue)
	}

	// Keyboard handling
	useKeyboardHandler({
		onNumberInput: placeNumber,
		onClearCell: clearCell,
		onUndo: undo,
		onToggleNotes: toggleNotes,
		onPause: pause,
		enabled: gameMode === 'playing' || gameMode === 'paused',
	})

	// Render different screens based on game mode
	if (gameMode === 'start') {
		return <GameStartScreen onStartGame={startGame} />
	}

	if (gameMode === 'difficulty-select') {
		return <DifficultyScreen onSelectDifficulty={selectDifficulty} onBack={backToStart} />
	}

	if (!gameState) {
		return <div>Loading...</div>
	}

	return (
		<div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
			{/* Same Background Elements as Start Screen */}
			<div className="absolute inset-0">
				{/* Floating Numbers */}
				{FLOATING_NUMBERS.map((num, index) => (
					<motion.div
						key={num}
						className="absolute text-2xl font-bold text-white/5 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
						style={{
							left: `${5 + index * 11}%`,
							top: `${15 + (index % 4) * 25}%`,
						}}
						animate={{
							y: [-15, 15, -15],
							rotate: [-3, 3, -3],
							opacity: [0.05, 0.1, 0.05],
						}}
						transition={{
							duration: 6 + index * 0.3,
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
					className="absolute top-1/6 left-1/6 h-48 w-48 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className="absolute right-1/6 bottom-1/6 h-32 w-32 rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-3xl"
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.4, 0.2, 0.4],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			</div>

			{/* Navigation Bar - Fixed at top */}
			<div className="fixed top-0 right-0 left-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-lg">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-3 sm:px-4 sm:py-4 md:px-6">
					{/* Left: Game Title & Stats */}
					<div className="flex items-center gap-3 sm:gap-4 md:gap-6">
						<div className="flex items-center gap-2 sm:gap-3">
							<div className="text-lg font-black text-white sm:text-xl md:text-2xl">SUDOKU</div>
							<div className="h-4 w-px bg-white/20 sm:h-6"></div>
							<div className="text-sm font-bold text-blue-400 sm:text-base md:text-lg">
								{gameState.difficultyName}
							</div>
						</div>
						<div className="hidden items-center gap-1 sm:flex sm:gap-2">
							<div className="text-base font-bold text-white sm:text-lg md:text-xl">{displayTime}</div>
							<div className="text-xs text-white/60 sm:text-sm">TIME</div>
						</div>
					</div>

					{/* Right: Action Buttons */}
					<div className="flex gap-1 sm:gap-2">
						<motion.button
							onClick={toggleNotes}
							className={cn(
								'group relative overflow-hidden rounded border border-white/20 px-2 py-2 text-xs font-bold backdrop-blur-sm transition-all duration-200 sm:rounded-lg sm:px-3 sm:text-sm',
								gameState.noteMode
									? 'border-blue-400/50 bg-blue-500/80 text-white'
									: 'bg-white/10 text-white/90 hover:bg-white/20',
							)}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						</motion.button>
						<motion.button
							onClick={undo}
							className="group relative overflow-hidden rounded border border-white/20 bg-purple-500/80 px-2 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-purple-600/80 sm:rounded-lg sm:px-3 sm:text-sm"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<ArrowUturnLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						</motion.button>
						<motion.button
							onClick={pause}
							className="group relative overflow-hidden rounded border border-white/20 bg-amber-500/80 px-2 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-amber-600/80 sm:rounded-lg sm:px-3 sm:text-sm"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						</motion.button>
						<motion.button
							onClick={newGame}
							className="group relative overflow-hidden rounded border border-white/20 bg-red-500/80 px-2 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-red-600/80 sm:rounded-lg sm:px-3 sm:text-sm"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						</motion.button>
					</div>
				</div>
			</div>

			{/* Main Game Area - With top padding for nav */}
			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-2 pt-12 pb-24 sm:px-4 sm:pt-16 sm:pb-32 xl:pt-20 xl:pr-48 xl:pb-4">
				{/* Game Board - Large and Centered */}
				<div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
					<SudokuBoard
						gameState={gameState}
						onCellClick={handleCellClick}
						selectedCell={selectedCell}
						highlightedNumber={highlightedNumber}
					/>
				</div>
			</div>

			{/* Desktop Number Panel - Right Side */}
			<div className="fixed top-1/2 right-2 z-20 hidden -translate-y-1/2 xl:right-4 xl:block 2xl:right-8">
				<div className="rounded-2xl border border-white/20 bg-black/20 p-4 shadow-2xl backdrop-blur-lg xl:rounded-3xl xl:p-6 2xl:p-8">
					{/* Number Grid */}
					<div className="mb-3 grid grid-cols-3 gap-2 xl:mb-4 xl:gap-3 2xl:mb-6 2xl:gap-4">
						{SUDOKU_NUMBERS.map((num) => (
							<motion.button
								key={num}
								onClick={() => placeNumber(num)}
								className={cn(
									'group relative h-12 w-12 cursor-pointer overflow-hidden rounded-xl border-2 text-lg font-bold transition-all duration-200 xl:h-16 xl:w-16 xl:rounded-2xl xl:text-2xl 2xl:h-20 2xl:w-20 2xl:text-3xl',
									highlightedNumber === num
										? 'border-blue-400/60 bg-blue-500/90 text-white shadow-lg shadow-blue-500/40'
										: 'border-white/30 bg-white/15 text-white hover:border-white/50 hover:bg-white/25',
								)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<span className="relative z-10">{num}</span>
								{highlightedNumber === num && (
									<div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30" />
								)}
								<div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
							</motion.button>
						))}
					</div>

					{/* Clear Button */}
					<motion.button
						onClick={clearCell}
						className="group relative w-full cursor-pointer overflow-hidden rounded-xl border-2 border-red-400/50 bg-red-500/90 p-3 text-base font-bold text-white transition-all duration-200 hover:bg-red-600/90 xl:rounded-2xl xl:p-4 xl:text-lg 2xl:p-5 2xl:text-xl"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<span className="relative z-10 flex items-center gap-2">
							<TrashIcon className="h-4 w-4 xl:h-5 xl:w-5" />
							Clear
						</span>
						<div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-pink-600/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					</motion.button>
				</div>
			</div>

			{/* Mobile Number Panel - Bottom Fixed */}
			<div className="fixed right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-black/30 backdrop-blur-lg xl:hidden">
				<div className="mx-auto max-w-2xl p-2 sm:p-4">
					{/* Number Grid */}
					<div className="grid grid-cols-5 gap-2 sm:gap-3">
						{SUDOKU_NUMBERS.map((num) => (
							<motion.button
								key={num}
								onClick={() => placeNumber(num)}
								className={cn(
									'h-12 cursor-pointer rounded-lg border-2 text-base font-bold transition-all duration-200 sm:h-14 sm:rounded-xl sm:text-lg',
									highlightedNumber === num
										? 'border-blue-400/60 bg-blue-500/90 text-white shadow-md shadow-blue-500/30'
										: 'border-white/30 bg-white/15 text-white hover:bg-white/25',
								)}
								whileTap={{ scale: 0.95 }}
							>
								{num}
							</motion.button>
						))}
						{/* Clear Button */}
						<motion.button
							onClick={clearCell}
							className="h-12 cursor-pointer rounded-lg border-2 border-red-400/50 bg-red-500/90 text-base font-bold text-white hover:bg-red-600/90 sm:h-14 sm:rounded-xl sm:text-lg"
							whileTap={{ scale: 0.95 }}
						>
							<TrashIcon className="h-4 w-4" />
						</motion.button>
					</div>
				</div>
			</div>

			{/* Pause Modal */}
			{gameMode === 'paused' && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					<motion.div
						className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-lg"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
					>
						{/* Background Glow */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />

						<div className="relative z-10">
							<motion.h2
								className="mb-6 text-5xl font-black text-white drop-shadow-lg"
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
							>
								<div className="flex items-center gap-3">
									<PauseIcon className="h-6 w-6" />
									Game Paused
								</div>
							</motion.h2>
							<motion.button
								onClick={pause}
								className="group hover:shadow-3xl relative overflow-hidden rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-6 text-2xl font-black text-white shadow-2xl transition-all duration-300 hover:border-white/50 focus:ring-4 focus:ring-white/30 focus:outline-none"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.5 }}
							>
								{/* Background Animation */}
								<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<span className="relative z-10 flex items-center gap-3">
									<PlayIcon className="h-6 w-6" />
									<span>Resume Game</span>
								</span>

								{/* Shine Effect */}
								<div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
							</motion.button>
						</div>
					</motion.div>
				</motion.div>
			)}

			{/* Victory Modal */}
			{gameState.isCompleted && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					<motion.div
						className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-lg"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
					>
						{/* Background Glow */}
						<div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-xl" />

						<div className="relative z-10">
							<motion.h2
								className="mb-6 text-6xl font-black text-white drop-shadow-lg"
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
							>
								<div className="flex items-center gap-3">
									<SparklesIcon className="h-8 w-8" />
									Victory!
								</div>
							</motion.h2>
							<motion.p
								className="mb-8 text-2xl font-semibold text-white/90"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.5 }}
							>
								Time: {displayTime}
							</motion.p>
							<motion.div
								className="flex justify-center gap-6"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.6, duration: 0.5 }}
							>
								<motion.button
									onClick={newGame}
									className="group hover:shadow-3xl relative overflow-hidden rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-xl font-black text-white shadow-2xl transition-all duration-300 hover:border-white/50 focus:ring-4 focus:ring-white/30 focus:outline-none"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* Background Animation */}
									<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

									<span className="relative z-10 flex items-center gap-2">
										<ArrowPathIcon className="h-5 w-5" />
										<span>New Game</span>
									</span>

									{/* Shine Effect */}
									<div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
								</motion.button>
								<motion.button
									onClick={backToStart}
									className="group hover:shadow-3xl relative overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-xl font-black text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 focus:ring-4 focus:ring-white/30 focus:outline-none"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* Background Animation */}
									<div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

									<span className="relative z-10 flex items-center gap-2">
										<HomeIcon className="h-5 w-5" />
										<span>Menu</span>
									</span>

									{/* Shine Effect */}
									<div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
								</motion.button>
							</motion.div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	)
}
