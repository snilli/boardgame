// Game State History - Single Responsibility Principle
import type { SudokuGameState } from '@app/domain/sudoku-game'
import type { IGameStateHistory } from './interfaces'
import { deepClone2DArray } from '@app/utils/arrayUtils'

export class GameStateHistory implements IGameStateHistory {
	private history: SudokuGameState[] = []
	private maxHistorySize: number
	private lastSaveTime = 0

	constructor(maxHistorySize = 20) {
		this.maxHistorySize = maxHistorySize
	}

	saveState(state: SudokuGameState): void {
		const now = Date.now()

		// Performance optimization: prevent saving too frequently (debounce 100ms)
		if (now - this.lastSaveTime < 100) {
			return
		}
		this.lastSaveTime = now

		// Performance optimization: only copy the essential game data
		const stateCopy: SudokuGameState = {
			board: deepClone2DArray(state.board),
			initialBoard: state.initialBoard, // No need to copy - it's immutable
			solution: state.solution, // No need to copy - it's immutable
			notes: { ...state.notes },
			errors: { ...state.errors },
			noteMode: state.noteMode,
			isCompleted: state.isCompleted,
			isPaused: state.isPaused,
			difficulty: state.difficulty,
			difficultyName: state.difficultyName,
			startTime: state.startTime,
			endTime: state.endTime,
		}

		this.history.push(stateCopy)

		// Keep only the last maxHistorySize states
		if (this.history.length > this.maxHistorySize) {
			this.history = this.history.slice(-this.maxHistorySize)
		}
	}

	undo(): SudokuGameState | null {
		if (this.history.length === 0) {
			return null
		}

		return this.history.pop() || null
	}

	clear(): void {
		this.history = []
		this.lastSaveTime = 0
	}

	canUndo(): boolean {
		return this.history.length > 0
	}

	getHistorySize(): number {
		return this.history.length
	}
}
