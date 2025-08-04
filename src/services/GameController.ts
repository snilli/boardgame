// Game Controller - Single Responsibility Principle
import { flushSync } from 'react-dom'
import type { SudokuGameState } from '@app/domain/sudoku-game'
import { createInitialGameState } from '@app/domain/sudoku-game'
import type { IGameController, IGameStateHistory } from './interfaces'
import { deepClone } from '@app/utils/objectUtils'

export class GameController implements IGameController {
	private gameState: SudokuGameState | null = null
	private history: IGameStateHistory

	constructor(history: IGameStateHistory) {
		this.history = history
	}

	getGameState(): SudokuGameState | null {
		return this.gameState
	}

	createNewGame(difficulty: string): void {
		this.gameState = createInitialGameState(difficulty)
		this.history.clear()
	}

	handleCellInput(row: number, col: number, value: number): void {
		if (!this.gameState || this.gameState.isPaused || this.gameState.isCompleted) {
			return
		}

		// Don't allow modifying initial clues
		if (this.gameState.initialBoard[row][col] !== 0) {
			return
		}

		// Save current state before making changes
		this.history.saveState(this.gameState)

		flushSync(() => {
			if (!this.gameState) return

			const newState = { ...this.gameState }
			const cellKey = `${row}-${col}`

			if (newState.noteMode) {
				// Note mode logic
				this.handleNoteInput(newState, row, col, value, cellKey)
			} else {
				// Normal mode logic
				this.handleNormalInput(newState, row, col, value, cellKey)
			}

			this.gameState = newState
		})
	}

	private handleNoteInput(state: SudokuGameState, row: number, col: number, value: number, cellKey: string): void {
		const newNotes = { ...state.notes }

		if (!newNotes[cellKey]) {
			newNotes[cellKey] = []
		}

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

		state.notes = newNotes
	}

	private handleNormalInput(state: SudokuGameState, row: number, col: number, value: number, cellKey: string): void {
		// Place number and clear notes
		state.board[row][col] = value
		delete state.errors[cellKey]
		delete state.notes[cellKey]

		// Remove this number from notes in related cells
		if (value !== 0) {
			this.clearRelatedNotes(state, row, col, value)
		}

		// Check if correct
		if (value !== 0 && value !== state.solution[row][col]) {
			state.errors[cellKey] = true
		}

		// Check if completed
		const isComplete = state.board.every((boardRow, rowIndex) =>
			boardRow.every((cell, colIndex) => cell !== 0 && cell === state.solution[rowIndex][colIndex]),
		)

		if (isComplete) {
			state.isCompleted = true
			state.endTime = Date.now()
		}
	}

	private clearRelatedNotes(state: SudokuGameState, row: number, col: number, value: number): void {
		// Same row
		for (let c = 0; c < 9; c++) {
			this.removeNoteFromCell(state, `${row}-${c}`, value)
		}

		// Same column
		for (let r = 0; r < 9; r++) {
			this.removeNoteFromCell(state, `${r}-${col}`, value)
		}

		// Same 3x3 box
		const boxRow = Math.floor(row / 3) * 3
		const boxCol = Math.floor(col / 3) * 3
		for (let r = boxRow; r < boxRow + 3; r++) {
			for (let c = boxCol; c < boxCol + 3; c++) {
				this.removeNoteFromCell(state, `${r}-${c}`, value)
			}
		}
	}

	private removeNoteFromCell(state: SudokuGameState, cellKey: string, value: number): void {
		if (state.notes[cellKey]) {
			const noteIndex = state.notes[cellKey].indexOf(value)
			if (noteIndex >= 0) {
				state.notes[cellKey].splice(noteIndex, 1)
				if (state.notes[cellKey].length === 0) {
					delete state.notes[cellKey]
				}
			}
		}
	}

	handleClearCell(row: number, col: number): void {
		if (!this.gameState || this.gameState.isPaused || this.gameState.isCompleted) {
			return
		}

		// Don't allow clearing initial clues
		if (this.gameState.initialBoard[row][col] !== 0) {
			return
		}

		// Save current state before clearing
		this.history.saveState(this.gameState)

		const newState = { ...this.gameState }
		newState.board[row][col] = 0
		const cellKey = `${row}-${col}`
		delete newState.errors[cellKey]
		delete newState.notes[cellKey]
		newState.isCompleted = false

		this.gameState = newState
	}

	toggleNoteMode(): void {
		if (!this.gameState) return
		this.gameState = { ...this.gameState, noteMode: !this.gameState.noteMode }
	}

	setNoteMode(enabled: boolean): void {
		if (!this.gameState) return
		this.gameState = { ...this.gameState, noteMode: enabled }
	}

	pauseGame(): void {
		if (!this.gameState) return
		this.gameState = { ...this.gameState, isPaused: !this.gameState.isPaused }
	}

	resumeGame(): void {
		if (!this.gameState) return
		this.gameState = { ...this.gameState, isPaused: false }
	}

	undoMove(): boolean {
		if (!this.gameState) return false

		const previousState = this.history.undo()
		if (previousState) {
			// Create a completely new object with deep copies
			flushSync(() => {
				this.gameState = {
					board: previousState.board.map((row) => [...row]),
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
					endTime: previousState.endTime,
				}
			})
			return true
		}
		return false
	}
}
