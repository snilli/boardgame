// Keyboard Handler Hook - Using usehooks-ts (cleaner!)
import { useGameKeyboard } from './useGameKeyboard'

interface UseKeyboardHandlerProps {
	onNumberInput: (number: number) => void
	onClearCell: () => void
	onUndo: () => void
	onToggleNotes: () => void
	onPause: () => void
	enabled?: boolean
}

export const useKeyboardHandler = (props: UseKeyboardHandlerProps) => {
	// Delegate to the new usehooks-ts based hook
	useGameKeyboard(props)
}