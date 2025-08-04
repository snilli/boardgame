// Game Store - Using Zustand for state management
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { SudokuGameState, GameMode } from '@app/domain/sudoku-game'
import { createInitialGameState } from '@app/domain/sudoku-game'
import { deepClone } from '@app/utils/objectUtils'

interface GameState {
	// Current game data
	gameState: SudokuGameState | null
	gameMode: GameMode
	
	// History for undo
	history: SudokuGameState[]
	maxHistorySize: number
	
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
				maxHistorySize: 20,

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
							const noteIndex = currentNotes.indexOf(value)

							if (noteIndex >= 0) {
								// Remove existing note
								currentNotes.splice(noteIndex, 1)
								if (currentNotes.length === 0) {
									delete state.gameState.notes[cellKey]
								} else {
									state.gameState.notes[cellKey] = currentNotes
								}
							} else {
								// Add new note
								currentNotes.push(value)
								currentNotes.sort()
								state.gameState.notes[cellKey] = currentNotes
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
									// Row
									const rowKey = `${row}-${i}`
									if (state.gameState.notes[rowKey]) {
										const idx = state.gameState.notes[rowKey].indexOf(value)
										if (idx >= 0) {
											state.gameState.notes[rowKey].splice(idx, 1)
											if (state.gameState.notes[rowKey].length === 0) {
												delete state.gameState.notes[rowKey]
											}
										}
									}

									// Column
									const colKey = `${i}-${col}`
									if (state.gameState.notes[colKey]) {
										const idx = state.gameState.notes[colKey].indexOf(value)
										if (idx >= 0) {
											state.gameState.notes[colKey].splice(idx, 1)
											if (state.gameState.notes[colKey].length === 0) {
												delete state.gameState.notes[colKey]
											}
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
											const idx = state.gameState.notes[boxKey].indexOf(value)
											if (idx >= 0) {
												state.gameState.notes[boxKey].splice(idx, 1)
												if (state.gameState.notes[boxKey].length === 0) {
													delete state.gameState.notes[boxKey]
												}
											}
										}
									}
								}
							}

							// Check if correct
							if (value !== 0 && value !== state.gameState.solution[row][col]) {
								state.gameState.errors[cellKey] = true
							}

							// Check completion
							const isComplete = state.gameState.board.every((boardRow, rowIndex) =>
								boardRow.every((cell, colIndex) => 
									cell !== 0 && cell === state.gameState!.solution[rowIndex][colIndex]
								)
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
						delete state.gameState.errors[cellKey]
						delete state.gameState.notes[cellKey]
						state.gameState.isCompleted = false
						if (state.gameMode === 'completed') {
							state.gameMode = 'playing'
						}
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
							state.gameMode = 'paused'
						}
					})
				},

				resumeGame: () => {
					set((state) => {
						if (state.gameState) {
							state.gameState.isPaused = false
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
								board: previousState.board.map(row => [...row]),
								initialBoard: previousState.initialBoard,
								solution: previousState.solution,
								notes: deepClone(previousState.notes),
								errors: deepClone(previousState.errors),
								noteMode: previousState.noteMode,
								isCompleted: previousState.isCompleted,
								isPaused: previousState.isPaused,
								difficulty: previousState.difficulty,
								difficultyName: previousState.difficultyName,
								startTime: previousState.startTime,
								endTime: previousState.endTime
							}
						}
					})

					return true
				},

				saveToHistory: () => {
					const { gameState, maxHistorySize } = get()
					if (!gameState) return

					set((state) => {
						const stateCopy: SudokuGameState = {
							board: gameState.board.map(row => [...row]),
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
							endTime: gameState.endTime
						}

						state.history.push(stateCopy)
						if (state.history.length > maxHistorySize) {
							state.history = state.history.slice(-maxHistorySize)
						}
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
				}
			})),
			{
				name: 'sudoku-game-store',
				partialize: (state) => ({
					gameState: state.gameState,
					gameMode: state.gameMode
				})
			}
		),
		{ name: 'GameStore' }
	)
)