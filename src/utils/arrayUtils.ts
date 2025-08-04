// Array utilities using es-toolkit
import { chunk, flatten, uniq, groupBy, partition, shuffle } from 'es-toolkit'

// Export es-toolkit functions for consistent usage
export { chunk, flatten, uniq, groupBy, partition, shuffle }

// Custom utilities specific to Sudoku
export const create2DArray = (rows: number, cols: number, fill: any = null) => {
	return Array.from({ length: rows }, () => Array(cols).fill(fill))
}

export const deepClone2DArray = <T>(arr: T[][]): T[][] => {
	return arr.map((row) => [...row])
}

export const countNonZero = (arr: number[]): number => {
	return arr.filter((cell) => cell !== 0).length
}

export const get3x3BoxIndex = (row: number, col: number): number => {
	return Math.floor(row / 3) * 3 + Math.floor(col / 3)
}

export const get3x3BoxCells = (boxIndex: number): Array<[number, number]> => {
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
