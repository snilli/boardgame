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
	enabled = true,
}: UseGameKeyboardProps) => {
	const handleKeyDown = (event: KeyboardEvent) => {
		if (!enabled) return

		const key = event.key
		const code = event.code

		// Map physical key positions to numbers (works with any keyboard layout)
		const numberKeyMap: { [key: string]: number } = {
			Digit1: 1,
			Digit2: 2,
			Digit3: 3,
			Digit4: 4,
			Digit5: 5,
			Digit6: 6,
			Digit7: 7,
			Digit8: 8,
			Digit9: 9,
			// Numpad support
			Numpad1: 1,
			Numpad2: 2,
			Numpad3: 3,
			Numpad4: 4,
			Numpad5: 5,
			Numpad6: 6,
			Numpad7: 7,
			Numpad8: 8,
			Numpad9: 9,
		}

		// Prevent default behavior for game keys
		if (
			numberKeyMap[code] ||
			key === 'Backspace' ||
			key === 'Delete' ||
			key === ' ' ||
			code === 'KeyN' ||
			code === 'Digit0' ||
			code === 'Numpad0' ||
			(code === 'KeyZ' && (event.ctrlKey || event.metaKey))
		) {
			event.preventDefault()
		}

		// Handle different key inputs
		if (key === ' ') {
			onPause()
		} else if (code === 'KeyN') {
			// Use physical 'N' key position regardless of language
			onToggleNotes()
		} else if (numberKeyMap[code]) {
			// Use physical number key positions (1-9)
			onNumberInput(numberKeyMap[code])
		} else if (key === 'Backspace' || key === 'Delete' || code === 'Digit0' || code === 'Numpad0') {
			onClearCell()
		} else if (code === 'KeyZ' && (event.ctrlKey || event.metaKey)) {
			// Use physical 'Z' key position for undo
			onUndo()
		}
	}

	// Use usehooks-ts useEventListener for clean event handling
	useEventListener('keydown', handleKeyDown, undefined, { passive: false })
}
