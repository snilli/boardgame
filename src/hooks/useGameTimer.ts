import { useState, useEffect, useRef } from 'react'

interface UseGameTimerProps {
	startTime: number
	endTime?: number
	isPaused: boolean
}

export function useGameTimer({ startTime, endTime, isPaused }: UseGameTimerProps) {
	const [currentTime, setCurrentTime] = useState(Date.now())
	const intervalRef = useRef<number | null>(null)

	useEffect(() => {
		if (isPaused || endTime) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
			return
		}

		intervalRef.current = window.setInterval(() => {
			setCurrentTime(Date.now())
		}, 1000)

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isPaused, endTime])

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
