import { useEffect, useState } from 'react'

/**
 * Hook ที่ใช้ตรวจสอบว่า page มองเห็นได้หรือไม่
 * จะ return false เมื่อ user เปลี่ยน tab, minimize browser, หรือ lock screen
 */
export function usePageVisibility() {
	const [isVisible, setIsVisible] = useState(() => {
		// Check initial state if we're in the browser
		if (typeof document !== 'undefined') {
			return !document.hidden
		}
		return true
	})

	useEffect(() => {
		// ถ้าไม่ใช่ browser environment ให้ skip
		if (typeof document === 'undefined') {
			return
		}

		const handleVisibilityChange = () => {
			setIsVisible(!document.hidden)
		}

		// Listen for visibility changes
		document.addEventListener('visibilitychange', handleVisibilityChange)

		// Cleanup
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	}, [])

	return isVisible
}
