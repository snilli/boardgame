export class UnsolvableSudoku extends Error {
	constructor(message?: string) {
		super(message)
		this.name = 'UnsolvableSudoku'
	}
}

class SudokuSolver {
	private width: number
	private height: number
	private size: number
	private sudoku: SudokuAdvanced

	constructor(sudoku: SudokuAdvanced) {
		this.width = sudoku.width
		this.height = sudoku.height
		this.size = sudoku.size
		this.sudoku = sudoku
	}

	solve(): SudokuAdvanced | null {
		const blanks = this.getBlanks()
		const blankCount = blanks.length
		const areBlanksFilled = new Array(blankCount).fill(false)
		const blankFillers = this.calculateBlankCellFillers(blanks)
		const solutionBoard = this.getSolution(
			SudokuAdvanced.copyBoard(this.sudoku.board),
			blanks,
			blankFillers,
			areBlanksFilled,
		)

		if (!solutionBoard) {
			return null
		}

		return new SudokuAdvanced(this.width, this.height, solutionBoard, 0)
	}

	hasMultipleSolutions(): boolean {
		const blanks = this.getBlanks()
		const blankCount = blanks.length
		const areBlanksFilled1 = new Array(blankCount).fill(false)
		const blankFillers1 = this.calculateBlankCellFillers(blanks)
		const solutionBoard1 = this.getSolution(
			SudokuAdvanced.copyBoard(this.sudoku.board),
			blanks,
			blankFillers1,
			areBlanksFilled1,
		)

		const areBlanksFilled2 = new Array(blankCount).fill(false)
		const blankFillers2 = this.calculateBlankCellFillers(blanks)
		const solutionBoard2 = this.getSolution(
			SudokuAdvanced.copyBoard(this.sudoku.board),
			blanks,
			blankFillers2,
			areBlanksFilled2,
			true,
		)

		if (!solutionBoard1) {
			return false
		}

		return JSON.stringify(solutionBoard1) !== JSON.stringify(solutionBoard2)
	}

	private calculateBlankCellFillers(blanks: [number, number][]): boolean[][][] {
		const validFillers: boolean[][][] = Array(this.size)
			.fill(null)
			.map(() =>
				Array(this.size)
					.fill(null)
					.map(() => Array(this.size).fill(true)),
			)

		for (const [row, col] of blanks) {
			for (let i = 0; i < this.size; i++) {
				const sameRow = this.sudoku.board[row][i]
				const sameCol = this.sudoku.board[i][col]

				if (sameRow && i !== col) {
					validFillers[row][col][sameRow - 1] = false
				}
				if (sameCol && i !== row) {
					validFillers[row][col][sameCol - 1] = false
				}
			}

			const gridRow = Math.floor(row / this.height)
			const gridCol = Math.floor(col / this.width)
			const gridRowStart = gridRow * this.height
			const gridColStart = gridCol * this.width

			for (let yOffset = 0; yOffset < this.height; yOffset++) {
				for (let xOffset = 0; xOffset < this.width; xOffset++) {
					if (gridRowStart + yOffset === row && gridColStart + xOffset === col) {
						continue
					}
					const cell = this.sudoku.board[gridRowStart + yOffset][gridColStart + xOffset]
					if (cell) {
						validFillers[row][col][cell - 1] = false
					}
				}
			}
		}

		return validFillers
	}

	private getBlanks(): [number, number][] {
		const blanks: [number, number][] = []
		for (let i = 0; i < this.sudoku.board.length; i++) {
			for (let j = 0; j < this.sudoku.board[i].length; j++) {
				if (this.sudoku.board[i][j] === null) {
					blanks.push([i, j])
				}
			}
		}
		return blanks
	}

	private isNeighbor(blank1: [number, number], blank2: [number, number]): boolean {
		const [row1, col1] = blank1
		const [row2, col2] = blank2

		if (row1 === row2 || col1 === col2) {
			return true
		}

		const gridRow1 = Math.floor(row1 / this.height)
		const gridCol1 = Math.floor(col1 / this.width)
		const gridRow2 = Math.floor(row2 / this.height)
		const gridCol2 = Math.floor(col2 / this.width)

		return gridRow1 === gridRow2 && gridCol1 === gridCol2
	}

	private getSolution(
		board: (number | null)[][],
		blanks: [number, number][],
		blankFillers: boolean[][][],
		areBlanksFilled: boolean[],
		reverse = false,
	): number[][] | null {
		let minFillerCount: number | null = null
		let chosenBlank: [number, number] | null = null
		let chosenBlankIndex = -1

		for (let i = 0; i < blanks.length; i++) {
			const [x, y] = blanks[i]
			if (areBlanksFilled[i]) {
				continue
			}

			const validFillerCount = blankFillers[x][y].reduce((sum, valid) => sum + (valid ? 1 : 0), 0)

			if (validFillerCount === 0) {
				return null
			}

			if (minFillerCount === null || validFillerCount < minFillerCount) {
				minFillerCount = validFillerCount
				chosenBlank = blanks[i]
				chosenBlankIndex = i
			}
		}

		if (!chosenBlank) {
			return board as number[][]
		}

		const [row, col] = chosenBlank
		areBlanksFilled[chosenBlankIndex] = true

		const revertList = new Array(blanks.length).fill(false)

		const numberRange = reverse
			? Array.from({ length: this.size }, (_, i) => this.size - 1 - i)
			: Array.from({ length: this.size }, (_, i) => i)

		for (const number of numberRange) {
			if (!blankFillers[row][col][number]) {
				continue
			}

			board[row][col] = number + 1

			for (let i = 0; i < blanks.length; i++) {
				const [blankRow, blankCol] = blanks[i]
				if (blanks[i] === chosenBlank) {
					continue
				}

				if (this.isNeighbor(blanks[i], chosenBlank) && blankFillers[blankRow][blankCol][number]) {
					blankFillers[blankRow][blankCol][number] = false
					revertList[i] = true
				} else {
					revertList[i] = false
				}
			}

			const solutionBoard = this.getSolution(board, blanks, blankFillers, areBlanksFilled, reverse)

			if (solutionBoard) {
				return solutionBoard
			}

			for (let i = 0; i < blanks.length; i++) {
				if (revertList[i]) {
					const [blankRow, blankCol] = blanks[i]
					blankFillers[blankRow][blankCol][number] = true
				}
			}
		}

		areBlanksFilled[chosenBlankIndex] = false
		board[row][col] = null

		return null
	}
}

export class SudokuAdvanced {
	public width: number
	public height: number
	public size: number
	public board: (number | null)[][]
	private difficulty: number

	constructor(width = 3, height?: number, board?: (number | null)[][], difficulty?: number, seed?: number) {
		this.width = width
		this.height = height ?? width
		this.size = this.width * this.height

		if (this.width <= 0) throw new Error('Width cannot be less than 1')
		if (this.height <= 0) throw new Error('Height cannot be less than 1')
		if (this.size <= 1) throw new Error('Board size cannot be 1 x 1')

		this.difficulty = difficulty ?? 0

		if (board) {
			let blankCount = 0
			this.board = board.map((row) =>
				row.map((cell) => {
					if (!cell || cell < 1 || cell > this.size) {
						blankCount++
						return null
					}
					return cell
				}),
			)

			if (difficulty === undefined) {
				if (this.validate()) {
					this.difficulty = blankCount / (this.size * this.size)
				} else {
					this.difficulty = -2
				}
			}
		} else {
			// Generate initial board with one valid number per row
			this.board = Array(this.size)
				.fill(null)
				.map((_, j) =>
					Array(this.size)
						.fill(null)
						.map((_, i) => (i === j % this.size ? j + 1 : null)),
				)

			// Shuffle for randomness if seed is provided
			if (seed !== undefined) {
				this.shuffleBoard(seed)
			}
		}
	}

	private shuffleBoard(seed: number): void {
		// Simple seeded random number generator
		let random = seed
		const nextRandom = () => {
			random = (random * 9301 + 49297) % 233280
			return random / 233280
		}

		// Fisher-Yates shuffle on the diagonal
		for (let i = this.size - 1; i > 0; i--) {
			const j = Math.floor(nextRandom() * (i + 1))
			if (this.board[i][i] !== null && this.board[j][j] !== null) {
				;[this.board[i][i], this.board[j][j]] = [this.board[j][j], this.board[i][i]]
			}
		}
	}

	solve(assertSolvable = false): SudokuAdvanced {
		const solution = this.validate() ? new SudokuSolver(this).solve() : null

		if (solution) {
			return solution
		}

		if (assertSolvable) {
			throw new UnsolvableSudoku('No solution found')
		}

		const emptyBoard = Array(this.size)
			.fill(null)
			.map(() => Array(this.size).fill(null))
		return new SudokuAdvanced(this.width, this.height, emptyBoard, -2)
	}

	hasMultipleSolutions(): boolean {
		return new SudokuSolver(this).hasMultipleSolutions()
	}

	validate(): boolean {
		const rowNumbers = Array(this.size)
			.fill(null)
			.map(() => Array(this.size).fill(false))
		const colNumbers = Array(this.size)
			.fill(null)
			.map(() => Array(this.size).fill(false))
		const boxNumbers = Array(this.size)
			.fill(null)
			.map(() => Array(this.size).fill(false))

		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				const cell = this.board[row][col]
				const box = Math.floor(row / this.height) * this.height + Math.floor(col / this.width)

				if (cell === null) {
					continue
				}

				if (typeof cell === 'number') {
					if (rowNumbers[row][cell - 1] || colNumbers[col][cell - 1] || boxNumbers[box][cell - 1]) {
						return false
					}

					rowNumbers[row][cell - 1] = true
					colNumbers[col][cell - 1] = true
					boxNumbers[box][cell - 1] = true
				}
			}
		}

		return true
	}

	static copyBoard(board: (number | null)[][]): (number | null)[][] {
		return board.map((row) => [...row])
	}

	static empty(width: number, height: number): SudokuAdvanced {
		const size = width * height
		const board = Array(size)
			.fill(null)
			.map(() => Array(size).fill(null))
		return new SudokuAdvanced(width, height, board, 0)
	}

	setDifficulty(difficulty: number): SudokuAdvanced {
		if (difficulty <= 0 || difficulty >= 1) {
			throw new Error('Difficulty must be between 0 and 1')
		}

		const indices = Array.from({ length: this.size * this.size }, (_, i) => i)

		// Shuffle indices
		for (let i = indices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[indices[i], indices[j]] = [indices[j], indices[i]]
		}

		const problemBoard = SudokuAdvanced.copyBoard(this.solve().board)
		const cellsToRemove = Math.floor(difficulty * this.size * this.size)

		for (let i = 0; i < cellsToRemove; i++) {
			const index = indices[i]
			const rowIndex = Math.floor(index / this.size)
			const colIndex = index % this.size
			problemBoard[rowIndex][colIndex] = null
		}

		const puzzle = new SudokuAdvanced(this.width, this.height, problemBoard, difficulty)

		// Check for multiple solutions
		if (puzzle.hasMultipleSolutions()) {
			return new SudokuAdvanced(this.width, this.height, problemBoard, -3)
		}

		return puzzle
	}

	getDifficulty(): number {
		return this.difficulty
	}

	// Convert to the format expected by our game
	toGameFormat(): {
		board: number[][]
		solution: number[][]
		initialBoard: number[][]
	} {
		const solved = this.solve()

		const gameBoard = this.board.map((row) => row.map((cell) => cell ?? 0))

		const gameSolution = solved.board.map((row) => row.map((cell) => cell ?? 0))

		return {
			board: gameBoard,
			solution: gameSolution,
			initialBoard: SudokuAdvanced.copyBoard(gameBoard) as number[][],
		}
	}
}
