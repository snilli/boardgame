// Domain Service - Single Responsibility for Sudoku grid operations
import { range } from '@app/utils/toolkit'

export class SudokuGrid {
	/**
	 * Create empty Sudoku board
	 */
	static createBoard(size: number = 9): number[][] {
		return range(0, size).map(() => Array(size).fill(0))
	}

	/**
	 * Count non-zero cells in board
	 */
	static countFilledCells(board: number[][]): number {
		return board.flat().filter((cell) => cell !== 0).length
	}

	/**
	 * Get 3x3 box index for given coordinates
	 */
	static getBoxIndex(row: number, col: number): number {
		return Math.floor(row / 3) * 3 + Math.floor(col / 3)
	}

	/**
	 * Get all cell positions in a 3x3 box
	 */
	static getBoxCells(boxIndex: number): Array<[number, number]> {
		const boxRow = Math.floor(boxIndex / 3) * 3
		const boxCol = (boxIndex % 3) * 3
		const cells: Array<[number, number]> = []

		for (let r = boxRow; r < boxRow + 3; r++) {
			for (let c = boxCol; c < boxCol + 3; c++) {
				cells.push([r, c])
			}
		}
		return cells
	}

	/**
	 * Get row cells
	 */
	static getRowCells(row: number, size: number = 9): Array<[number, number]> {
		return range(0, size).map((col) => [row, col] as [number, number])
	}

	/**
	 * Get column cells
	 */
	static getColumnCells(col: number, size: number = 9): Array<[number, number]> {
		return range(0, size).map((row) => [row, col] as [number, number])
	}
}
