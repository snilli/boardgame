// Interfaces for SOLID compliance - Dependency Inversion Principle
import type { SudokuGameState, GameMode } from '@app/domain/sudoku-game'

export interface IGameController {
	getGameState(): SudokuGameState | null
	createNewGame(difficulty: string): void
	handleCellInput(row: number, col: number, value: number): void
	handleClearCell(row: number, col: number): void
	toggleNoteMode(): void
	setNoteMode(enabled: boolean): void
	pauseGame(): void
	resumeGame(): void
	undoMove(): boolean
}

export interface IUIStateManager {
	getSelectedCell(): { row: number; col: number } | null
	getHighlightedNumber(): number | null
	getGameMode(): GameMode
	setSelectedCell(cell: { row: number; col: number } | null): void
	setHighlightedNumber(number: number | null): void
	setGameMode(mode: GameMode): void
	handleCellSelection(row: number, col: number, currentValue: number): void
	clearSelection(): void
	resetToStart(): void
}

export interface IKeyboardService {
	initialize(callbacks: KeyboardCallbacks): void
	destroy(): void
}

export interface KeyboardCallbacks {
	onNumberInput: (number: number) => void
	onClearCell: () => void
	onUndo: () => void
	onToggleNotes: () => void
	onPause: () => void
}

export interface IGameStateHistory {
	saveState(state: SudokuGameState): void
	undo(): SudokuGameState | null
	clear(): void
	canUndo(): boolean
}
