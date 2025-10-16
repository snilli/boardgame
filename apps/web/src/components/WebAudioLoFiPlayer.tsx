'use client'

import { useEffect, useRef } from 'react'
import { useAudioStore } from '@app/stores'

interface WebAudioLoFiPlayerProps {
	isGamePlaying: boolean
}

export default function WebAudioLoFiPlayer({ isGamePlaying }: WebAudioLoFiPlayerProps) {
	const audioContextRef = useRef<AudioContext | null>(null)
	const oscillator1Ref = useRef<OscillatorNode | null>(null)
	const oscillator2Ref = useRef<OscillatorNode | null>(null)
	const gainNodeRef = useRef<GainNode | null>(null)
	const isActiveRef = useRef(false)

	const { isPlaying, volume, isMuted, setPlayer, setPlayerReady } = useAudioStore()

	// Initialize Web Audio API
	useEffect(() => {
		if (typeof window === 'undefined') return

		const initAudio = async () => {
			try {
				audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
				setPlayer(audioContextRef.current)
				setPlayerReady(true)
			} catch (error) {
				// Failed to initialize Web Audio
			}
		}

		initAudio()

		return () => {
			if (audioContextRef.current) {
				audioContextRef.current.close()
			}
		}
	}, [setPlayer, setPlayerReady])

	// Generate soothing LoFi-style tones
	const startLoFiAudio = async () => {
		if (!audioContextRef.current || isActiveRef.current) {
			return
		}

		try {
			// Stop any existing audio first
			stopLoFiAudio()

			// Resume audio context if suspended
			if (audioContextRef.current.state === 'suspended') {
				await audioContextRef.current.resume()
			}

			// Create multiple oscillators for a richer sound
			const oscillator1 = audioContextRef.current.createOscillator()
			const oscillator2 = audioContextRef.current.createOscillator()
			const gainNode = audioContextRef.current.createGain()

			// LoFi ambient frequencies
			oscillator1.type = 'sine'
			oscillator1.frequency.setValueAtTime(110, audioContextRef.current.currentTime) // A2

			oscillator2.type = 'triangle'
			oscillator2.frequency.setValueAtTime(165, audioContextRef.current.currentTime) // E3

			// Set volume based on store
			const currentVolume = ((isMuted ? 0 : volume) / 100) * 0.05 // Very quiet ambient
			gainNode.gain.setValueAtTime(currentVolume, audioContextRef.current.currentTime)

			// Connect nodes
			oscillator1.connect(gainNode)
			oscillator2.connect(gainNode)
			gainNode.connect(audioContextRef.current.destination)

			// Start oscillators
			oscillator1.start()
			oscillator2.start()

			// Store references
			oscillator1Ref.current = oscillator1
			oscillator2Ref.current = oscillator2
			gainNodeRef.current = gainNode
			isActiveRef.current = true
		} catch (error) {
			// Failed to start audio
		}
	}

	const stopLoFiAudio = () => {
		try {
			// Stop oscillator 1
			if (oscillator1Ref.current) {
				oscillator1Ref.current.stop()
				oscillator1Ref.current.disconnect()
				oscillator1Ref.current = null
			}

			// Stop oscillator 2
			if (oscillator2Ref.current) {
				oscillator2Ref.current.stop()
				oscillator2Ref.current.disconnect()
				oscillator2Ref.current = null
			}

			// Disconnect gain node
			if (gainNodeRef.current) {
				gainNodeRef.current.disconnect()
				gainNodeRef.current = null
			}

			isActiveRef.current = false
		} catch (error) {
			// Error stopping audio
			// Force cleanup even if error
			oscillator1Ref.current = null
			oscillator2Ref.current = null
			gainNodeRef.current = null
			isActiveRef.current = false
		}
	}

	// Handle play/pause from store
	useEffect(() => {
		if (!audioContextRef.current) return

		if (isPlaying && !isActiveRef.current) {
			startLoFiAudio()
		} else if (!isPlaying && isActiveRef.current) {
			stopLoFiAudio()
		}
	}, [isPlaying])

	// Update volume when store changes
	useEffect(() => {
		if (gainNodeRef.current && audioContextRef.current) {
			const currentVolume = ((isMuted ? 0 : volume) / 100) * 0.05
			gainNodeRef.current.gain.setValueAtTime(currentVolume, audioContextRef.current.currentTime)
		}
	}, [volume, isMuted])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopLoFiAudio()
		}
	}, [])

	return null // No visual component
}
