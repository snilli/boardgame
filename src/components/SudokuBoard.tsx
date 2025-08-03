import { localPoint } from '@visx/event'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { scaleLinear } from '@visx/scale'
import { memo, useCallback } from 'react'
import type { SudokuGameState } from '@app/domain/sudoku-game'

interface SudokuBoardProps {
	gameState: SudokuGameState
	onCellClick: (row: number, col: number) => void
	selectedCell?: { row: number; col: number } | null
	highlightedNumber?: number | null
	maxWidth?: number
	maxHeight?: number
}

interface SudokuBoardInnerProps extends SudokuBoardProps {
	width: number
	height: number
}

// Static data - move outside component to prevent recreation
const NOTE_POSITIONS = [
	{ x: 0.25, y: 0.25 }, // 1: top-left
	{ x: 0.5, y: 0.25 }, // 2: top-center
	{ x: 0.75, y: 0.25 }, // 3: top-right
	{ x: 0.25, y: 0.5 }, // 4: middle-left
	{ x: 0.5, y: 0.5 }, // 5: middle-center
	{ x: 0.75, y: 0.5 }, // 6: middle-right
	{ x: 0.25, y: 0.75 }, // 7: bottom-left
	{ x: 0.5, y: 0.75 }, // 8: bottom-center
	{ x: 0.75, y: 0.75 }, // 9: bottom-right
]

const THICK_BORDERS = [0, 3, 6, 9]

const SudokuBoardInner: React.FC<SudokuBoardInnerProps> = ({
	gameState,
	onCellClick,
	selectedCell,
	highlightedNumber,
	width,
	height,
}) => {
	const cellSize = width / 9
	const strokeWidth = 1
	const thickStrokeWidth = 3
	const fontSize = Math.max(cellSize * 0.4, 18) // Responsive font size with good minimum for readability

	const xScale = scaleLinear({
		range: [0, width],
		domain: [0, 9],
	})

	const yScale = scaleLinear({
		range: [0, height],
		domain: [0, 9],
	})

	const handleCellClick = useCallback(
		(event: React.MouseEvent) => {
			const point = localPoint(event)
			if (!point) return

			const col = Math.floor(point.x / cellSize)
			const row = Math.floor(point.y / cellSize)

			if (row >= 0 && row < 9 && col >= 0 && col < 9) {
				onCellClick(row, col)
			}
		},
		[cellSize, onCellClick],
	)

	const getCellColor = useCallback(
		(row: number, col: number): string => {
			const cellKey = `${row}-${col}`
			const cellValue = gameState.board[row][col]

			if (gameState.errors[cellKey]) {
				return '#fee2e2' // Light red for errors
			}

			if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
				return '#dbeafe' // Light blue for selected
			}

			// Highlight cells with the same number as highlighted number
			if (highlightedNumber && cellValue === highlightedNumber && cellValue !== 0) {
				return '#e0e7ff' // Light indigo for same numbers - matches button color
			}

			// Highlight row and column of selected cell
			if (selectedCell && (selectedCell.row === row || selectedCell.col === col)) {
				return '#f0fdf4' // Extremely light green for row/column - subtle hint
			}

			if (gameState.initialBoard[row][col] !== 0) {
				return '#f3f4f6' // Light gray for clues
			}

			// Alternate background for 3x3 boxes
			const boxRow = Math.floor(row / 3)
			const boxCol = Math.floor(col / 3)
			const isAlternateBox = (boxRow + boxCol) % 2 === 1

			return isAlternateBox ? '#fafafa' : '#ffffff'
		},
		[gameState.board, gameState.errors, gameState.initialBoard, selectedCell, highlightedNumber],
	)

	const getTextColor = useCallback(
		(row: number, col: number): string => {
			const cellKey = `${row}-${col}`
			const cellValue = gameState.board[row][col]

			if (gameState.errors[cellKey]) {
				return '#dc2626' // Red for errors
			}

			// Highlight text for same numbers
			if (highlightedNumber && cellValue === highlightedNumber && cellValue !== 0) {
				return '#6366f1' // Indigo for highlighted numbers - better contrast
			}

			if (gameState.initialBoard[row][col] !== 0) {
				return '#000000' // Black for clues
			}

			return '#374151' // Gray for user input
		},
		[gameState.board, gameState.errors, gameState.initialBoard, highlightedNumber],
	)

	return (
		<div className="select-none">
			<svg width={width} height={height} onClick={handleCellClick}>
				<Group>
					{/* Draw cells */}
					{gameState.board.map((row, rowIndex) =>
						row.map((cell, colIndex) => {
							const x = xScale(colIndex)
							const y = yScale(rowIndex)

							return (
								<g key={`cell-${rowIndex}-${colIndex}`}>
									{/* Cell background */}
									<rect
										x={x}
										y={y}
										width={cellSize}
										height={cellSize}
										fill={getCellColor(rowIndex, colIndex)}
										stroke="#e5e7eb"
										strokeWidth={strokeWidth}
									/>

									{/* Cell number or hints */}
									{cell !== 0 && (
										<text
											x={x + cellSize / 2}
											y={y + cellSize / 2}
											textAnchor="middle"
											dominantBaseline="central"
											fontSize={fontSize}
											fontWeight={
												gameState.initialBoard[rowIndex][colIndex] !== 0 ? 'bold' : 'normal'
											}
											fill={getTextColor(rowIndex, colIndex)}
											style={{ userSelect: 'none', pointerEvents: 'none' }}
										>
											{cell}
										</text>
									)}

									{/* Show notes for empty cells or cells with notes */}
									{(() => {
										const cellKey = `${rowIndex}-${colIndex}`
										const cellNotes = gameState.notes[cellKey]

										if (!cellNotes || cellNotes.length === 0) return null
										// Show notes only in cells that are empty AND not initial clues
										if (cell !== 0) return null
										if (gameState.initialBoard[rowIndex][colIndex] !== 0) return null

										const noteFontSize = Math.max(cellSize * 0.25, 14)
										const noteElements: React.ReactElement[] = []

										cellNotes.forEach((value) => {
											if (value >= 1 && value <= 9) {
												const position = NOTE_POSITIONS[value - 1]
												const noteX = x + cellSize * position.x
												const noteY = y + cellSize * position.y

												// Check if this value violates Sudoku rules (already exists in row, column, or box)
												let isInvalid = false

												// Check row
												for (let c = 0; c < 9; c++) {
													if (gameState.board[rowIndex][c] === value) {
														isInvalid = true
														break
													}
												}

												// Check column
												if (!isInvalid) {
													for (let r = 0; r < 9; r++) {
														if (gameState.board[r][colIndex] === value) {
															isInvalid = true
															break
														}
													}
												}

												// Check 3x3 box
												if (!isInvalid) {
													const boxRow = Math.floor(rowIndex / 3) * 3
													const boxCol = Math.floor(colIndex / 3) * 3
													for (let r = boxRow; r < boxRow + 3; r++) {
														for (let c = boxCol; c < boxCol + 3; c++) {
															if (gameState.board[r][c] === value) {
																isInvalid = true
																break
															}
														}
														if (isInvalid) break
													}
												}

												// Check if this note should be highlighted
												const isHighlighted = highlightedNumber === value

												// Priority: Invalid (red) > Highlighted (indigo) > Normal (gray)
												const noteColor = isInvalid
													? '#dc2626'
													: isHighlighted
														? '#6366f1'
														: '#6b7280'

												noteElements.push(
													<text
														key={`note-${rowIndex}-${colIndex}-${value}`}
														x={noteX}
														y={noteY}
														textAnchor="middle"
														dominantBaseline="central"
														fontSize={noteFontSize}
														fill={noteColor}
														fontWeight="bold"
														style={{
															userSelect: 'none',
															pointerEvents: 'none',
														}}
													>
														{value}
													</text>,
												)
											}
										})

										return noteElements
									})()}
								</g>
							)
						}),
					)}

					{/* Draw row/column guidelines for selected cell */}
					{selectedCell && (
						<g key="guidelines">
							{/* Horizontal line for selected row */}
							<line
								x1={0}
								y1={yScale(selectedCell.row) + cellSize / 2}
								x2={width}
								y2={yScale(selectedCell.row) + cellSize / 2}
								stroke="#059669"
								strokeWidth={3}
								strokeDasharray="8,4"
								opacity={0.8}
							/>
							{/* Vertical line for selected column */}
							<line
								x1={xScale(selectedCell.col) + cellSize / 2}
								y1={0}
								x2={xScale(selectedCell.col) + cellSize / 2}
								y2={height}
								stroke="#059669"
								strokeWidth={3}
								strokeDasharray="8,4"
								opacity={0.8}
							/>
						</g>
					)}

					{/* Draw thick borders for 3x3 boxes */}
					{THICK_BORDERS.map((i) => (
						<g key={`borders-${i}`}>
							{/* Vertical lines */}
							<line
								x1={xScale(i)}
								y1={0}
								x2={xScale(i)}
								y2={height}
								stroke="#374151"
								strokeWidth={thickStrokeWidth}
							/>
							{/* Horizontal lines */}
							<line
								x1={0}
								y1={yScale(i)}
								x2={width}
								y2={yScale(i)}
								stroke="#374151"
								strokeWidth={thickStrokeWidth}
							/>
						</g>
					))}
				</Group>
			</svg>
		</div>
	)
}

const SudokuBoard = memo<SudokuBoardProps>(
	({ gameState, onCellClick, selectedCell, highlightedNumber, maxWidth = 600, maxHeight = 600 }) => {
		return (
			<div
				className="flex h-full w-full items-center justify-center"
				style={{
					maxWidth: `${maxWidth}px`,
					maxHeight: `${maxHeight}px`,
					aspectRatio: '1 / 1',
					minHeight: '320px',
					minWidth: '320px',
				}}
			>
				<ParentSize>
					{({ width, height }) => {
						// Calculate the size to maintain square aspect ratio with better utilization
						const containerSize = Math.min(width, height)
						const size = Math.min(containerSize * 0.98, maxWidth, maxHeight) // Use 98% of container for better space utilization

						return (
							<SudokuBoardInner
								gameState={gameState}
								onCellClick={onCellClick}
								selectedCell={selectedCell}
								highlightedNumber={highlightedNumber}
								width={size}
								height={size}
							/>
						)
					}}
				</ParentSize>
			</div>
		)
	},
)

export default SudokuBoard
