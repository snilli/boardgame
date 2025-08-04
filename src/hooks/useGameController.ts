// Game Controller Hook - Following SOLID principles
import { useState, useCallback, useMemo } from 'react'
import { GameController, GameStateHistory, type IGameController } from '@app/services'
import type { SudokuGameState } from '@app/domain/sudoku-game'

export const useGameController = () => {
	const [gameState, setGameState] = useState<SudokuGameState | null>(null)

	// Create controller with dependency injection
	const controller: IGameController = useMemo(() => {
		const history = new GameStateHistory()
		return new GameController(history)
	}, [])

	// Sync controller state with React state
	const syncState = useCallback(() => {
		setGameState(controller.getGameState())
	}, [controller])

	const createNewGame = useCallback(
		(difficulty: string) => {
			controller.createNewGame(difficulty)
			syncState()
		},
		[controller, syncState],
	)

	const handleCellInput = useCallback(
		(row: number, col: number, value: number) => {
			controller.handleCellInput(row, col, value)
			syncState()
		},
		[controller, syncState],
	)

	const handleClearCell = useCallback(
		(row: number, col: number) => {
			controller.handleClearCell(row, col)
			syncState()
		},
		[controller, syncState],
	)

	const toggleNoteMode = useCallback(() => {
		controller.toggleNoteMode()
		syncState()
	}, [controller, syncState])

	const pauseGame = useCallback(() => {
		controller.pauseGame()
		syncState()
	}, [controller, syncState])

	const resumeGame = useCallback(() => {
		controller.resumeGame()
		syncState()
	}, [controller, syncState])

	const undoMove = useCallback((): boolean => {
		const success = controller.undoMove()
		if (success) {
			syncState()
		}
		return success
	}, [controller, syncState])

	return {
		gameState,
		createNewGame,
		handleCellInput,
		handleClearCell,
		toggleNoteMode,
		pauseGame,
		resumeGame,
		undoMove,
	}
}
