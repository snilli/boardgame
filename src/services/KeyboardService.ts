// Keyboard Service - Single Responsibility Principle
import type { IKeyboardService, KeyboardCallbacks } from './interfaces'

export class KeyboardService implements IKeyboardService {
	private callbacks: KeyboardCallbacks | null = null
	private isInitialized = false

	initialize(callbacks: KeyboardCallbacks): void {
		if (this.isInitialized) {
			this.destroy()
		}

		this.callbacks = callbacks
		document.addEventListener('keydown', this.handleKeyDown)
		this.isInitialized = true
	}

	destroy(): void {
		if (this.isInitialized) {
			document.removeEventListener('keydown', this.handleKeyDown)
			this.callbacks = null
			this.isInitialized = false
		}
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		if (!this.callbacks) return

		const key = event.key

		// Prevent event bubbling and multiple triggers
		event.preventDefault()
		event.stopPropagation()

		// Handle different key inputs
		if (key === ' ' || key === 'Spacebar') {
			this.callbacks.onPause()
		} else if (key === 'n' || key === 'N') {
			this.callbacks.onToggleNotes()
		} else if (key >= '1' && key <= '9') {
			this.callbacks.onNumberInput(parseInt(key))
		} else if (key === 'Backspace' || key === 'Delete' || key === '0') {
			this.callbacks.onClearCell()
		} else if ((key === 'z' || key === 'Z') && (event.ctrlKey || event.metaKey)) {
			this.callbacks.onUndo()
		}
	}
}
