import { useState } from 'react'
import { useInterval } from 'usehooks-ts'

interface UseGameTimerProps {
	startTime: number
	endTime?: number
	isPaused: boolean
}

export function useGameTimer({ startTime, endTime, isPaused }: UseGameTimerProps) {
	const [currentTime, setCurrentTime] = useState(Date.now())

	// Update timer every second regardless of game state
	useInterval(() => setCurrentTime(Date.now()), 1000)

	const getElapsedTime = () => {
		const endTimeToUse = endTime || currentTime
		return Math.floor((endTimeToUse - startTime) / 1000)
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
