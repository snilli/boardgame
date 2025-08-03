'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import GameStartScreen from './GameStartScreen'
import DifficultyScreen from './DifficultyScreen'
import GameHeader from './GameHeader'
import SudokuBoard from './SudokuBoard'
import type { SudokuGameState, GameMode } from '@app/domain/sudoku-game'
import { createInitialGameState } from '@app/domain/sudoku-game'
import { cn } from '@app/utils/cn'

export default function SudokuApp() {
	const [gameMode, setGameMode] = useState<GameMode>('start')
	const [gameState, setGameState] = useState<SudokuGameState | null>(null)
	const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
	const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null)

	// Game Flow Handlers
	const handleStartGame = useCallback(() => {
		setGameMode('difficulty-select')
	}, [])

	const handleSelectDifficulty = useCallback((difficulty: string) => {
		const newGameState = createInitialGameState(difficulty)
		setGameState(newGameState)
		setGameMode('playing')
	}, [])

	const handleBackToStart = useCallback(() => {
		setGameMode('start')
		setGameState(null)
	}, [])

	const handleNewGame = useCallback(() => {
		setGameMode('difficulty-select')
		setGameState(null)
		setSelectedCell(null)
		setHighlightedNumber(null)
	}, [])

	const handlePause = useCallback(() => {
		if (!gameState) return
		setGameState((prev) => (prev ? { ...prev, isPaused: !prev.isPaused } : null))
		setGameMode((prev) => (prev === 'playing' ? 'paused' : 'playing'))
	}, [gameState])

	// Game Logic Handlers
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (!gameState || gameState.isPaused || gameState.isCompleted) return

			// Toggle selection
			if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
				setSelectedCell(null)
				setHighlightedNumber(null)
			} else {
				setSelectedCell({ row, col })
				const cellValue = gameState.board[row][col]
				setHighlightedNumber(cellValue !== 0 ? cellValue : null)
			}
		},
		[gameState, selectedCell],
	)

	const lastInputRef = useRef<{ value: number; cell: string; time: number } | null>(null)

	const handleNumberInput = useCallback(
		(value: number) => {
			if (!gameState || !selectedCell || gameState.isPaused || gameState.isCompleted) {
				return
			}

			const { row, col } = selectedCell
			const cellKey = `${row}-${col}`
			const now = Date.now()

			// Debounce: prevent duplicate calls within 100ms for same value/cell
			if (
				lastInputRef.current &&
				lastInputRef.current.value === value &&
				lastInputRef.current.cell === cellKey &&
				now - lastInputRef.current.time < 100
			) {
				return
			}

			lastInputRef.current = { value, cell: cellKey, time: now }

			// Don't allow modifying initial clues
			if (gameState.initialBoard[row][col] !== 0) {
				return
			}

			flushSync(() => {
				setGameState((prev) => {
					if (!prev) return null

					const newState = { ...prev }
					const cellKey = `${row}-${col}`

					if (newState.noteMode) {
						// Note mode: only modify notes, DO NOT touch board

						// Create new notes object to ensure immutability
						const newNotes = { ...newState.notes }

						if (!newNotes[cellKey]) {
							newNotes[cellKey] = []
						}

						// Always create a new array for this cell
						const currentNotes = [...newNotes[cellKey]]
						const noteIndex = currentNotes.indexOf(value)

						if (noteIndex >= 0) {
							// Remove existing note
							currentNotes.splice(noteIndex, 1)
							if (currentNotes.length === 0) {
								delete newNotes[cellKey]
							} else {
								newNotes[cellKey] = currentNotes
							}
						} else {
							// Add new note
							currentNotes.push(value)
							currentNotes.sort()
							newNotes[cellKey] = currentNotes
						}

						newState.notes = newNotes
						// DON'T modify board in note mode!
					} else {
						// Normal mode: place number and clear notes
						newState.board[row][col] = value
						delete newState.errors[cellKey]
						delete newState.notes[cellKey]

						// Check if correct
						if (value !== 0 && value !== newState.solution[row][col]) {
							newState.errors[cellKey] = true
						}

						// Check if completed
						const isComplete = newState.board.every((boardRow, rowIndex) =>
							boardRow.every(
								(cell, colIndex) => cell !== 0 && cell === newState.solution[rowIndex][colIndex],
							),
						)

						if (isComplete) {
							newState.isCompleted = true
							newState.endTime = Date.now()
						}
					}

					return newState
				})
			})

			setHighlightedNumber(value !== 0 ? value : null)
		},
		[gameState, selectedCell],
	)

	const handleClearCell = useCallback(() => {
		if (!gameState || !selectedCell || gameState.isPaused || gameState.isCompleted) return

		const { row, col } = selectedCell

		// Don't allow clearing initial clues
		if (gameState.initialBoard[row][col] !== 0) return

		setGameState((prev) => {
			if (!prev) return null
			const newState = { ...prev }
			newState.board[row][col] = 0
			const cellKey = `${row}-${col}`
			delete newState.errors[cellKey]
			newState.isCompleted = false
			return newState
		})

		setHighlightedNumber(null)
	}, [gameState, selectedCell])

	const handleToggleNoteMode = useCallback(() => {
		if (!gameState) return
		setGameState((prev) => (prev ? { ...prev, noteMode: !prev.noteMode } : null))
	}, [gameState])

	// Keyboard input
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!gameState) return

			const key = event.key

			// Prevent event bubbling and multiple triggers
			event.preventDefault()
			event.stopPropagation()

			// Spacebar for pause/unpause (works anytime during game)
			if (key === ' ' || key === 'Spacebar') {
				if (!gameState.isCompleted) {
					handlePause()
				}
				return
			}

			// Note mode toggle (works anytime during active game)
			if (key === 'n' || key === 'N') {
				if (!gameState.isPaused && !gameState.isCompleted) {
					handleToggleNoteMode()
				}
				return
			}

			// Other keys require selected cell and active game
			if (!selectedCell || gameState.isPaused || gameState.isCompleted) return

			if (key >= '1' && key <= '9') {
				handleNumberInput(parseInt(key))
			} else if (key === 'Backspace' || key === 'Delete' || key === '0') {
				handleClearCell()
			}
		},
		[selectedCell, gameState, handleNumberInput, handleClearCell, handleToggleNoteMode, handlePause],
	)

	// Add keyboard listener
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

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
							{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
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
							onClick={handleClearCell}
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
							{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
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
								onClick={handleClearCell}
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
