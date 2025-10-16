// Domain Service - Pure business logic for Sudoku validation
import { SudokuGrid } from './SudokuGrid'

export interface CellPosition {
	row: number
	col: number
}

export interface ValidationResult {
	isValid: boolean
	conflicts: string[]
}

export class SudokuValidator {
	/**
	 * Get all cells that could be affected by changes at given position
	 * Returns row cells + column cells + box cells (deduplicated)
	 */
	static getAffectedCells(row: number, col: number, gridSize: number = 9): CellPosition[] {
		const cells: CellPosition[] = []
		const cellSet = new Set<string>()

		// Helper to add cells without duplicates
		const addCells = (cellList: Array<[number, number]>) => {
			cellList.forEach(([r, c]) => {
				const key = `${r}-${c}`
				if (!cellSet.has(key)) {
					cellSet.add(key)
					cells.push({ row: r, col: c })
				}
			})
		}

		// Add affected cells using domain service
		addCells(SudokuGrid.getRowCells(row, gridSize))
		addCells(SudokuGrid.getColumnCells(col, gridSize))

		// For 9x9 grid, use box cells
		if (gridSize === 9) {
			const boxIndex = SudokuGrid.getBoxIndex(row, col)
			addCells(SudokuGrid.getBoxCells(boxIndex))
		}

		return cells
	}

	/**
	 * Validate a single cell for conflicts
	 * Returns true if no conflicts, false if conflicts exist
	 */
	static validateCell(board: number[][], row: number, col: number): boolean {
		const value = board[row][col]
		if (value === 0) return true // Empty cells are always valid

		const gridSize = board.length

		// Check row conflicts
		for (let c = 0; c < gridSize; c++) {
			if (c !== col && board[row][c] === value) {
				return false
			}
		}

		// Check column conflicts
		for (let r = 0; r < gridSize; r++) {
			if (r !== row && board[r][col] === value) {
				return false
			}
		}

		// Check box conflicts
		const boxSize = Math.sqrt(gridSize)
		const boxStartRow = Math.floor(row / boxSize) * boxSize
		const boxStartCol = Math.floor(col / boxSize) * boxSize

		for (let r = boxStartRow; r < boxStartRow + boxSize; r++) {
			for (let c = boxStartCol; c < boxStartCol + boxSize; c++) {
				if ((r !== row || c !== col) && board[r][c] === value) {
					return false
				}
			}
		}

		return true
	}

	/**
	 * Find all cells that have conflicts in the affected area
	 * More efficient than validating entire board
	 */
	static findConflictsInAffectedCells(board: number[][], changedRow: number, changedCol: number): string[] {
		const affectedCells = this.getAffectedCells(changedRow, changedCol, board.length)
		const conflictCells: string[] = []

		for (const cell of affectedCells) {
			if (!this.validateCell(board, cell.row, cell.col)) {
				conflictCells.push(`${cell.row}-${cell.col}`)
			}
		}

		return conflictCells
	}

	/**
	 * Validate entire board (used for initial validation or full recalculation)
	 */
	static validateBoard(board: number[][]): ValidationResult {
		const conflicts: string[] = []
		const gridSize = board.length

		for (let r = 0; r < gridSize; r++) {
			for (let c = 0; c < gridSize; c++) {
				if (!this.validateCell(board, r, c)) {
					conflicts.push(`${r}-${c}`)
				}
			}
		}

		return {
			isValid: conflicts.length === 0,
			conflicts,
		}
	}
}
