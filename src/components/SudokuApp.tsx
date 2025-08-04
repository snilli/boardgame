'use client'

import { useCallback } from 'react'
import { useGameStore, useUIStore } from '@app/stores'
import { useKeyboardHandler } from '@app/hooks/useKeyboardHandler'
import { cn } from '@app/utils/cn'
import DifficultyScreen from './DifficultyScreen'
import GameStartScreen from './GameStartScreen'
import SudokuBoard from './SudokuBoard'

const baseNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]

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
		<div className="flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-slate-100 to-blue-100 pb-20 md:pb-0">
			{/* Top Game Info Bar */}
			<div className="flex items-center justify-between border-b border-black/10 bg-white/90 px-8 py-4 backdrop-blur-lg">
				{/* Game Stats */}
				<div className="flex items-center gap-8">
					<div className="text-center">
						<div className="text-2xl font-bold text-slate-800">
							{Math.floor((Date.now() - gameState.startTime) / 1000 / 60)}:
							{(Math.floor((Date.now() - gameState.startTime) / 1000) % 60).toString().padStart(2, '0')}
						</div>
						<div className="text-xs text-slate-500">TIME</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">{gameState.difficultyName}</div>
						<div className="text-xs text-slate-500">LEVEL</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button
						onClick={handleToggleNoteMode}
						className={cn(
							'cursor-pointer rounded-xl border-none px-6 py-3 text-sm font-bold',
							gameState.noteMode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-gray-700',
						)}
					>
						📝 Notes
					</button>
					<button
						onClick={undoMove}
						className="cursor-pointer rounded-xl border-none bg-purple-500 px-6 py-3 text-sm font-bold text-white hover:bg-purple-600"
					>
						↶ Undo
					</button>
					<button
						onClick={handlePause}
						className="cursor-pointer rounded-xl border-none bg-amber-500 px-6 py-3 text-sm font-bold text-white"
					>
						⏸️ Pause
					</button>
					<button
						onClick={handleNewGame}
						className="cursor-pointer rounded-xl border-none bg-red-500 px-6 py-3 text-sm font-bold text-white"
					>
						🔄 New
					</button>
				</div>
			</div>

			{/* Main Game Area */}
			<div className="flex flex-1 items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
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
					<div className="rounded-3xl border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur-lg lg:p-6">
						{/* Number Grid */}
						<div className="mb-4 grid grid-cols-3 gap-2 lg:gap-3">
							{baseNumber.map((num) => (
								<button
									key={num}
									onClick={() => handleNumberInput(num)}
									className={cn(
										'h-12 w-12 cursor-pointer rounded-xl border-2 text-lg font-bold transition-all duration-200 lg:h-14 lg:w-14 lg:text-xl',
										highlightedNumber === num
											? 'border-indigo-500 bg-indigo-500 text-white shadow-lg'
											: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
									)}
								>
									{num}
								</button>
							))}
						</div>

						{/* Clear Button */}
						<button
							onClick={handleClearCellClick}
							className="w-full cursor-pointer rounded-xl bg-red-500 p-3 text-base font-bold text-white transition-colors hover:bg-red-600 lg:p-4 lg:text-lg"
						>
							🗑️ Clear
						</button>
					</div>
				</div>

				{/* Mobile Number Panel - Bottom */}
				<div className="fixed right-0 bottom-0 left-0 z-40 border-t border-white/20 bg-white/95 p-4 backdrop-blur-lg md:hidden">
					<div className="mx-auto max-w-md">
						{/* Number Grid */}
						<div className="mb-3 grid grid-cols-5 gap-2">
							{baseNumber.map((num) => (
								<button
									key={num}
									onClick={() => handleNumberInput(num)}
									className={cn(
										'h-10 cursor-pointer rounded-lg border text-sm font-bold transition-all duration-200',
										highlightedNumber === num
											? 'border-indigo-500 bg-indigo-500 text-white shadow-md'
											: 'border-slate-300 bg-white text-slate-700',
									)}
								>
									{num}
								</button>
							))}
							{/* Clear Button */}
							<button
								onClick={handleClearCellClick}
								className="h-10 cursor-pointer rounded-lg bg-red-500 text-sm font-bold text-white"
							>
								🗑️
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Pause Modal */}
			{gameMode === 'paused' && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="rounded-3xl bg-white p-12 text-center shadow-2xl">
						<h2 className="mb-4 text-4xl font-bold">⏸️ Game Paused</h2>
						<button
							onClick={handlePause}
							className="cursor-pointer rounded-2xl border-none bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-700"
						>
							▶️ Resume
						</button>
					</div>
				</div>
			)}

			{/* Victory Modal */}
			{gameState.isCompleted && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="rounded-3xl bg-white p-12 text-center shadow-2xl">
						<h2 className="mb-4 text-5xl font-bold">🎉 Victory!</h2>
						<p className="mb-8 text-2xl text-gray-700">
							Time: {Math.floor((gameState.endTime! - gameState.startTime) / 1000 / 60)}:
							{(Math.floor((gameState.endTime! - gameState.startTime) / 1000) % 60)
								.toString()
								.padStart(2, '0')}
						</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={handleNewGame}
								className="cursor-pointer rounded-2xl border-none bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-700"
							>
								🔄 New Game
							</button>
							<button
								onClick={handleBackToStart}
								className="cursor-pointer rounded-2xl border-none bg-gray-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-gray-700"
							>
								🏠 Menu
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
