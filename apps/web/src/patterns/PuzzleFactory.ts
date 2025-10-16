import { SudokuAdvanced } from '@app/domain/sudoku-advanced'
import { DifficultyContext, StrategyRegistry } from '@app/patterns/DifficultyStrategy'
import { random } from '@app/utils/toolkit'

// Product interface
export interface PuzzleConfig {
	board: number[][]
	solution: number[][]
	initialBoard: number[][]
	difficulty: number
	difficultyName: string
	seed?: number
}

// Abstract Factory
export abstract class PuzzleFactory {
	protected difficultyContext: DifficultyContext

	constructor(strategyName: string) {
		const strategy = StrategyRegistry.getStrategy(strategyName)
		this.difficultyContext = new DifficultyContext(strategy)
	}

	abstract createPuzzle(seed?: number): PuzzleConfig
	abstract getDifficultyName(): string
	abstract getDifficultyValue(): number
	abstract getColor(): string // For UI styling

	protected createPuzzleWithStrategy(seed?: number, targetDifficulty?: number): PuzzleConfig {
		let attempts = 0
		let bestPuzzle: SudokuAdvanced | null = null
		let bestDifficulty = 0

		do {
			attempts++
			const sudoku = new SudokuAdvanced(3, 3, undefined, undefined, seed)
			const solvedSudoku = sudoku.solve()

			if (!targetDifficulty) {
				// Use strategy's default range
				const strategyInfo = this.difficultyContext.getStrategyInfo()
				const minDiff = strategyInfo.minClues / 81 // Normalize
				const maxDiff = strategyInfo.maxClues / 81
				targetDifficulty = (minDiff + maxDiff) / 2
			}

			const puzzle = solvedSudoku.setDifficulty(targetDifficulty)
			const { board } = puzzle.toGameFormat()

			// Use strategy to calculate actual difficulty
			const actualDifficulty = this.difficultyContext.calculateDifficulty(board)

			if (
				!bestPuzzle ||
				Math.abs(actualDifficulty - targetDifficulty) < Math.abs(bestDifficulty - targetDifficulty)
			) {
				bestPuzzle = puzzle
				bestDifficulty = actualDifficulty
			}
		} while (this.difficultyContext.shouldRetry(attempts, bestPuzzle!) && attempts < 30)

		if (!bestPuzzle) {
			// Fallback to simple generation
			const sudoku = new SudokuAdvanced(3, 3, undefined, undefined, seed)
			bestPuzzle = sudoku.solve().setDifficulty(targetDifficulty || 0.6)
			bestDifficulty = targetDifficulty || 0.6
		}

		const { board, solution } = bestPuzzle.toGameFormat()

		return {
			board,
			solution,
			initialBoard: board.map((row) => [...row]),
			difficulty: bestDifficulty,
			difficultyName: this.getDifficultyName(),
			seed,
		}
	}
}

// Concrete Factories
export class EasyPuzzleFactory extends PuzzleFactory {
	constructor() {
		super('beginner')
	}

	createPuzzle(seed?: number): PuzzleConfig {
		return this.createPuzzleWithStrategy(seed, 0.6)
	}

	getDifficultyName(): string {
		return 'Easy'
	}

	getDifficultyValue(): number {
		return 0.6
	}

	getColor(): string {
		return 'green' // For button styling
	}
}

export class MediumPuzzleFactory extends PuzzleFactory {
	constructor() {
		super('intermediate')
	}

	createPuzzle(seed?: number): PuzzleConfig {
		return this.createPuzzleWithStrategy(seed, 0.67)
	}

	getDifficultyName(): string {
		return 'Medium'
	}

	getDifficultyValue(): number {
		return 0.67
	}

	getColor(): string {
		return 'orange'
	}
}

export class HardPuzzleFactory extends PuzzleFactory {
	constructor() {
		super('advanced')
	}

	createPuzzle(seed?: number): PuzzleConfig {
		return this.createPuzzleWithStrategy(seed, 0.75)
	}

	getDifficultyName(): string {
		return 'Hard'
	}

	getDifficultyValue(): number {
		return 0.75
	}

	getColor(): string {
		return 'red'
	}
}

export class ExpertPuzzleFactory extends PuzzleFactory {
	constructor() {
		super('expert')
	}

	createPuzzle(seed?: number): PuzzleConfig {
		return this.createPuzzleWithStrategy(seed, 0.8)
	}

	getDifficultyName(): string {
		return 'Expert'
	}

	getDifficultyValue(): number {
		return 0.8
	}

	getColor(): string {
		return 'purple'
	}
}

// Factory Registry (Simple Factory + Registry Pattern)
export class PuzzleFactoryRegistry {
	private static factories: Map<string, PuzzleFactory> = new Map([
		['easy', new EasyPuzzleFactory()],
		['medium', new MediumPuzzleFactory()],
		['hard', new HardPuzzleFactory()],
		['expert', new ExpertPuzzleFactory()],
	])

	static getFactory(difficulty: string): PuzzleFactory {
		const factory = this.factories.get(difficulty.toLowerCase())
		if (!factory) {
			throw new Error(`Unknown difficulty: ${difficulty}`)
		}
		return factory
	}

	static getAllFactories(): Array<{ key: string; factory: PuzzleFactory }> {
		return Array.from(this.factories.entries()).map(([key, factory]) => ({
			key,
			factory,
		}))
	}

	static registerFactory(difficulty: string, factory: PuzzleFactory): void {
		this.factories.set(difficulty.toLowerCase(), factory)
	}

	static getDifficultyNames(): string[] {
		return Array.from(this.factories.keys())
	}
}

// Convenience functions
export function createPuzzle(difficulty: string, seed?: number): PuzzleConfig {
	const factory = PuzzleFactoryRegistry.getFactory(difficulty)
	return factory.createPuzzle(seed)
}

export function createRandomPuzzle(difficulty: string): PuzzleConfig {
	const seed = random(1, 1000000)
	return createPuzzle(difficulty, seed)
}
