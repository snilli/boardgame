// Settings Store - Using Zustand with localStorage persistence
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface GameSettings {
	difficulty: string
	soundEnabled: boolean
	vibrationEnabled: boolean
	autoNotesEnabled: boolean
	showTimer: boolean
	showErrors: boolean
	theme: 'light' | 'dark' | 'auto'
	language: string
}

interface SettingsState extends GameSettings {
	// Actions
	updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void
	resetSettings: () => void

	// Specific setters for convenience
	setDifficulty: (difficulty: string) => void
	toggleSound: () => void
	toggleVibration: () => void
	toggleAutoNotes: () => void
	toggleTimer: () => void
	toggleErrors: () => void
	setTheme: (theme: 'light' | 'dark' | 'auto') => void
	setLanguage: (language: string) => void
}

const defaultSettings: GameSettings = {
	difficulty: 'medium',
	soundEnabled: true,
	vibrationEnabled: true,
	autoNotesEnabled: false,
	showTimer: true,
	showErrors: true,
	theme: 'auto',
	language: 'en',
}

export const useSettingsStore = create<SettingsState>()(
	devtools(
		persist(
			immer((set) => ({
				// Initial settings
				...defaultSettings,

				// Generic update
				updateSetting: (key, value) => {
					set((state) => {
						;(state as any)[key] = value
					})
				},

				// Reset to defaults
				resetSettings: () => {
					set((state) => {
						Object.assign(state, defaultSettings)
					})
				},

				// Specific setters
				setDifficulty: (difficulty) => {
					set((state) => {
						state.difficulty = difficulty
					})
				},

				toggleSound: () => {
					set((state) => {
						state.soundEnabled = !state.soundEnabled
					})
				},

				toggleVibration: () => {
					set((state) => {
						state.vibrationEnabled = !state.vibrationEnabled
					})
				},

				toggleAutoNotes: () => {
					set((state) => {
						state.autoNotesEnabled = !state.autoNotesEnabled
					})
				},

				toggleTimer: () => {
					set((state) => {
						state.showTimer = !state.showTimer
					})
				},

				toggleErrors: () => {
					set((state) => {
						state.showErrors = !state.showErrors
					})
				},

				setTheme: (theme) => {
					set((state) => {
						state.theme = theme
					})
				},

				setLanguage: (language) => {
					set((state) => {
						state.language = language
					})
				},
			})),
			{
				name: 'sudoku-settings-store',
			},
		),
		{ name: 'SettingsStore' },
	),
)
