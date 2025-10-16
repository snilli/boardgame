import { useEffect, useRef } from 'react'
import { usePageVisibility } from './usePageVisibility'
import type { GameMode } from '@app/domain/sudoku-game'

interface UseAutoGamePauseProps {
	gameMode: GameMode
	isPaused: boolean
	pauseGame: () => void
	resumeGame: () => void
}

/**
 * Hook ที่จัดการ auto-pause/resume เกมเมื่อ user เปลี่ยน tab หรือทิ้งจอ
 */
export function useAutoGamePause({ gameMode, isPaused, pauseGame, resumeGame }: UseAutoGamePauseProps) {
	const isPageVisible = usePageVisibility()
	const wasAutoPausedRef = useRef(false) // เก็บสถานะว่า pause โดย auto หรือไม่

	useEffect(() => {
		// ทำงานเฉพาะเมื่อเกมกำลังเล่นอยู่
		if (gameMode !== 'playing') {
			wasAutoPausedRef.current = false
			return
		}

		if (!isPageVisible) {
			// หน้าเพจถูกซ่อน (เปลี่ยน tab, minimize, etc.)
			if (!isPaused) {
				// เกมกำลังเล่นอยู่ -> auto pause
				pauseGame()
				wasAutoPausedRef.current = true
			}
		} else {
			// หน้าเพจกลับมามองเห็นได้แล้ว
			if (isPaused && wasAutoPausedRef.current) {
				// เกม pause โดย auto -> auto resume
				resumeGame()
				wasAutoPausedRef.current = false
			}
		}
	}, [isPageVisible, gameMode, isPaused, pauseGame, resumeGame])

	// Reset auto-pause state เมื่อ game mode เปลี่ยน
	useEffect(() => {
		if (gameMode !== 'playing') {
			wasAutoPausedRef.current = false
		}
	}, [gameMode])
}
