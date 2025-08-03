import { useState, useEffect, useRef, useCallback } from 'react'
import { GameContext, type GameInput } from '@app/patterns/GameState'
import type { SudokuGameState } from '@app/domain/sudoku-game'

export interface GameStateManagerHook {
	gameContext: GameContext
	currentStateName: string
	stateColor: string
	stateMessage: string
	elapsedTime: number
	canPlaceNumber: boolean
	canToggleNote: boolean
	canUndo: boolean
	handleStateInput: (input: GameInput) => void
	pauseGame: () => void
	resumeGame: () => void
	isPaused: boolean
}

export const useGameStateManager = (gameState: SudokuGameState): GameStateManagerHook => {
	const gameContextRef = useRef<GameContext>(new GameContext(gameState))
	const [stateInfo, setStateInfo] = useState({
		currentStateName: 'Setup',
		stateColor: 'gray',
		stateMessage: 'Choose difficulty to start',
		elapsedTime: 0,
		canPlaceNumber: false,
		canToggleNote: false,
		canUndo: false,
		isPaused: false,
	})

	// Update game state reference when it changes
	useEffect(() => {
		gameContextRef.current.setGameState(gameState)
	}, [gameState])

	// Update state info when game state changes
	const updateStateInfo = useCallback(() => {
		const context = gameContextRef.current
		const currentState = context.getCurrentState()

		setStateInfo({
			currentStateName: currentState.getStateName(),
			stateColor: currentState.getStateColor(),
			stateMessage: currentState.getStateMessage(),
			elapsedTime: context.getElapsedTime(),
			canPlaceNumber: context.canPlaceNumber(),
			canToggleNote: context.canToggleNote(),
			canUndo: context.canUndo(),
			isPaused: currentState.getStateName() === 'Paused',
		})
	}, [])

	// Timer effect
	useEffect(() => {
		const interval = setInterval(() => {
			updateStateInfo()
		}, 1000)

		return () => clearInterval(interval)
	}, [updateStateInfo])

	const handleStateInput = useCallback(
		(input: GameInput) => {
			const context = gameContextRef.current
			context.handleInput(input)
			updateStateInfo()
		},
		[updateStateInfo],
	)

	// Handle game completion
	useEffect(() => {
		if (gameState.isCompleted && stateInfo.currentStateName === 'Playing') {
			handleStateInput({ type: 'NUMBER' }) // Trigger state check
		}
	}, [gameState.isCompleted, stateInfo.currentStateName, handleStateInput])

	const pauseGame = useCallback(() => {
		handleStateInput({ type: 'PAUSE' })
	}, [handleStateInput])

	const resumeGame = useCallback(() => {
		handleStateInput({ type: 'RESUME' })
	}, [handleStateInput])

	return {
		gameContext: gameContextRef.current,
		currentStateName: stateInfo.currentStateName,
		stateColor: stateInfo.stateColor,
		stateMessage: stateInfo.stateMessage,
		elapsedTime: stateInfo.elapsedTime,
		canPlaceNumber: stateInfo.canPlaceNumber,
		canToggleNote: stateInfo.canToggleNote,
		canUndo: stateInfo.canUndo,
		handleStateInput,
		pauseGame,
		resumeGame,
		isPaused: stateInfo.isPaused,
	}
}
