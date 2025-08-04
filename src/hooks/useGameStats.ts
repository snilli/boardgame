// Game Statistics Hook - Using usehooks-ts
import { useLocalStorage } from 'usehooks-ts'

export interface GameStats {
	gamesPlayed: number
	gamesCompleted: number
	bestTimes: {
		easy: number | null
		medium: number | null
		hard: number | null
		expert: number | null
	}
	totalPlayTime: number
	averageCompletionTime: number
	streaks: {
		current: number
		best: number
	}
	hintsUsed: number
	errorsCount: number
}

const defaultStats: GameStats = {
	gamesPlayed: 0,
	gamesCompleted: 0,
	bestTimes: {
		easy: null,
		medium: null,
		hard: null,
		expert: null,
	},
	totalPlayTime: 0,
	averageCompletionTime: 0,
	streaks: {
		current: 0,
		best: 0,
	},
	hintsUsed: 0,
	errorsCount: 0,
}

export const useGameStats = () => {
	const [stats, setStats] = useLocalStorage('sudoku-game-stats', defaultStats)

	const recordGameStart = () => {
		setStats((prev) => ({
			...prev,
			gamesPlayed: prev.gamesPlayed + 1,
		}))
	}

	const recordGameCompleted = (difficulty: string, completionTime: number) => {
		setStats((prev) => {
			const difficultyKey = difficulty.toLowerCase() as keyof typeof prev.bestTimes
			const currentBest = prev.bestTimes[difficultyKey]
			const isNewBest = !currentBest || completionTime < currentBest

			return {
				...prev,
				gamesCompleted: prev.gamesCompleted + 1,
				bestTimes: {
					...prev.bestTimes,
					[difficultyKey]: isNewBest ? completionTime : currentBest,
				},
				totalPlayTime: prev.totalPlayTime + completionTime,
				averageCompletionTime: (prev.totalPlayTime + completionTime) / (prev.gamesCompleted + 1),
				streaks: {
					current: prev.streaks.current + 1,
					best: Math.max(prev.streaks.best, prev.streaks.current + 1),
				},
			}
		})
	}

	const recordError = () => {
		setStats((prev) => ({
			...prev,
			errorsCount: prev.errorsCount + 1,
		}))
	}

	const recordHintUsed = () => {
		setStats((prev) => ({
			...prev,
			hintsUsed: prev.hintsUsed + 1,
		}))
	}

	const resetStats = () => {
		setStats(defaultStats)
	}

	const getCompletionRate = () => {
		return stats.gamesPlayed > 0 ? (stats.gamesCompleted / stats.gamesPlayed) * 100 : 0
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

	return {
		stats,
		recordGameStart,
		recordGameCompleted,
		recordError,
		recordHintUsed,
		resetStats,
		getCompletionRate,
		formatTime,
	}
}
