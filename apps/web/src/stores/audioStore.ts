import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface AudioState {
	// Player state
	isEnabled: boolean
	isPlaying: boolean
	volume: number // 0-100
	isMuted: boolean

	// YouTube player instance
	player: any | null
	isPlayerReady: boolean

	// Actions
	toggleEnabled: () => void
	setEnabled: (enabled: boolean) => void
	play: () => void
	pause: () => void
	setVolume: (volume: number) => void
	toggleMute: () => void
	setPlayer: (player: any) => void
	setPlayerReady: (ready: boolean) => void
}

export const useAudioStore = create<AudioState>()(
	devtools(
		persist(
			immer((set, get) => ({
				// Initial state
				isEnabled: true, // User can disable music entirely
				isPlaying: false,
				volume: 30, // Start at 30% volume (lofi should be background)
				isMuted: false,
				player: null,
				isPlayerReady: false,

				// Actions
				toggleEnabled: () => {
					set((state) => {
						state.isEnabled = !state.isEnabled
						if (!state.isEnabled && state.isPlaying) {
							// If disabling, pause the music
							state.isPlaying = false
						} else if (state.isEnabled && !state.isPlaying) {
							// If enabling, start the music
							state.isPlaying = true
						}
					})
				},

				setEnabled: (enabled: boolean) => {
					set((state) => {
						state.isEnabled = enabled
						if (!enabled && state.isPlaying) {
							state.isPlaying = false
							if (state.player && state.isPlayerReady) {
								state.player.pauseVideo()
							}
						}
					})
				},

				play: () => {
					set((state) => {
						state.isPlaying = true
					})
					// Web Audio API handling is done in the component
				},

				pause: () => {
					set((state) => {
						state.isPlaying = false
					})
					// Web Audio API handling is done in the component
				},

				setVolume: (volume: number) => {
					const { player, isPlayerReady } = get()
					const clampedVolume = Math.max(0, Math.min(100, volume))

					set((state) => {
						state.volume = clampedVolume
						if (clampedVolume === 0) {
							state.isMuted = true
						} else if (state.isMuted) {
							state.isMuted = false
						}
					})

					// HTML5 Audio uses .volume property (0-1 range)
					if (player && isPlayerReady) {
						player.volume = clampedVolume / 100
					}
				},

				toggleMute: () => {
					const { player, isPlayerReady, isMuted, volume } = get()

					set((state) => {
						state.isMuted = !state.isMuted
					})

					if (player && isPlayerReady) {
						if (isMuted) {
							// Unmute - restore volume
							player.volume = volume / 100
						} else {
							// Mute
							player.volume = 0
						}
					}
				},

				setPlayer: (player: any) => {
					set((state) => {
						state.player = player
					})
				},

				setPlayerReady: (ready: boolean) => {
					set((state) => {
						state.isPlayerReady = ready
					})
				},
			})),
			{
				name: 'sudoku-audio-store',
				partialize: (state) => ({
					isEnabled: state.isEnabled,
					volume: state.volume,
					isMuted: state.isMuted,
				}),
			},
		),
		{ name: 'AudioStore' },
	),
)
