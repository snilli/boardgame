import { memo } from 'react'
import { cn } from '@app/utils/cn'

interface GameStateDisplayProps {
	stateName: string
	stateColor: string
	stateMessage: string
	elapsedTime: number
	isPaused: boolean
	onPause?: () => void
	onResume?: () => void
}

const GameStateDisplay = memo<GameStateDisplayProps>(
	({ stateName, stateColor, stateMessage, elapsedTime, isPaused, onPause, onResume }) => {
		const formatTime = (milliseconds: number): string => {
			const seconds = Math.floor(milliseconds / 1000)
			const minutes = Math.floor(seconds / 60)
			const remainingSeconds = seconds % 60
			return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
		}

		const getStateColorClasses = (color: string): string => {
			const colorMap = {
				gray: 'border-gray-300 bg-gray-50 text-gray-700',
				blue: 'border-blue-300 bg-blue-50 text-blue-700',
				yellow: 'border-yellow-300 bg-yellow-50 text-yellow-700',
				green: 'border-green-300 bg-green-50 text-green-700',
				red: 'border-red-300 bg-red-50 text-red-700',
			}
			return colorMap[color as keyof typeof colorMap] || colorMap.gray
		}

		const showPauseButton = stateName === 'Playing' && onPause
		const showResumeButton = stateName === 'Paused' && onResume

		return (
			<div className="rounded-lg bg-white p-3 shadow-md sm:p-4">
				<h3 className="mb-3 text-base font-semibold sm:text-lg">Game Status</h3>

				<div className="space-y-3">
					{/* State indicator */}
					<div
						className={cn(
							'rounded border px-3 py-2 text-center text-sm font-medium',
							getStateColorClasses(stateColor),
						)}
					>
						<div className="flex items-center justify-between">
							<span>{stateName}</span>
							{stateName !== 'Setup' && (
								<span className="font-mono text-xs">{formatTime(elapsedTime)}</span>
							)}
						</div>
					</div>

					{/* State message */}
					<p className="text-center text-xs text-gray-600 sm:text-sm">{stateMessage}</p>

					{/* Pause/Resume controls */}
					{(showPauseButton || showResumeButton) && (
						<div className="flex justify-center">
							{showPauseButton && (
								<button
									onClick={onPause}
									className="rounded border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
								>
									⏸️ Pause
								</button>
							)}
							{showResumeButton && (
								<button
									onClick={onResume}
									className="rounded border border-green-300 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
								>
									▶️ Resume
								</button>
							)}
						</div>
					)}

					{/* Pause overlay info */}
					{isPaused && (
						<div className="text-center">
							<div className="text-2xl">⏸️</div>
							<p className="text-xs text-gray-500">Game is paused</p>
						</div>
					)}
				</div>
			</div>
		)
	},
)

export default GameStateDisplay
