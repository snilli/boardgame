// UI State Hook - Following SOLID principles
import { useCallback, useMemo, useState } from 'react'
import { UIStateManager, type IUIStateManager } from '@app/services'
import type { GameMode } from '@app/domain/sudoku-game'

// Custom useForceUpdate hook
const useForceUpdate = () => {
	const [, setTick] = useState(0)
	return useCallback(() => setTick((tick) => tick + 1), [])
}

export const useUIState = () => {
	// Use @uidotdev/usehooks for cleaner force update
	const forceUpdate = useForceUpdate()

	// Create UI state manager
	const uiManager: IUIStateManager = useMemo(() => new UIStateManager(), [])

	// Force re-render when state changes
	const triggerUpdate = useCallback(() => {
		forceUpdate()
	}, [forceUpdate])

	const setSelectedCell = useCallback(
		(cell: { row: number; col: number } | null) => {
			uiManager.setSelectedCell(cell)
			triggerUpdate()
		},
		[uiManager, triggerUpdate],
	)

	const setHighlightedNumber = useCallback(
		(number: number | null) => {
			uiManager.setHighlightedNumber(number)
			triggerUpdate()
		},
		[uiManager, triggerUpdate],
	)

	const setGameMode = useCallback(
		(mode: GameMode) => {
			uiManager.setGameMode(mode)
			triggerUpdate()
		},
		[uiManager, triggerUpdate],
	)

	const handleCellSelection = useCallback(
		(row: number, col: number, currentValue: number) => {
			uiManager.handleCellSelection(row, col, currentValue)
			triggerUpdate()
		},
		[uiManager, triggerUpdate],
	)

	const clearSelection = useCallback(() => {
		uiManager.clearSelection()
		triggerUpdate()
	}, [uiManager, triggerUpdate])

	const resetToStart = useCallback(() => {
		uiManager.resetToStart()
		triggerUpdate()
	}, [uiManager, triggerUpdate])

	return {
		selectedCell: uiManager.getSelectedCell(),
		highlightedNumber: uiManager.getHighlightedNumber(),
		gameMode: uiManager.getGameMode(),
		setSelectedCell,
		setHighlightedNumber,
		setGameMode,
		handleCellSelection,
		clearSelection,
		resetToStart,
	}
}
