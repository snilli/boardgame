import { memo } from 'react'

interface GameInfoProps {
	selectedCell: { row: number; col: number } | null
	noteMode: boolean
	difficulty: number
	errorCount: number
	isCompleted: boolean
}

const GameInfo = memo<GameInfoProps>(({ selectedCell, noteMode, difficulty, errorCount, isCompleted }) => {
	return (
		<>
			{/* Selected cell info */}
			{selectedCell && (
				<div className="text-xs text-gray-600 sm:text-sm">
					Selected: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
					{noteMode && <span className="ml-2 font-medium text-purple-600">(Note Mode)</span>}
				</div>
			)}

			{/* Game info panel */}
			<div className="rounded-lg bg-white p-3 shadow-md sm:p-4">
				<h3 className="mb-3 text-base font-semibold sm:text-lg">Game Info</h3>
				<div className="space-y-1 text-xs text-gray-600 sm:text-sm">
					<div>Difficulty: {Math.round(difficulty * 100)}%</div>
					<div>Errors: {errorCount}</div>
					<div>Status: {isCompleted ? 'Completed' : 'In Progress'}</div>
				</div>
			</div>
		</>
	)
})

export default GameInfo
