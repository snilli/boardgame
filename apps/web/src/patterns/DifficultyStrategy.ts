import { SudokuAdvanced } from '@app/domain/sudoku-advanced'
import { mean, clamp } from '@app/utils/toolkit'

// Strategy interface
export interface DifficultyStrategy {
	calculateDifficulty(board: number[][]): number
	getName(): string
	getDescription(): string
	getMinClues(): number
	getMaxClues(): number
	shouldRetry(attempts: number, puzzle: SudokuAdvanced): boolean
	adjustPuzzle?(puzzle: SudokuAdvanced): SudokuAdvanced
}

// Difficulty calculation context
export interface DifficultyMetrics {
	clueCount: number
	emptyCount: number
	symmetryScore: number
	regionDistribution: number
	solvingTechniques: string[]
	estimatedTime: number
}

// Abstract base strategy
abstract class BaseDifficultyStrategy implements DifficultyStrategy {
	abstract calculateDifficulty(board: number[][]): number
	abstract getName(): string
	abstract getDescription(): string
	abstract getMinClues(): number
	abstract getMaxClues(): number

	// Default implementation - subclasses override for puzzle-specific logic
	shouldRetry(attempts: number, _puzzle: SudokuAdvanced): boolean {
		return attempts < 10
	}

	// Helper methods
	protected calculateClueCount(board: number[][]): number {
		return board.flat().filter((cell) => cell !== 0).length
	}

	protected calculateSymmetryScore(board: number[][]): number {
		let symmetryScore = 0
		const size = board.length

		// Check rotational symmetry
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const opposite = board[size - 1 - i][size - 1 - j]
				if ((board[i][j] !== 0) === (opposite !== 0)) {
					symmetryScore++
				}
			}
		}

		return symmetryScore / (size * size)
	}

	protected calculateRegionDistribution(board: number[][]): number {
		const regions = Array(9).fill(0)

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (board[i][j] !== 0) {
					const region = Math.floor(i / 3) * 3 + Math.floor(j / 3)
					regions[region]++
				}
			}
		}

		// Calculate variance (lower variance = better distribution)
		const avgClues = mean(regions)
		const variance = regions.reduce((sum, clues) => sum + Math.pow(clues - avgClues, 2), 0) / regions.length

		return 1 / (1 + variance) // Normalize to 0-1 range
	}
}

// Concrete Strategies
export class BeginnerStrategy extends BaseDifficultyStrategy {
	calculateDifficulty(board: number[][]): number {
		const clueCount = this.calculateClueCount(board)
		const targetClues = 45 // High number of clues for beginners

		// Simple calculation based on clue count
		const clueRatio = clamp(clueCount / targetClues, 0, 1)
		return 0.3 + clueRatio * 0.3 // 0.3 - 0.6 range
	}

	getName(): string {
		return 'Beginner'
	}

	getDescription(): string {
		return 'Lots of clues, simple solving techniques only'
	}

	getMinClues(): number {
		return 40
	}

	getMaxClues(): number {
		return 50
	}

	shouldRetry(attempts: number, puzzle: SudokuAdvanced): boolean {
		// Retry if puzzle has too few clues
		const clueCount = this.calculateClueCount(puzzle.board as number[][])
		return attempts < 15 && clueCount < this.getMinClues()
	}
}

export class IntermediateStrategy extends BaseDifficultyStrategy {
	calculateDifficulty(board: number[][]): number {
		const clueCount = this.calculateClueCount(board)
		const symmetryScore = this.calculateSymmetryScore(board)
		const regionDistribution = this.calculateRegionDistribution(board)

		// Weighted calculation
		const clueWeight = 0.6
		const symmetryWeight = 0.2
		const distributionWeight = 0.2

		const clueRatio = 1 - clueCount / 50 // Fewer clues = higher difficulty

		const difficulty =
			clueRatio * clueWeight + symmetryScore * symmetryWeight + regionDistribution * distributionWeight

		return 0.5 + difficulty * 0.25 // 0.5 - 0.75 range
	}

	getName(): string {
		return 'Intermediate'
	}

	getDescription(): string {
		return 'Moderate clues, requires some advanced techniques'
	}

	getMinClues(): number {
		return 30
	}

	getMaxClues(): number {
		return 40
	}

	shouldRetry(attempts: number, puzzle: SudokuAdvanced): boolean {
		const clueCount = this.calculateClueCount(puzzle.board as number[][])
		return attempts < 12 && (clueCount < this.getMinClues() || clueCount > this.getMaxClues())
	}
}

export class AdvancedStrategy extends BaseDifficultyStrategy {
	calculateDifficulty(board: number[][]): number {
		const clueCount = this.calculateClueCount(board)
		const symmetryScore = this.calculateSymmetryScore(board)
		const regionDistribution = this.calculateRegionDistribution(board)

		// More complex calculation for advanced puzzles
		const clueWeight = 0.5
		const symmetryWeight = 0.3
		const distributionWeight = 0.2

		const clueRatio = 1 - clueCount / 35 // Even fewer clues
		const complexityBonus = this.calculateComplexityBonus(board)

		const difficulty =
			clueRatio * clueWeight +
			symmetryScore * symmetryWeight +
			regionDistribution * distributionWeight +
			complexityBonus

		return 0.65 + difficulty * 0.2 // 0.65 - 0.85 range
	}

	private calculateComplexityBonus(board: number[][]): number {
		// Check for patterns that make puzzles harder
		let complexity = 0

		// Bonus for fewer clues in center region
		let centerClues = 0
		for (let i = 3; i < 6; i++) {
			for (let j = 3; j < 6; j++) {
				if (board[i][j] !== 0) centerClues++
			}
		}
		if (centerClues < 3) complexity += 0.1

		// Bonus for asymmetric distribution
		const symmetryScore = this.calculateSymmetryScore(board)
		if (symmetryScore < 0.7) complexity += 0.05

		return clamp(complexity, 0, 0.15)
	}

	getName(): string {
		return 'Advanced'
	}

	getDescription(): string {
		return 'Few clues, requires advanced solving techniques'
	}

	getMinClues(): number {
		return 25
	}

	getMaxClues(): number {
		return 32
	}

	shouldRetry(attempts: number, puzzle: SudokuAdvanced): boolean {
		const clueCount = this.calculateClueCount(puzzle.board as number[][])
		return attempts < 20 && (clueCount < this.getMinClues() || clueCount > this.getMaxClues())
	}
}

export class ExpertStrategy extends BaseDifficultyStrategy {
	calculateDifficulty(board: number[][]): number {
		const clueCount = this.calculateClueCount(board)
		const symmetryScore = this.calculateSymmetryScore(board)
		const regionDistribution = this.calculateRegionDistribution(board)
		const expertComplexity = this.calculateExpertComplexity(board)

		// Expert calculation emphasizes complexity over clue count
		const clueWeight = 0.3
		const symmetryWeight = 0.2
		const distributionWeight = 0.2
		const complexityWeight = 0.3

		const clueRatio = 1 - clueCount / 30

		const difficulty =
			clueRatio * clueWeight +
			symmetryScore * symmetryWeight +
			regionDistribution * distributionWeight +
			expertComplexity * complexityWeight

		return 0.75 + difficulty * 0.25 // 0.75 - 1.0 range
	}

	private calculateExpertComplexity(board: number[][]): number {
		let complexity = 0

		// Check for difficult patterns
		complexity += this.checkForNakedSingles()
		complexity += this.checkForHiddenSingles()
		complexity += this.checkForIsolatedClues(board)

		return clamp(complexity, 0, 1.0)
	}

	private checkForNakedSingles(): number {
		// Count cells that can only have one value (harder to spot)
		const nakedSingles = 0
		// Simplified implementation
		return clamp(nakedSingles / 10, 0, 0.3)
	}

	private checkForHiddenSingles(): number {
		// Count hidden singles in regions
		return 0.2 // Simplified
	}

	private checkForIsolatedClues(board: number[][]): number {
		// Bonus for clues that are isolated from others
		let isolatedCount = 0

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (board[i][j] !== 0) {
					let neighbors = 0
					// Check adjacent cells
					for (let di = -1; di <= 1; di++) {
						for (let dj = -1; dj <= 1; dj++) {
							const ni = i + di,
								nj = j + dj
							if (ni >= 0 && ni < 9 && nj >= 0 && nj < 9 && board[ni][nj] !== 0) {
								neighbors++
							}
						}
					}
					if (neighbors <= 2) isolatedCount++ // Isolated if few neighbors
				}
			}
		}

		return clamp(isolatedCount / 15, 0, 0.3)
	}

	getName(): string {
		return 'Expert'
	}

	getDescription(): string {
		return 'Minimal clues, requires expert-level techniques'
	}

	getMinClues(): number {
		return 17 // Theoretical minimum for unique solution
	}

	getMaxClues(): number {
		return 25
	}

	shouldRetry(attempts: number, puzzle: SudokuAdvanced): boolean {
		const clueCount = this.calculateClueCount(puzzle.board as number[][])
		// More aggressive retry for expert puzzles
		return attempts < 25 && (clueCount < this.getMinClues() || clueCount > this.getMaxClues())
	}

	adjustPuzzle(puzzle: SudokuAdvanced): SudokuAdvanced {
		// Expert puzzles might need additional adjustment
		// Could implement techniques to remove symmetrical clues
		return puzzle
	}
}

// Strategy Context
export class DifficultyContext {
	private strategy: DifficultyStrategy

	constructor(strategy: DifficultyStrategy) {
		this.strategy = strategy
	}

	setStrategy(strategy: DifficultyStrategy): void {
		this.strategy = strategy
	}

	calculateDifficulty(board: number[][]): number {
		return this.strategy.calculateDifficulty(board)
	}

	shouldRetry(attempts: number, puzzle: SudokuAdvanced): boolean {
		return this.strategy.shouldRetry(attempts, puzzle)
	}

	getStrategyInfo(): { name: string; description: string; minClues: number; maxClues: number } {
		return {
			name: this.strategy.getName(),
			description: this.strategy.getDescription(),
			minClues: this.strategy.getMinClues(),
			maxClues: this.strategy.getMaxClues(),
		}
	}
}

// Strategy Registry
export class StrategyRegistry {
	private static strategies: Map<string, DifficultyStrategy> = new Map([
		['beginner', new BeginnerStrategy()],
		['intermediate', new IntermediateStrategy()],
		['advanced', new AdvancedStrategy()],
		['expert', new ExpertStrategy()],
	])

	static getStrategy(name: string): DifficultyStrategy {
		const strategy = this.strategies.get(name.toLowerCase())
		if (!strategy) {
			throw new Error(`Unknown strategy: ${name}`)
		}
		return strategy
	}

	static getAllStrategies(): Array<{ key: string; strategy: DifficultyStrategy }> {
		return Array.from(this.strategies.entries()).map(([key, strategy]) => ({
			key,
			strategy,
		}))
	}

	static registerStrategy(name: string, strategy: DifficultyStrategy): void {
		this.strategies.set(name.toLowerCase(), strategy)
	}
}
