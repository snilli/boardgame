import type { SudokuGameState } from '@app/domain/sudoku-game'

// State interface
export interface GameState {
	enter(context: GameContext): void
	exit(context?: GameContext): void
	handleInput(context: GameContext, input: GameInput): void
	canPlaceNumber(context?: GameContext): boolean
	canToggleNote(context?: GameContext): boolean
	canUndo(context?: GameContext): boolean
	getStateName(): string
	getStateColor(): string
	getStateMessage(): string
}

// Game input types
export interface GameInput {
	type: 'NUMBER' | 'CLEAR' | 'NOTE' | 'UNDO' | 'REDO' | 'NEW_GAME' | 'PAUSE' | 'RESUME'
	data?: unknown
}

// Context that manages states
export class GameContext {
	private currentState: GameState
	private gameState: SudokuGameState
	private isPaused: boolean = false
	private startTime: number = Date.now()
	private pausedTime: number = 0

	constructor(gameState: SudokuGameState) {
		this.gameState = gameState
		this.currentState = new SetupState()
		this.currentState.enter(this)
	}

	setState(state: GameState): void {
		this.currentState.exit(this)
		this.currentState = state
		this.currentState.enter(this)
	}

	handleInput(input: GameInput): void {
		this.currentState.handleInput(this, input)
	}

	// Getters
	getCurrentState(): GameState {
		return this.currentState
	}

	getGameState(): SudokuGameState {
		return this.gameState
	}

	setGameState(gameState: SudokuGameState): void {
		this.gameState = gameState
	}

	// Pause/Resume functionality
	pause(): void {
		if (!this.isPaused) {
			this.isPaused = true
			this.pausedTime = Date.now()
		}
	}

	resume(): void {
		if (this.isPaused) {
			this.isPaused = false
			const pauseDuration = Date.now() - this.pausedTime
			this.startTime += pauseDuration
		}
	}

	getElapsedTime(): number {
		if (this.isPaused) {
			return this.pausedTime - this.startTime
		}
		return Date.now() - this.startTime
	}

	resetTimer(): void {
		this.startTime = Date.now()
		this.pausedTime = 0
		this.isPaused = false
	}

	// State checks
	canPlaceNumber(): boolean {
		return this.currentState.canPlaceNumber(this)
	}

	canToggleNote(): boolean {
		return this.currentState.canToggleNote(this)
	}

	canUndo(): boolean {
		return this.currentState.canUndo(this)
	}
}

// Concrete States
export class SetupState implements GameState {
	enter(context: GameContext): void {
		context.resetTimer()
	}

	exit(): void {
		// No cleanup needed
	}

	handleInput(context: GameContext, input: GameInput): void {
		switch (input.type) {
			case 'NEW_GAME':
				// Game will be set up, transition to playing
				context.setState(new PlayingState())
				break
			default:
				// Ignore other inputs during setup
				break
		}
	}

	canPlaceNumber(): boolean {
		return false
	}

	canToggleNote(): boolean {
		return false
	}

	canUndo(): boolean {
		return false
	}

	getStateName(): string {
		return 'Setup'
	}

	getStateColor(): string {
		return 'gray'
	}

	getStateMessage(): string {
		return 'Choose difficulty to start'
	}
}

export class PlayingState implements GameState {
	enter(): void {
		// Game is active
	}

	exit(): void {
		// Cleanup if needed
	}

	handleInput(context: GameContext, input: GameInput): void {
		const gameState = context.getGameState()

		switch (input.type) {
			case 'NUMBER':
			case 'CLEAR':
			case 'NOTE':
			case 'UNDO':
			case 'REDO':
				// Normal game inputs are allowed
				break
			case 'PAUSE':
				context.setState(new PausedState())
				break
			case 'NEW_GAME':
				context.setState(new SetupState())
				break
			default:
				break
		}

		// Check if game is completed
		if (gameState.isCompleted) {
			context.setState(new CompletedState())
		}
	}

	canPlaceNumber(): boolean {
		return true
	}

	canToggleNote(): boolean {
		return true
	}

	canUndo(): boolean {
		return true
	}

	getStateName(): string {
		return 'Playing'
	}

	getStateColor(): string {
		return 'blue'
	}

	getStateMessage(): string {
		return 'Game in progress'
	}
}

export class PausedState implements GameState {
	enter(context: GameContext): void {
		context.pause()
	}

	exit(context: GameContext): void {
		context.resume()
	}

	handleInput(context: GameContext, input: GameInput): void {
		switch (input.type) {
			case 'RESUME':
				context.setState(new PlayingState())
				break
			case 'NEW_GAME':
				context.setState(new SetupState())
				break
			default:
				// Ignore game inputs while paused
				break
		}
	}

	canPlaceNumber(): boolean {
		return false
	}

	canToggleNote(): boolean {
		return false
	}

	canUndo(): boolean {
		return false
	}

	getStateName(): string {
		return 'Paused'
	}

	getStateColor(): string {
		return 'yellow'
	}

	getStateMessage(): string {
		return 'Game paused - Click resume to continue'
	}
}

export class CompletedState implements GameState {
	enter(): void {
		// Could trigger celebration animation or sound
	}

	exit(): void {
		// Cleanup if needed
	}

	handleInput(context: GameContext, input: GameInput): void {
		switch (input.type) {
			case 'NEW_GAME':
				context.setState(new SetupState())
				break
			default:
				// Only allow new game when completed
				break
		}
	}

	canPlaceNumber(): boolean {
		return false
	}

	canToggleNote(): boolean {
		return false
	}

	canUndo(): boolean {
		return false // Could allow undo to continue playing
	}

	getStateName(): string {
		return 'Completed'
	}

	getStateColor(): string {
		return 'green'
	}

	getStateMessage(): string {
		return '🎉 Congratulations! Puzzle solved!'
	}
}
