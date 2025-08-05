import { useCallback, useMemo } from 'react'
import { useGameStore, useUIStore } from '@app/stores'
import { GameFlowServiceImpl } from '@app/services/GameFlowService'

// Application layer - coordinates between domain services and UI
export function useGameActions() {
	const gameFlowService = useMemo(() => new GameFlowServiceImpl(), [])

	const {
		gameState,
		gameMode,
		history,
		createNewGame,
		setGameMode,
		handleCellInput,
		handleClearCell,
		toggleNoteMode,
		pauseGame,
		resumeGame,
		undoMove,
		resetGame,
	} = useGameStore()

	const { selectedCell, clearSelection } = useUIStore()

	// Pure action handlers - no business logic
	const startGame = useCallback(() => {
		setGameMode('difficulty-select')
	}, [setGameMode])

	const selectDifficulty = useCallback(
		(difficulty: string) => {
			createNewGame(difficulty)
			setGameMode('playing')
			clearSelection()
		},
		[createNewGame, setGameMode, clearSelection],
	)

	const backToStart = useCallback(() => {
		resetGame()
		clearSelection()
	}, [resetGame, clearSelection])

	const newGame = useCallback(() => {
		setGameMode('difficulty-select')
		clearSelection()
	}, [setGameMode, clearSelection])

	const pause = useCallback(() => {
		if (!gameState || !gameFlowService.canPause(gameState)) return

		if (gameFlowService.isGamePaused(gameState)) {
			resumeGame()
			setGameMode('playing')
		} else {
			pauseGame()
			setGameMode('paused')
		}
	}, [gameState, gameFlowService, pauseGame, resumeGame, setGameMode])

	// Game logic actions with validation
	const placeNumber = useCallback(
		(value: number) => {
			if (!gameState || !selectedCell) return

			const { row, col } = selectedCell
			if (!gameFlowService.canPlaceNumber(gameState, row, col)) return

			handleCellInput(row, col, value)
		},
		[gameState, selectedCell, gameFlowService, handleCellInput],
	)

	const clearCell = useCallback(() => {
		if (!gameState || !selectedCell) return

		const { row, col } = selectedCell
		if (!gameFlowService.canClearCell(gameState, row, col)) return

		handleClearCell(row, col)
	}, [gameState, selectedCell, gameFlowService, handleClearCell])

	const toggleNotes = useCallback(() => {
		if (!gameState || !gameFlowService.canToggleNotes(gameState)) return
		toggleNoteMode()
	}, [gameState, gameFlowService, toggleNoteMode])

	const undo = useCallback(() => {
		if (!gameState || !gameFlowService.canUndo(gameState)) return
		// undoMove returns boolean indicating success
		undoMove()
	}, [gameState, gameFlowService, undoMove])

	// Action availability
	const actionState = gameState
		? {
				canPlaceNumber: selectedCell
					? gameFlowService.canPlaceNumber(gameState, selectedCell.row, selectedCell.col)
					: false,
				canClearCell: selectedCell
					? gameFlowService.canClearCell(gameState, selectedCell.row, selectedCell.col)
					: false,
				canUndo: gameFlowService.canUndo(gameState) && history.length > 0,
				canToggleNotes: gameFlowService.canToggleNotes(gameState),
				canPause: gameFlowService.canPause(gameState),
				isGameActive: gameFlowService.isGameActive(gameState),
				isGamePaused: gameFlowService.isGamePaused(gameState),
				isGameCompleted: gameFlowService.isGameCompleted(gameState),
			}
		: {
				canPlaceNumber: false,
				canClearCell: false,
				canUndo: false,
				canToggleNotes: false,
				canPause: false,
				isGameActive: false,
				isGamePaused: false,
				isGameCompleted: false,
			}

	return {
		// Game flow actions
		startGame,
		selectDifficulty,
		backToStart,
		newGame,
		pause,

		// Game logic actions
		placeNumber,
		clearCell,
		toggleNotes,
		undo,

		// Action state
		actionState,

		// Current state
		gameState,
		gameMode,
		selectedCell,
	}
}
