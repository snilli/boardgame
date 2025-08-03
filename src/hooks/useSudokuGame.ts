import { useState, useCallback } from 'react'
import type { SudokuGameState } from '@app/domain/sudoku-game'

type GameMoves = Record<string, (...args: unknown[]) => void>

export interface SudokuGameHook {
	selectedCell: { row: number; col: number } | null
	selectedNumber: number | null
	highlightedNumber: number | null
	setSelectedCell: (cell: { row: number; col: number } | null) => void
	setSelectedNumber: (number: number | null) => void
	setHighlightedNumber: (number: number | null) => void
	handleCellClick: (row: number, col: number, gameState: SudokuGameState, moves: GameMoves) => void
	handleNumberClick: (number: number, gameState: SudokuGameState, moves: GameMoves) => void
	handleClearClick: (moves: GameMoves) => void
	handleNewGame: (difficulty: string, moves: GameMoves) => void
	handleToggleNoteMode: (moves: GameMoves) => void
}

export const useSudokuGame = (): SudokuGameHook => {
	const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
	const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
	const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null)

	const handleCellClick = useCallback(
		(row: number, col: number, gameState: SudokuGameState, moves: GameMoves) => {
			const cellValue = gameState.board[row][col]

			// If clicking on a filled cell
			if (cellValue !== 0) {
				// Allow deletion of user-filled cells (not initial clues)
				if (gameState.initialBoard[row][col] === 0) {
					// If same cell clicked again, clear it
					if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
						moves.clearCell(row, col)
						setSelectedCell(null)
						return
					}
				}

				// Highlight all same numbers (don't toggle off if same number)
				setHighlightedNumber(cellValue)
				setSelectedNumber(cellValue)
				setSelectedCell({ row, col })
				return
			}

			// For empty cells, allow selection and number placement
			setSelectedCell({ row, col })

			// If a number is selected, place it or toggle note
			if (selectedNumber !== null && gameState.initialBoard[row][col] === 0) {
				if (gameState.noteMode && gameState.board[row][col] === 0) {
					// Only allow notes in empty cells
					moves.toggleNote(row, col, selectedNumber)
				} else if (!gameState.noteMode) {
					// Place number (can overwrite existing user input)
					moves.placeNumber(row, col, selectedNumber)
					// Don't clear selection - keep cell selected for more input
				}
			}
		},
		[selectedCell, selectedNumber],
	)

	const handleNumberClick = useCallback(
		(number: number, gameState: SudokuGameState, moves: GameMoves) => {
			// Handle 0 as clear
			if (number === 0 && selectedCell) {
				if (gameState.initialBoard[selectedCell.row][selectedCell.col] === 0) {
					if (gameState.board[selectedCell.row][selectedCell.col] !== 0) {
						moves.clearCell(selectedCell.row, selectedCell.col)
					} else {
						const cellKey = `${selectedCell.row}-${selectedCell.col}`
						if (gameState.notes[cellKey]) {
							;[...gameState.notes[cellKey]].forEach((note) => {
								moves.toggleNote(selectedCell.row, selectedCell.col, note)
							})
						}
					}
				}
				return
			}

			// Don't toggle off if same number is clicked - keep highlighting
			setSelectedNumber(number)
			setHighlightedNumber(number)

			// If a cell is selected, place the number or toggle note
			if (selectedCell && gameState.initialBoard[selectedCell.row][selectedCell.col] === 0) {
				if (gameState.noteMode && gameState.board[selectedCell.row][selectedCell.col] === 0) {
					// Only allow notes in empty cells
					moves.toggleNote(selectedCell.row, selectedCell.col, number)
				} else if (!gameState.noteMode) {
					// Place number (can overwrite existing user input)
					moves.placeNumber(selectedCell.row, selectedCell.col, number)
					// Don't clear selection - keep cell selected for more input
				}
			}
		},
		[selectedCell],
	)

	const handleClearClick = useCallback(
		(moves: GameMoves) => {
			if (selectedCell) {
				moves.clearCell(selectedCell.row, selectedCell.col)
				// Don't clear selection - keep cell selected for more input
			}
			setSelectedNumber(null)
			setHighlightedNumber(null)
		},
		[selectedCell],
	)

	const handleNewGame = useCallback((difficulty: string, moves: GameMoves) => {
		// Factory pattern will be used in the game setup, just pass the difficulty string
		moves.newGame({ difficulty, seed: Math.floor(Math.random() * 1000000) })
		setSelectedCell(null)
		setSelectedNumber(null)
		setHighlightedNumber(null)
	}, [])

	const handleToggleNoteMode = useCallback((moves: GameMoves) => {
		moves.toggleNoteMode()
	}, [])

	return {
		selectedCell,
		selectedNumber,
		highlightedNumber,
		setSelectedCell,
		setSelectedNumber,
		setHighlightedNumber,
		handleCellClick,
		handleNumberClick,
		handleClearClick,
		handleNewGame,
		handleToggleNoteMode,
	}
}
