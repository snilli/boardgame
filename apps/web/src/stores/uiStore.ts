// UI Store - Using Zustand for UI state management
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UIState {
	// Selection state
	selectedCell: { row: number; col: number } | null
	highlightedNumber: number | null

	// UI modes
	showSettings: boolean
	showStats: boolean
	showHints: boolean

	// Actions
	setSelectedCell: (cell: { row: number; col: number } | null) => void
	setHighlightedNumber: (number: number | null) => void
	handleCellSelection: (row: number, col: number, currentValue: number) => void
	clearSelection: () => void

	// UI toggles
	toggleSettings: () => void
	openSettings: () => void
	closeSettings: () => void
	toggleStats: () => void
	openStats: () => void
	closeStats: () => void
	toggleHints: () => void
	openHints: () => void
	closeHints: () => void

	// Reset UI
	resetUI: () => void
}

export const useUIStore = create<UIState>()(
	devtools(
		immer((set) => ({
			// Initial state
			selectedCell: null,
			highlightedNumber: null,
			showSettings: false,
			showStats: false,
			showHints: false,

			// Selection actions
			setSelectedCell: (cell) => {
				set((state) => {
					state.selectedCell = cell
				})
			},

			setHighlightedNumber: (number) => {
				set((state) => {
					state.highlightedNumber = number
				})
			},

			handleCellSelection: (row, col, currentValue) => {
				set((state) => {
					// Toggle selection
					if (state.selectedCell && state.selectedCell.row === row && state.selectedCell.col === col) {
						state.selectedCell = null
						state.highlightedNumber = null
					} else {
						state.selectedCell = { row, col }
						state.highlightedNumber = currentValue !== 0 ? currentValue : null
					}
				})
			},

			clearSelection: () => {
				set((state) => {
					state.selectedCell = null
					state.highlightedNumber = null
				})
			},

			// Settings actions
			toggleSettings: () => {
				set((state) => {
					state.showSettings = !state.showSettings
				})
			},

			openSettings: () => {
				set((state) => {
					state.showSettings = true
				})
			},

			closeSettings: () => {
				set((state) => {
					state.showSettings = false
				})
			},

			// Stats actions
			toggleStats: () => {
				set((state) => {
					state.showStats = !state.showStats
				})
			},

			openStats: () => {
				set((state) => {
					state.showStats = true
				})
			},

			closeStats: () => {
				set((state) => {
					state.showStats = false
				})
			},

			// Hints actions
			toggleHints: () => {
				set((state) => {
					state.showHints = !state.showHints
				})
			},

			openHints: () => {
				set((state) => {
					state.showHints = true
				})
			},

			closeHints: () => {
				set((state) => {
					state.showHints = false
				})
			},

			// Reset
			resetUI: () => {
				set((state) => {
					state.selectedCell = null
					state.highlightedNumber = null
					state.showSettings = false
					state.showStats = false
					state.showHints = false
				})
			},
		})),
		{ name: 'UIStore' },
	),
)
