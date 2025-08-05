import { useState } from 'react'
import { useInterval } from 'usehooks-ts'

interface UseGameTimerProps {
	startTime: number
	endTime?: number
	isPaused: boolean
}

export function useGameTimer({ startTime, endTime, isPaused }: UseGameTimerProps) {
	const [currentTime, setCurrentTime] = useState(Date.now())

	// Simple inline function - no useCallback needed
	useInterval(() => setCurrentTime(Date.now()), 1000)

	const getElapsedTime = () => {
		// Safety check: if startTime is invalid, return 0
		if (!startTime || startTime <= 0) {
			return 0
		}

		// For paused games, use endTime to freeze the timer display
		// For running games, always use currentTime to show live updates
		const endTimeToUse = isPaused && endTime ? endTime : currentTime
		const elapsed = Math.floor((endTimeToUse - startTime) / 1000)

		// Return 0 if elapsed time is negative (invalid state)
		return Math.max(0, elapsed)
	}

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`
	}

	const elapsedSeconds = getElapsedTime()

	return {
		elapsedSeconds,
		formattedTime: formatTime(elapsedSeconds),
		rawTime: currentTime,
	}
}
