// UI State Manager - Single Responsibility Principle
import type { GameMode } from '@app/domain/sudoku-game'
import type { IUIStateManager } from './interfaces'

export class UIStateManager implements IUIStateManager {
	private selectedCell: { row: number; col: number } | null = null
	private highlightedNumber: number | null = null
	private gameMode: GameMode = 'start'

	getSelectedCell(): { row: number; col: number } | null {
		return this.selectedCell
	}

	getHighlightedNumber(): number | null {
		return this.highlightedNumber
	}

	getGameMode(): GameMode {
		return this.gameMode
	}

	setSelectedCell(cell: { row: number; col: number } | null): void {
		this.selectedCell = cell
	}

	setHighlightedNumber(number: number | null): void {
		this.highlightedNumber = number
	}

	setGameMode(mode: GameMode): void {
		this.gameMode = mode
	}

	// Utility methods for common UI interactions
	handleCellSelection(row: number, col: number, currentValue: number): void {
		// Toggle selection
		if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
			this.selectedCell = null
			this.highlightedNumber = null
		} else {
			this.selectedCell = { row, col }
			this.highlightedNumber = currentValue !== 0 ? currentValue : null
		}
	}

	clearSelection(): void {
		this.selectedCell = null
		this.highlightedNumber = null
	}

	resetToStart(): void {
		this.selectedCell = null
		this.highlightedNumber = null
		this.gameMode = 'start'
	}
}
