// Math utilities using es-toolkit
import { random, sample, sampleSize, mean, sum } from 'es-toolkit'

// Export es-toolkit functions
export { random, sample, sampleSize, mean, sum }

// Sudoku-specific math utilities
export const randomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const formatTime = (milliseconds: number): string => {
	const seconds = Math.floor(milliseconds / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	
	if (hours > 0) {
		return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
	}
	return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

export const calculateProgress = (current: number, total: number): number => {
	return Math.round((current / total) * 100)
}