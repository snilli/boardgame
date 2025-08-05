import type { SudokuGameState, GameMode } from '@app/domain/sudoku-game'

export interface GameFlowService {
	// Pure business logic - no UI concerns
	canPerformAction(gameState: SudokuGameState): boolean
	canPlaceNumber(gameState: SudokuGameState, row: number, col: number): boolean
	canClearCell(gameState: SudokuGameState, row: number, col: number): boolean
	canUndo(gameState: SudokuGameState): boolean
	canToggleNotes(gameState: SudokuGameState): boolean
	canPause(gameState: SudokuGameState): boolean

	// Game state validation
	isGameActive(gameState: SudokuGameState): boolean
	isGamePaused(gameState: SudokuGameState): boolean
	isGameCompleted(gameState: SudokuGameState): boolean

	// Action validation with reasons
	validateCellAction(
		gameState: SudokuGameState,
		row: number,
		col: number,
	): {
		canPlace: boolean
		canClear: boolean
		reason?: string
	}
}

export class GameFlowServiceImpl implements GameFlowService {
	canPerformAction(gameState: SudokuGameState): boolean {
		return this.isGameActive(gameState)
	}

	canPlaceNumber(gameState: SudokuGameState, row: number, col: number): boolean {
		if (!this.isGameActive(gameState)) return false

		// Can't modify initial clues
		if (gameState.initialBoard[row][col] !== 0) return false

		return true
	}

	canClearCell(gameState: SudokuGameState, row: number, col: number): boolean {
		if (!this.isGameActive(gameState)) return false

		// Can't clear initial clues
		if (gameState.initialBoard[row][col] !== 0) return false

		// Must have something to clear
		const cellKey = `${row}-${col}`
		return gameState.board[row][col] !== 0 || !!gameState.notes[cellKey]?.length
	}

	canUndo(gameState: SudokuGameState): boolean {
		// Undo is handled by gameStore.history, not in gameState
		// This service just checks if game is active for undo
		return this.isGameActive(gameState)
	}

	canToggleNotes(gameState: SudokuGameState): boolean {
		return this.isGameActive(gameState)
	}

	canPause(gameState: SudokuGameState): boolean {
		return !gameState.isCompleted
	}

	isGameActive(gameState: SudokuGameState): boolean {
		return !gameState.isPaused && !gameState.isCompleted
	}

	isGamePaused(gameState: SudokuGameState): boolean {
		return gameState.isPaused
	}

	isGameCompleted(gameState: SudokuGameState): boolean {
		return gameState.isCompleted
	}

	validateCellAction(
		gameState: SudokuGameState,
		row: number,
		col: number,
	): {
		canPlace: boolean
		canClear: boolean
		reason?: string
	} {
		if (!this.canPerformAction(gameState)) {
			const reason = gameState.isPaused ? 'Game is paused' : 'Game is completed'
			return { canPlace: false, canClear: false, reason }
		}

		if (gameState.initialBoard[row][col] !== 0) {
			return {
				canPlace: false,
				canClear: false,
				reason: 'Cannot modify initial clues',
			}
		}

		const cellKey = `${row}-${col}`
		const hasContent = gameState.board[row][col] !== 0 || !!gameState.notes[cellKey]?.length

		return {
			canPlace: true,
			canClear: hasContent,
		}
	}
}
