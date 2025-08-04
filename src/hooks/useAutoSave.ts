// Auto-save Hook - Using usehooks-ts
import { useEffect } from 'react'
import { useDebounceValue, useLocalStorage } from 'usehooks-ts'
import type { SudokuGameState } from '@app/domain/sudoku-game'

interface UseAutoSaveProps {
	gameState: SudokuGameState | null
	enabled?: boolean
	delay?: number
}

export const useAutoSave = ({ gameState, enabled = true, delay = 2000 }: UseAutoSaveProps) => {
	// Debounce game state to avoid too frequent saves
	const [debouncedGameState] = useDebounceValue(gameState, delay)

	// Store auto-saved game in localStorage
	const [autoSavedGame, setAutoSavedGame] = useLocalStorage<SudokuGameState | null>('sudoku-auto-save', null)

	// Auto-save when debounced state changes
	useEffect(() => {
		if (enabled && debouncedGameState && !debouncedGameState.isCompleted) {
			setAutoSavedGame(debouncedGameState)
		}
	}, [debouncedGameState, enabled, setAutoSavedGame])

	const clearAutoSave = () => {
		setAutoSavedGame(null)
	}

	const hasAutoSave = autoSavedGame !== null

	return {
		autoSavedGame,
		hasAutoSave,
		clearAutoSave,
	}
}
