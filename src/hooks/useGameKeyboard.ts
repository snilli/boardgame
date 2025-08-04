// Game Keyboard Hook - Using usehooks-ts
import { useEventListener } from 'usehooks-ts'

interface UseGameKeyboardProps {
	onNumberInput: (number: number) => void
	onClearCell: () => void
	onUndo: () => void
	onToggleNotes: () => void
	onPause: () => void
	enabled?: boolean
}

export const useGameKeyboard = ({
	onNumberInput,
	onClearCell,
	onUndo,
	onToggleNotes,
	onPause,
	enabled = true
}: UseGameKeyboardProps) => {
	const handleKeyDown = (event: KeyboardEvent) => {
		if (!enabled) return

		const key = event.key

		// Prevent default behavior for game keys
		if (key >= '1' && key <= '9' || 
			key === 'Backspace' || 
			key === 'Delete' ||
			key === ' ' ||
			key === 'n' || key === 'N' ||
			(key === 'z' && (event.ctrlKey || event.metaKey))) {
			event.preventDefault()
		}

		// Handle different key inputs
		if (key === ' ') {
			onPause()
		} else if (key === 'n' || key === 'N') {
			onToggleNotes()
		} else if (key >= '1' && key <= '9') {
			onNumberInput(parseInt(key))
		} else if (key === 'Backspace' || key === 'Delete' || key === '0') {
			onClearCell()
		} else if (key === 'z' && (event.ctrlKey || event.metaKey)) {
			onUndo()
		}
	}

	// Use usehooks-ts useEventListener for clean event handling
	useEventListener('keydown', handleKeyDown, undefined, { passive: false })
}