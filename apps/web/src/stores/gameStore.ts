// Game Store - Using Zustand for state management
import type { GameMode, SudokuGameState } from '@app/domain/sudoku-game'
import { createInitialGameState } from '@app/domain/sudoku-game'
import { SudokuValidator } from '@app/domain/SudokuValidator'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Helper function to update errors incrementally (Hybrid approach)
const updateErrorsIncremental = (
	board: number[][],
	row: number,
	col: number,
	currentErrors: { [key: string]: boolean },
): { [key: string]: boolean } => {
	// Find conflicts only in affected cells (Performance optimization)
	const conflictCells = SudokuValidator.findConflictsInAffectedCells(board, row, col)

	// Get affected cell positions to clear old errors
	const affectedCells = SudokuValidator.getAffectedCells(row, col, board.length)

	// Start with current errors and update only affected areas
	const newErrors = { ...currentErrors }

	// Clear errors for all affected cells first
	affectedCells.forEach((cell) => {
		delete newErrors[`${cell.row}-${cell.col}`]
	})

	// Add new errors for conflicted cells
	conflictCells.forEach((cellKey) => {
		newErrors[cellKey] = true
	})

	return newErrors
}

interface GameState {
	// Current game data
	gameState: SudokuGameState | null
	gameMode: GameMode

	// History for undo
	history: SudokuGameState[]
	// maxHistorySize: number // Unlimited undo

	// Actions
	createNewGame: (difficulty: string) => void
	setGameMode: (mode: GameMode) => void
	handleCellInput: (row: number, col: number, value: number) => void
	handleClearCell: (row: number, col: number) => void
	toggleNoteMode: () => void
	setNoteMode: (enabled: boolean) => void
	pauseGame: () => void
	resumeGame: () => void
	undoMove: () => boolean
	saveToHistory: () => void
	clearHistory: () => void
	resetGame: () => void
}

export const useGameStore = create<GameState>()(
	devtools(
		persist(
			immer((set, get) => ({
				// Initial state
				gameState: null,
				gameMode: 'start',
				history: [],
				// maxHistorySize: 1000, // Unlimited undo - no limit needed

				// Actions
				createNewGame: (difficulty: string) => {
					set((state) => {
						state.gameState = createInitialGameState(difficulty)
						state.gameMode = 'playing'
						state.history = []
					})
				},

				setGameMode: (mode: GameMode) => {
					set((state) => {
						state.gameMode = mode
					})
				},

				handleCellInput: (row: number, col: number, value: number) => {
					const { gameState } = get()
					if (!gameState || gameState.isPaused || gameState.isCompleted) return
					if (gameState.initialBoard[row][col] !== 0) return

					// Save to history before making changes
					get().saveToHistory()

					set((state) => {
						if (!state.gameState) return

						const cellKey = `${row}-${col}`

						if (state.gameState.noteMode) {
							// Note mode logic
							if (!state.gameState.notes[cellKey]) {
								state.gameState.notes[cellKey] = []
							}

							const currentNotes = [...state.gameState.notes[cellKey]]
							const hasValue = currentNotes.includes(value)

							if (hasValue) {
								// Remove existing note using filter
								const filteredNotes = currentNotes.filter((note) => note !== value)
								if (filteredNotes.length === 0) {
									delete state.gameState.notes[cellKey]
								} else {
									state.gameState.notes[cellKey] = filteredNotes
								}
							} else {
								// Add new note and sort in one operation
								state.gameState.notes[cellKey] = [...currentNotes, value].sort()
							}
						} else {
							// Normal mode: place number
							state.gameState.board[row][col] = value
							delete state.gameState.errors[cellKey]
							delete state.gameState.notes[cellKey]

							// Clear related notes
							if (value !== 0) {
								// Same row, column, and 3x3 box
								for (let i = 0; i < 9; i++) {
									// Row - use filter instead of splice
									const rowKey = `${row}-${i}`
									if (state.gameState.notes[rowKey]) {
										const filteredNotes = state.gameState.notes[rowKey].filter(
											(note) => note !== value,
										)
										if (filteredNotes.length === 0) {
											delete state.gameState.notes[rowKey]
										} else {
											state.gameState.notes[rowKey] = filteredNotes
										}
									}

									// Column - use filter instead of splice
									const colKey = `${i}-${col}`
									if (state.gameState.notes[colKey]) {
										const filteredNotes = state.gameState.notes[colKey].filter(
											(note) => note !== value,
										)
										if (filteredNotes.length === 0) {
											delete state.gameState.notes[colKey]
										} else {
											state.gameState.notes[colKey] = filteredNotes
										}
									}
								}

								// 3x3 box
								const boxRow = Math.floor(row / 3) * 3
								const boxCol = Math.floor(col / 3) * 3
								for (let r = boxRow; r < boxRow + 3; r++) {
									for (let c = boxCol; c < boxCol + 3; c++) {
										const boxKey = `${r}-${c}`
										if (state.gameState.notes[boxKey]) {
											const filteredNotes = state.gameState.notes[boxKey].filter(
												(note) => note !== value,
											)
											if (filteredNotes.length === 0) {
												delete state.gameState.notes[boxKey]
											} else {
												state.gameState.notes[boxKey] = filteredNotes
											}
										}
									}
								}
							}

							// Update errors incrementally (Hybrid approach)
							state.gameState.errors = updateErrorsIncremental(
								state.gameState.board,
								row,
								col,
								state.gameState.errors,
							)

							// Check completion
							const isComplete = state.gameState.board.every((boardRow, rowIndex) =>
								boardRow.every(
									(cell, colIndex) =>
										cell !== 0 && cell === state.gameState!.solution[rowIndex][colIndex],
								),
							)

							if (isComplete) {
								state.gameState.isCompleted = true
								state.gameState.endTime = Date.now()
								state.gameMode = 'completed'
							}
						}
					})
				},

				handleClearCell: (row: number, col: number) => {
					const { gameState } = get()
					if (!gameState || gameState.isPaused || gameState.isCompleted) return
					if (gameState.initialBoard[row][col] !== 0) return

					get().saveToHistory()

					set((state) => {
						if (!state.gameState) return

						state.gameState.board[row][col] = 0
						const cellKey = `${row}-${col}`
						delete state.gameState.notes[cellKey]
						state.gameState.isCompleted = false
						if (state.gameMode === 'completed') {
							state.gameMode = 'playing'
						}

						// Update errors incrementally (Hybrid approach)
						state.gameState.errors = updateErrorsIncremental(
							state.gameState.board,
							row,
							col,
							state.gameState.errors,
						)
					})
				},

				toggleNoteMode: () => {
					set((state) => {
						if (state.gameState) {
							state.gameState.noteMode = !state.gameState.noteMode
						}
					})
				},

				setNoteMode: (enabled: boolean) => {
					set((state) => {
						if (state.gameState) {
							state.gameState.noteMode = enabled
						}
					})
				},

				pauseGame: () => {
					set((state) => {
						if (state.gameState && !state.gameState.isCompleted) {
							state.gameState.isPaused = true
							state.gameState.pausedAt = Date.now() // บันทึกเวลาที่ pause
							state.gameMode = 'paused'
						}
					})
				},

				resumeGame: () => {
					set((state) => {
						if (state.gameState && state.gameState.pausedAt) {
							// คำนวณระยะเวลาที่ pause และเพิ่มเข้า totalPausedDuration
							const pauseDuration = Date.now() - state.gameState.pausedAt
							state.gameState.totalPausedDuration += pauseDuration

							// Clear pause state
							state.gameState.isPaused = false
							state.gameState.pausedAt = undefined
							state.gameMode = 'playing'
						}
					})
				},

				undoMove: (): boolean => {
					const { history } = get()
					if (history.length === 0) return false

					set((state) => {
						const previousState = state.history.pop()
						if (previousState) {
							state.gameState = {
								board: previousState.board.map((row) => [...row]),
								initialBoard: previousState.initialBoard,
								solution: previousState.solution,
								notes: { ...previousState.notes },
								errors: { ...previousState.errors },
								noteMode: previousState.noteMode,
								isCompleted: previousState.isCompleted,
								isPaused: previousState.isPaused,
								difficulty: previousState.difficulty,
								difficultyName: previousState.difficultyName,
								startTime: previousState.startTime,
								endTime: previousState.endTime,
								pausedAt: previousState.pausedAt,
								totalPausedDuration: previousState.totalPausedDuration,
							}
						}
					})

					return true
				},

				saveToHistory: () => {
					const { gameState } = get()
					if (!gameState) return

					set((state) => {
						const stateCopy: SudokuGameState = {
							board: gameState.board.map((row) => [...row]),
							initialBoard: gameState.initialBoard,
							solution: gameState.solution,
							notes: { ...gameState.notes },
							errors: { ...gameState.errors },
							noteMode: gameState.noteMode,
							isCompleted: gameState.isCompleted,
							isPaused: gameState.isPaused,
							difficulty: gameState.difficulty,
							difficultyName: gameState.difficultyName,
							startTime: gameState.startTime,
							endTime: gameState.endTime,
							pausedAt: gameState.pausedAt,
							totalPausedDuration: gameState.totalPausedDuration,
						}

						state.history.push(stateCopy)
						// No limit - unlimited undo
						// if (state.history.length > maxHistorySize) {
						// 	state.history = state.history.slice(-maxHistorySize)
						// }
					})
				},

				clearHistory: () => {
					set((state) => {
						state.history = []
					})
				},

				resetGame: () => {
					set((state) => {
						state.gameState = null
						state.gameMode = 'start'
						state.history = []
					})
				},
			})),
			{
				name: 'sudoku-game-store',
				partialize: (state) => ({
					gameState: state.gameState,
					gameMode: state.gameMode,
				}),
			},
		),
		{ name: 'GameStore' },
	),
)
