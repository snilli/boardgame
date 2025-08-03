import { useEffect } from 'react'
import type { SudokuGameState } from '@app/domain/sudoku-game'
import type { SudokuGameHook } from '@app/hooks/useSudokuGame'

type GameMoves = Record<string, (...args: unknown[]) => void>

interface UseKeyboardHandlersProps {
	isActive: boolean
	gameState: SudokuGameState
	moves: GameMoves
	gameHook: SudokuGameHook
}

export const useKeyboardHandlers = ({ isActive, gameState, moves, gameHook }: UseKeyboardHandlersProps) => {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (!isActive) return

			const key = event.key
			const { selectedCell, setSelectedCell, setSelectedNumber, setHighlightedNumber } = gameHook

			// Handle Ctrl/Alt as note mode toggle
			if ((key === 'Control' || key === 'Alt') && !event.repeat) {
				moves.toggleNoteMode()
				event.preventDefault()
				return
			}

			// Handle number keys 0-9
			if (key >= '0' && key <= '9') {
				const number = parseInt(key)

				// Handle 0 as clear cell
				if (key === '0' && selectedCell) {
					if (gameState.initialBoard[selectedCell.row][selectedCell.col] === 0) {
						if (gameState.board[selectedCell.row][selectedCell.col] !== 0) {
							// Clear the number
							moves.clearCell(selectedCell.row, selectedCell.col)
						} else {
							// Clear all notes in this cell
							const cellKey = `${selectedCell.row}-${selectedCell.col}`
							if (gameState.notes[cellKey]) {
								Array.from(gameState.notes[cellKey]).forEach((note) => {
									moves.toggleNote(selectedCell.row, selectedCell.col, note)
								})
							}
						}
					}
					return
				}

				// Handle number keys 1-9
				if (key >= '1' && key <= '9') {
					if (selectedCell && gameState.initialBoard[selectedCell.row][selectedCell.col] === 0) {
						if (gameState.noteMode && gameState.board[selectedCell.row][selectedCell.col] === 0) {
							// Toggle note if in note mode and cell is empty
							moves.toggleNote(selectedCell.row, selectedCell.col, number)
						} else if (!gameState.noteMode) {
							// Place number if cell is selected (can overwrite)
							moves.placeNumber(selectedCell.row, selectedCell.col, number)
						}
					} else {
						// Just select the number
						setSelectedNumber(number)
						setHighlightedNumber(number)
					}
				}
			}

			// Handle Delete/Backspace to clear cell or notes
			if ((key === 'Delete' || key === 'Backspace') && selectedCell) {
				if (gameState.initialBoard[selectedCell.row][selectedCell.col] === 0) {
					if (gameState.board[selectedCell.row][selectedCell.col] !== 0) {
						// Clear the number
						moves.clearCell(selectedCell.row, selectedCell.col)
					} else {
						// Clear all notes in this cell
						const cellKey = `${selectedCell.row}-${selectedCell.col}`
						if (gameState.notes[cellKey]) {
							// Clear all notes one by one
							;[...gameState.notes[cellKey]].forEach((note) => {
								moves.toggleNote(selectedCell.row, selectedCell.col, note)
							})
						}
					}
				}
			}

			// Handle Escape to clear selection and highlighting
			if (key === 'Escape') {
				setSelectedCell(null)
				setSelectedNumber(null)
				setHighlightedNumber(null)
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isActive, gameState, moves, gameHook])
}
