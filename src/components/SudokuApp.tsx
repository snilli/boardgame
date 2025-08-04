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
		resetGame
	} = useGameStore()

	const {
		selectedCell,
		highlightedNumber,
		handleCellSelection,
		clearSelection
	} = useUIStore()

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
		<div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pb-20 md:pb-0">
			{/* Same Background Elements as Start Screen */}
			<div className="absolute inset-0">
				{/* Floating Numbers */}
				{FLOATING_NUMBERS.map((num, index) => (
					<motion.div
						key={num}
						className="absolute text-4xl font-bold text-white/5 md:text-6xl"
						style={{
							left: `${5 + (index * 11)}%`,
							top: `${15 + (index % 4) * 25}%`,
						}}
						animate={{
							y: [-15, 15, -15],
							rotate: [-3, 3, -3],
							opacity: [0.05, 0.1, 0.05]
						}}
						transition={{
							duration: 6 + index * 0.3,
							repeat: Infinity,
							ease: "easeInOut"
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
					className="absolute left-1/6 top-1/6 h-48 w-48 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.4, 0.2]
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>
				<motion.div
					className="absolute right-1/6 bottom-1/6 h-32 w-32 rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-3xl"
					animate={{
						scale: [1.1, 1, 1.1],
						opacity: [0.4, 0.2, 0.4]
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>
			</div>

			{/* Top Game Info Bar */}
			<div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-white/5 px-8 py-4 backdrop-blur-lg">
				{/* Game Stats */}
				<div className="flex items-center gap-8">
					<div className="text-center">
						<div className="text-2xl font-bold text-white">
							{Math.floor((Date.now() - gameState.startTime) / 1000 / 60)}:
							{(Math.floor((Date.now() - gameState.startTime) / 1000) % 60).toString().padStart(2, '0')}
						</div>
						<div className="text-xs text-white/60">TIME</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-400">{gameState.difficultyName}</div>
						<div className="text-xs text-white/60">LEVEL</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<motion.button
						onClick={handleToggleNoteMode}
						className={cn(
							'group relative overflow-hidden rounded-xl border border-white/20 px-6 py-3 text-sm font-bold backdrop-blur-sm transition-all duration-200',
							gameState.noteMode 
								? 'bg-blue-500/80 text-white border-blue-400/50' 
								: 'bg-white/10 text-white/90 hover:bg-white/20',
						)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<span className="relative z-10">📝 Notes</span>
						{gameState.noteMode && (
							<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
						)}
					</motion.button>
					<motion.button
						onClick={undoMove}
						className="group relative overflow-hidden rounded-xl border border-white/20 bg-purple-500/80 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-purple-600/80"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<span className="relative z-10">↶ Undo</span>
						<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					</motion.button>
					<motion.button
						onClick={handlePause}
						className="group relative overflow-hidden rounded-xl border border-white/20 bg-amber-500/80 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-amber-600/80"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<span className="relative z-10">⏸️ Pause</span>
						<div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					</motion.button>
					<motion.button
						onClick={handleNewGame}
						className="group relative overflow-hidden rounded-xl border border-white/20 bg-red-500/80 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-red-600/80"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<span className="relative z-10">🔄 New</span>
						<div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					</motion.button>
				</div>
			</div>

			{/* Main Game Area */}
			<div className="relative z-10 flex flex-1 items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
				{/* Game Board */}
				<div className="max-w-2xl flex-1">
					<SudokuBoard
						gameState={gameState}
						onCellClick={handleCellClick}
						selectedCell={selectedCell}
						highlightedNumber={highlightedNumber}
					/>
				</div>

				{/* Number Panel - Responsive */}
				<div className="hidden md:block">
					<div className="rounded-3xl border border-white/20 bg-white/5 p-4 shadow-2xl backdrop-blur-lg lg:p-6">
						{/* Number Grid */}
						<div className="mb-4 grid grid-cols-3 gap-2 lg:gap-3">
							{SUDOKU_NUMBERS.map((num) => (
								<motion.button
									key={num}
									onClick={() => handleNumberInput(num)}
									className={cn(
										'group relative h-12 w-12 cursor-pointer overflow-hidden rounded-xl border-2 text-lg font-bold transition-all duration-200 lg:h-14 lg:w-14 lg:text-xl',
										highlightedNumber === num
											? 'border-blue-400/50 bg-blue-500/80 text-white shadow-lg shadow-blue-500/30'
											: 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20',
									)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<span className="relative z-10">{num}</span>
									{highlightedNumber === num && (
										<div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20" />
									)}
									<div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
								</motion.button>
							))}
						</div>

						{/* Clear Button */}
						<motion.button
							onClick={handleClearCellClick}
							className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-red-500/80 p-3 text-base font-bold text-white transition-all duration-200 hover:bg-red-600/80 lg:p-4 lg:text-lg"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className="relative z-10">🗑️ Clear</span>
							<div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
						</motion.button>
					</div>
				</div>

				{/* Mobile Number Panel - Bottom */}
				<div className="fixed right-0 bottom-0 left-0 z-40 border-t border-white/10 bg-white/5 p-4 backdrop-blur-lg md:hidden">
					<div className="mx-auto max-w-md">
						{/* Number Grid */}
						<div className="mb-3 grid grid-cols-5 gap-2">
							{SUDOKU_NUMBERS.map((num) => (
								<motion.button
									key={num}
									onClick={() => handleNumberInput(num)}
									className={cn(
										'h-10 cursor-pointer rounded-lg border text-sm font-bold transition-all duration-200',
										highlightedNumber === num
											? 'border-blue-400/50 bg-blue-500/80 text-white shadow-md'
											: 'border-white/20 bg-white/10 text-white',
									)}
									whileTap={{ scale: 0.95 }}
								>
									{num}
								</motion.button>
							))}
							{/* Clear Button */}
							<motion.button
								onClick={handleClearCellClick}
								className="h-10 cursor-pointer rounded-lg border border-white/20 bg-red-500/80 text-sm font-bold text-white"
								whileTap={{ scale: 0.95 }}
							>
								🗑️
							</motion.button>
						</div>
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
						transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
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
								className="group relative overflow-hidden rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-6 text-2xl font-black text-white shadow-2xl transition-all duration-300 hover:border-white/50 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/30"
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
						transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
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
									className="group relative overflow-hidden rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-xl font-black text-white shadow-2xl transition-all duration-300 hover:border-white/50 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/30"
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
									className="group relative overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-xl font-black text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/30"
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
