// Game Modes Hook - Using usehooks-ts
import { useBoolean } from 'usehooks-ts'

export const useGameModes = () => {
	const {
		value: noteMode,
		setTrue: enableNoteMode, 
		setFalse: disableNoteMode,
		toggle: toggleNoteMode
	} = useBoolean(false)

	const {
		value: isPaused,
		setTrue: pauseGame,
		setFalse: resumeGame, 
		toggle: togglePause
	} = useBoolean(false)

	const {
		value: isCompleted,
		setTrue: completeGame,
		setFalse: resetCompletion
	} = useBoolean(false)

	const {
		value: showSettings,
		setTrue: openSettings,
		setFalse: closeSettings,
		toggle: toggleSettings
	} = useBoolean(false)

	return {
		// Note mode
		noteMode,
		enableNoteMode,
		disableNoteMode,
		toggleNoteMode,
		
		// Pause/Resume
		isPaused,
		pauseGame,
		resumeGame,
		togglePause,
		
		// Game completion
		isCompleted,
		completeGame,
		resetCompletion,
		
		// Settings
		showSettings,
		openSettings,
		closeSettings,
		toggleSettings
	}
}