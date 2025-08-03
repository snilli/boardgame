import { PuzzleFactoryRegistry } from '@app/patterns/PuzzleFactory'
import { cn } from '@app/utils/cn'
import { memo } from 'react'

interface SudokuControlsProps {
	selectedCell: { row: number; col: number } | null
	selectedNumber: number | null
	highlightedNumber: number | null
	noteMode: boolean
	isActive: boolean
	onNumberClick: (number: number) => void
	onClearClick: () => void
	onNewGame: (difficulty: string) => void // Changed to string for factory pattern
	onToggleNoteMode: () => void
	// Undo/Redo props
	canUndo: boolean
	canRedo: boolean
	undoDescription: string | null
	redoDescription: string | null
	onUndo: () => void
	onRedo: () => void
}

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

const SudokuControls = memo<SudokuControlsProps>(
	({
		selectedCell,
		selectedNumber,
		highlightedNumber,
		noteMode,
		isActive,
		onNumberClick,
		onClearClick,
		onNewGame,
		onToggleNoteMode,
		canUndo,
		canRedo,
		undoDescription,
		redoDescription,
		onUndo,
		onRedo,
	}) => {
		return (
			<div className="mx-auto flex w-full max-w-xs flex-col gap-2 sm:max-w-sm sm:gap-3 lg:max-w-xs lg:flex-1">
				{/* Number pad */}
				<div className="rounded-lg bg-white p-2 shadow-md sm:p-3">
					<h3 className="mb-2 text-sm font-semibold sm:text-base">Numbers</h3>
					<div className="grid grid-cols-3 gap-1.5 sm:gap-2">
						{NUMBERS.map((number) => (
							<button
								key={number}
								onClick={() => onNumberClick(number)}
								disabled={!isActive}
								className={cn(
									'h-8 w-8 rounded border text-xs font-semibold transition-colors sm:h-9 sm:w-9 sm:text-sm',
									{
										'border-red-300 bg-red-50 text-red-700 hover:bg-red-100': number === 0,
										'border-yellow-600 bg-yellow-400 text-yellow-900':
											highlightedNumber === number && number !== 0,
										'border-blue-600 bg-blue-500 text-white':
											selectedNumber === number && number !== 0 && highlightedNumber !== number,
										'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100':
											number !== 0 && highlightedNumber !== number && selectedNumber !== number,
										'cursor-not-allowed opacity-50': !isActive,
										'cursor-pointer': isActive,
									},
								)}
							>
								{number === 0 ? '⌫' : number}
							</button>
						))}
					</div>
				</div>

				{/* Action buttons */}
				<div className="rounded-lg bg-white p-2 shadow-md sm:p-3">
					<h3 className="mb-2 text-sm font-semibold sm:text-base">Actions</h3>
					<div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
						<button
							onClick={onClearClick}
							disabled={!isActive || !selectedCell}
							className={cn(
								'rounded border px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 sm:py-2 sm:text-base',
								{
									'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400':
										!isActive || !selectedCell,
									'border-red-300 bg-red-50 text-red-700 hover:bg-red-100': isActive && selectedCell,
								},
							)}
						>
							Clear Cell
						</button>

						{/* Undo/Redo buttons */}
						<div className="flex gap-2">
							<button
								onClick={onUndo}
								disabled={!isActive || !canUndo}
								title={undoDescription || 'Undo'}
								className={cn(
									'flex-1 rounded border px-3 py-1.5 text-sm font-medium transition-colors',
									{
										'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400':
											!isActive || !canUndo,
										'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100':
											isActive && canUndo,
									},
								)}
							>
								↶ Undo
							</button>
							<button
								onClick={onRedo}
								disabled={!isActive || !canRedo}
								title={redoDescription || 'Redo'}
								className={cn(
									'flex-1 rounded border px-3 py-1.5 text-sm font-medium transition-colors',
									{
										'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400':
											!isActive || !canRedo,
										'border-green-300 bg-green-50 text-green-700 hover:bg-green-100':
											isActive && canRedo,
									},
								)}
							>
								↷ Redo
							</button>
						</div>

						<div className="flex flex-col gap-2">
							{PuzzleFactoryRegistry.getAllFactories().map(({ key, factory }) => {
								const color = factory.getColor() as 'green' | 'orange' | 'red' | 'purple'

								return (
									<button
										key={key}
										onClick={() => onNewGame(key)}
										disabled={!isActive}
										className={cn(
											'rounded border px-3 py-1 text-xs font-medium transition-colors',
											{
												'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400':
													!isActive,
												'border-green-300 bg-green-50 text-green-700 hover:bg-green-100':
													isActive && color === 'green',
												'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100':
													isActive && color === 'orange',
												'border-red-300 bg-red-50 text-red-700 hover:bg-red-100':
													isActive && color === 'red',
												'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100':
													isActive && color === 'purple',
												'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100':
													isActive && !['green', 'orange', 'red', 'purple'].includes(color),
											},
										)}
									>
										{factory.getDifficultyName()}
									</button>
								)
							})}
						</div>

						<button
							onClick={onToggleNoteMode}
							disabled={!isActive}
							className={cn(
								'rounded border px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 sm:py-2 sm:text-base',
								{
									'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400': !isActive,
									'border-purple-300 bg-purple-100 text-purple-700 hover:bg-purple-200':
										isActive && noteMode,
									'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100':
										isActive && !noteMode,
								},
							)}
						>
							{noteMode ? 'Normal Mode' : 'Note Mode'}
						</button>
					</div>
				</div>
			</div>
		)
	},
)

export default SudokuControls
