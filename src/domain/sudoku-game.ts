import { SudokuAdvanced } from '@app/domain/sudoku-advanced'
import { createRandomPuzzle } from '@app/patterns/PuzzleFactory'

export const getPossibleValues = (board: number[][], row: number, col: number): number[] => {
	if (board[row][col] !== 0) {
		return []
	}

	const used = new Set<number>()

	for (let i = 0; i < 9; i++) {
		if (board[row][i] !== 0) used.add(board[row][i])
		if (board[i][col] !== 0) used.add(board[i][col])
	}

	const boxStartRow = Math.floor(row / 3) * 3
	const boxStartCol = Math.floor(col / 3) * 3
	for (let i = boxStartRow; i < boxStartRow + 3; i++) {
		for (let j = boxStartCol; j < boxStartCol + 3; j++) {
			if (board[i][j] !== 0) used.add(board[i][j])
		}
	}

	const possible: number[] = []
	for (let num = 1; num <= 9; num++) {
		if (!used.has(num)) {
			possible.push(num)
		}
	}

	return possible
}

export interface SudokuGameState {
	board: number[][]
	initialBoard: number[][]
	solution: number[][]
	isCompleted: boolean
	difficulty: number
	difficultyName: string
	errors: { [key: string]: boolean }
	notes: { [key: string]: number[] }
	noteMode: boolean
	startTime: number
	endTime?: number
	isPaused: boolean
}

export type GameMode = 'start' | 'difficulty-select' | 'playing' | 'completed' | 'paused'

export const createInitialGameState = (difficulty?: string | number, seed?: number): SudokuGameState => {
	const difficultyToUse = difficulty ?? 'easy'

	let puzzleConfig
	if (typeof difficultyToUse === 'string') {
		puzzleConfig = createRandomPuzzle(difficultyToUse)
	} else {
		const sudoku = new SudokuAdvanced(3, 3, undefined, undefined, seed)
		const puzzle = sudoku.solve().setDifficulty(difficultyToUse)
		const { board, solution } = puzzle.toGameFormat()
		puzzleConfig = {
			board,
			solution,
			initialBoard: board.map((row: number[]) => [...row]),
			difficulty: difficultyToUse,
			difficultyName: `${Math.round(difficultyToUse * 100)}%`,
		}
	}

	return {
		board: puzzleConfig.board.map((row: number[]) => [...row]),
		initialBoard: puzzleConfig.initialBoard.map((row: number[]) => [...row]),
		solution: puzzleConfig.solution,
		isCompleted: false,
		difficulty: puzzleConfig.difficulty,
		difficultyName: puzzleConfig.difficultyName,
		errors: {},
		notes: {},
		noteMode: false,
		startTime: Date.now(),
		isPaused: false,
	}
}
