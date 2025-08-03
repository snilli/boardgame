import { useGameTimer } from '@app/hooks/useGameTimer'
import type { SudokuGameState } from '@app/domain/sudoku-game'

interface GameHeaderProps {
	gameState: SudokuGameState
	onPause: () => void
	onNewGame: () => void
	onToggleNoteMode: () => void
}

export default function GameHeader({ gameState, onPause, onNewGame, onToggleNoteMode }: GameHeaderProps) {
	const { formattedTime } = useGameTimer({
		startTime: gameState.startTime,
		endTime: gameState.endTime,
		isPaused: gameState.isPaused,
	})

	const getProgress = () => {
		const totalCells = 81
		const filledCells = gameState.board.flat().filter((cell) => cell !== 0).length
		return Math.round((filledCells / totalCells) * 100)
	}

	return (
		<div className="border-b bg-white p-4 shadow-sm">
			<div className="mx-auto flex max-w-4xl items-center justify-between">
				{/* Left side - Game info */}
				<div className="flex items-center space-x-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-800">{formattedTime}</div>
						<div className="text-xs text-gray-500">TIME</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">{gameState.difficultyName}</div>
						<div className="text-xs text-gray-500">DIFFICULTY</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">{getProgress()}%</div>
						<div className="text-xs text-gray-500">COMPLETE</div>
					</div>
				</div>

				{/* Right side - Controls */}
				<div className="flex items-center space-x-3">
					<button
						onClick={onToggleNoteMode}
						className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
							gameState.noteMode
								? 'bg-blue-600 text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						} `}
					>
						📝 Notes {gameState.noteMode ? 'ON' : 'OFF'}
					</button>
					<button
						onClick={onPause}
						className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-yellow-600"
					>
						⏸️ Pause
					</button>
					<button
						onClick={onNewGame}
						className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-600"
					>
						🔄 New Game
					</button>
				</div>
			</div>

			{/* Progress bar */}
			<div className="mx-auto mt-4 max-w-4xl">
				<div className="h-2 w-full rounded-full bg-gray-200">
					<div
						className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
						style={{ width: `${getProgress()}%` }}
					></div>
				</div>
			</div>
		</div>
	)
}
