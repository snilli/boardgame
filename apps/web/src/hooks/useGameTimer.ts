import { useState } from 'react'
import { useInterval } from 'usehooks-ts'

interface UseGameTimerProps {
	startTime: number
	endTime?: number
	isPaused: boolean
	totalPausedDuration?: number // รวมเวลาที่ pause ไปแล้ว
	pausedAt?: number // เวลาที่เริ่ม pause
}

export function useGameTimer({ startTime, endTime, isPaused, totalPausedDuration = 0, pausedAt }: UseGameTimerProps) {
	const [currentTime, setCurrentTime] = useState(Date.now())

	// Simple inline function - no useCallback needed
	useInterval(() => setCurrentTime(Date.now()), 1000)

	const getElapsedTime = () => {
		// Safety check: if startTime is invalid, return 0
		if (!startTime || startTime <= 0) {
			return 0
		}

		// Calculate elapsed time based on current state
		let endTimeToUse: number

		if (isPaused && endTime) {
			// Game completed while paused
			endTimeToUse = endTime
		} else if (isPaused && pausedAt) {
			// Game is currently paused - freeze at the moment of pause
			endTimeToUse = pausedAt
		} else {
			// Game is running normally
			endTimeToUse = currentTime
		}

		// Calculate total elapsed time and subtract already accumulated paused duration
		const totalElapsed = endTimeToUse - startTime - totalPausedDuration
		const elapsedSeconds = Math.floor(totalElapsed / 1000)

		// Return 0 if elapsed time is negative (invalid state)
		return Math.max(0, elapsedSeconds)
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
