// Game Settings Hook - Using usehooks-ts
import { useLocalStorage } from 'usehooks-ts'

export interface GameSettings {
	difficulty: string
	soundEnabled: boolean
	vibrationEnabled: boolean
	autoNotesEnabled: boolean
	showTimer: boolean
	showErrors: boolean
	theme: 'light' | 'dark' | 'auto'
}

const defaultSettings: GameSettings = {
	difficulty: 'medium',
	soundEnabled: true,
	vibrationEnabled: true,
	autoNotesEnabled: false,
	showTimer: true,
	showErrors: true,
	theme: 'auto'
}

export const useGameSettings = () => {
	const [settings, setSettings] = useLocalStorage('sudoku-game-settings', defaultSettings)

	const updateSetting = <K extends keyof GameSettings>(
		key: K,
		value: GameSettings[K]
	) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}))
	}

	const resetSettings = () => {
		setSettings(defaultSettings)
	}

	return {
		settings,
		setSettings,
		updateSetting,
		resetSettings
	}
}