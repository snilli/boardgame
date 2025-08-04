'use client'

import { useCallback } from 'react'
import { motion } from 'motion/react'
import { useGameStore, useUIStore } from '@app/stores'
import { useKeyboardHandler } from '@app/hooks/useKeyboardHandler'
import { cn } from '@app/utils/cn'
import { SUDOKU_NUMBERS, FLOATING_NUMBERS } from '@app/constants/sudoku'
import DifficultyScreen from './DifficultyScreen'
import GameStartScreen from './GameStartScreen'
import SudokuBoard from './SudokuBoard'

export default function SudokuApp() {
	// Zustand stores - much cleaner!
	const {
		gameState,
		gameMode,
		createNewGame,
		setGameMode,
		handleCellInput,
		handleClearCell,
		toggleNoteMode,
		pauseGame,
		resumeGame,
		undoMove,
		resetGame,
	} = useGameStore()

	const { selectedCell, highlightedNumber, handleCellSelection, clearSelection } = useUIStore()

	// Game Flow Handlers - Clean and focused
	const handleStartGame = useCallback(() => {
		setGameMode('difficulty-select')
	}, [setGameMode])

	const handleSelectDifficulty = useCallback(
		(difficulty: string) => {
			createNewGame(difficulty)
			setGameMode('playing')
			clearSelection()
		},
		[createNewGame, setGameMode, clearSelection],
	)

	const handleBackToStart = useCallback(() => {
		resetGame()
		clearSelection()
	}, [resetGame, clearSelection])

	const handleNewGame = useCallback(() => {
		setGameMode('difficulty-select')
		clearSelection()
	}, [setGameMode, clearSelection])

	const handlePause = useCallback(() => {
		if (!gameState) return
		if (gameState.isPaused) {
			resumeGame()
			setGameMode('playing')
		} else {
			pauseGame()
			setGameMode('paused')
		}
	}, [gameState, pauseGame, resumeGame, setGameMode])

	// Game Logic Handlers - Simplified with service layer
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (!gameState || gameState.isPaused || gameState.isCompleted) return

			const cellValue = gameState.board[row][col]
			handleCellSelection(row, col, cellValue)
		},
		[gameState, handleCellSelection],
	)

	const handleNumberInput = useCallback(
		(value: number) => {
			if (!gameState || !selectedCell || gameState.isPaused || gameState.isCompleted) {
				return
			}

			const { row, col } = selectedCell
			handleCellInput(row, col, value)
		},
		[gameState, selectedCell, handleCellInput],
	)

	const handleClearCellClick = useCallback(() => {
		if (!gameState || !selectedCell || gameState.isPaused || gameState.isCompleted) return

		const { row, col } = selectedCell
		handleClearCell(row, col)
	}, [gameState, selectedCell, handleClearCell])

	const handleToggleNoteMode = useCallback(() => {
		if (!gameState) return
		toggleNoteMode()
	}, [gameState, toggleNoteMode])

	// Keyboard handling via service
	useKeyboardHandler({
		onNumberInput: handleNumberInput,
		onClearCell: handleClearCellClick,
		onUndo: undoMove,
		onToggleNotes: handleToggleNoteMode,
		onPause: handlePause,
		enabled: gameMode === 'playing' || gameMode === 'paused',
	})

	// Render different screens based on game mode
	if (gameMode === 'start') {
		return <GameStartScreen onStartGame={handleStartGame} />
	}

	if (gameMode === 'difficulty-select') {
		return <DifficultyScreen onSelectDifficulty={handleSelectDifficulty} onBack={handleBackToStart} />
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
						className="absolute text-4xl font-bold text-white/5 md:text-6xl"
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
				<div className="absolute inset-0 opacity-10">
					<div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
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
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
					{/* Left: Game Title & Stats */}
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-3">
							<div className="text-2xl font-black text-white">SUDOKU</div>
							<div className="h-6 w-px bg-white/20"></div>
							<div className="text-lg font-bold text-blue-400">{gameState.difficultyName}</div>
						</div>
						<div className="hidden items-center gap-2 sm:flex">
							<div className="text-xl font-bold text-white">
								{Math.floor((Date.now() - gameState.startTime) / 1000 / 60)}:
								{(Math.floor((Date.now() - gameState.startTime) / 1000) % 60)
									.toString()
									.padStart(2, '0')}
							</div>
							<div className="text-sm text-white/60">TIME</div>
						</div>
					</div>

					{/* Right: Action Buttons */}
					<div className="flex gap-2">
						<motion.button
							onClick={handleToggleNoteMode}
							className={cn(
								'group relative overflow-hidden rounded-lg border border-white/20 px-3 py-2 text-sm font-bold backdrop-blur-sm transition-all duration-200',
								gameState.noteMode
									? 'border-blue-400/50 bg-blue-500/80 text-white'
									: 'bg-white/10 text-white/90 hover:bg-white/20',
							)}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="relative z-10">📝</span>
						</motion.button>
						<motion.button
							onClick={undoMove}
							className="group relative overflow-hidden rounded-lg border border-white/20 bg-purple-500/80 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-purple-600/80"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="relative z-10">↶</span>
						</motion.button>
						<motion.button
							onClick={handlePause}
							className="group relative overflow-hidden rounded-lg border border-white/20 bg-amber-500/80 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-amber-600/80"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="relative z-10">⏸️</span>
						</motion.button>
						<motion.button
							onClick={handleNewGame}
							className="group relative overflow-hidden rounded-lg border border-white/20 bg-red-500/80 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-red-600/80"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="relative z-10">🔄</span>
						</motion.button>
					</div>
				</div>
			</div>

			{/* Main Game Area - With top padding for nav */}
			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-4">
				{/* Game Board - Large and Centered */}
				<div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
					<SudokuBoard
						gameState={gameState}
						onCellClick={handleCellClick}
						selectedCell={selectedCell}
						highlightedNumber={highlightedNumber}
					/>
				</div>
			</div>

			{/* Desktop Number Panel - Right Side */}
			<div className="fixed top-1/2 right-4 z-20 hidden -translate-y-1/2 xl:block">
				<div className="rounded-3xl border border-white/20 bg-black/20 p-6 shadow-2xl backdrop-blur-lg">
					{/* Number Grid */}
					<div className="mb-4 grid grid-cols-3 gap-3">
						{SUDOKU_NUMBERS.map((num) => (
							<motion.button
								key={num}
								onClick={() => handleNumberInput(num)}
								className={cn(
									'group relative h-16 w-16 cursor-pointer overflow-hidden rounded-2xl border-2 text-2xl font-bold transition-all duration-200',
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
						onClick={handleClearCellClick}
						className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-red-400/50 bg-red-500/90 p-4 text-lg font-bold text-white transition-all duration-200 hover:bg-red-600/90"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<span className="relative z-10">🗑️ Clear</span>
						<div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-pink-600/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					</motion.button>
				</div>
			</div>

			{/* Mobile Number Panel - Bottom Fixed */}
			<div className="fixed right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-black/30 backdrop-blur-lg xl:hidden">
				<div className="mx-auto max-w-2xl p-4">
					{/* Number Grid */}
					<div className="grid grid-cols-5 gap-3">
						{SUDOKU_NUMBERS.map((num) => (
							<motion.button
								key={num}
								onClick={() => handleNumberInput(num)}
								className={cn(
									'h-14 cursor-pointer rounded-xl border-2 text-lg font-bold transition-all duration-200',
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
							onClick={handleClearCellClick}
							className="h-14 cursor-pointer rounded-xl border-2 border-red-400/50 bg-red-500/90 text-lg font-bold text-white hover:bg-red-600/90"
							whileTap={{ scale: 0.95 }}
						>
							🗑️
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
								⏸️ Game Paused
							</motion.h2>
							<motion.button
								onClick={handlePause}
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
									<span className="text-3xl">▶️</span>
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
								🎉 Victory!
							</motion.h2>
							<motion.p
								className="mb-8 text-2xl font-semibold text-white/90"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.5 }}
							>
								Time: {Math.floor((gameState.endTime! - gameState.startTime) / 1000 / 60)}:
								{(Math.floor((gameState.endTime! - gameState.startTime) / 1000) % 60)
									.toString()
									.padStart(2, '0')}
							</motion.p>
							<motion.div
								className="flex justify-center gap-6"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.6, duration: 0.5 }}
							>
								<motion.button
									onClick={handleNewGame}
									className="group hover:shadow-3xl relative overflow-hidden rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-xl font-black text-white shadow-2xl transition-all duration-300 hover:border-white/50 focus:ring-4 focus:ring-white/30 focus:outline-none"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* Background Animation */}
									<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

									<span className="relative z-10 flex items-center gap-2">
										<span>🔄</span>
										<span>New Game</span>
									</span>

									{/* Shine Effect */}
									<div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
								</motion.button>
								<motion.button
									onClick={handleBackToStart}
									className="group hover:shadow-3xl relative overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-xl font-black text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 focus:ring-4 focus:ring-white/30 focus:outline-none"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* Background Animation */}
									<div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

									<span className="relative z-10 flex items-center gap-2">
										<span>🏠</span>
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
