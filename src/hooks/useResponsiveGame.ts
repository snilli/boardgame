// Responsive Game Hook - Using usehooks-ts
import { useWindowSize, useMediaQuery } from 'usehooks-ts'

export const useResponsiveGame = () => {
	const { width, height } = useWindowSize()
	const isMobile = useMediaQuery('(max-width: 768px)')
	const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
	const isDesktop = useMediaQuery('(min-width: 1025px)')
	const isLandscape = useMediaQuery('(orientation: landscape)')
	const isPortrait = useMediaQuery('(orientation: portrait)')

	const getBoardSize = () => {
		if (!width || !height) return 400 // fallback

		const maxSize = Math.min(width * 0.9, height * 0.7)

		if (isMobile) {
			return Math.min(maxSize, 350)
		} else if (isTablet) {
			return Math.min(maxSize, 500)
		} else {
			return Math.min(maxSize, 600)
		}
	}

	const getGameLayout = () => {
		if (isMobile && isPortrait) {
			return 'mobile-portrait' // Stack vertically
		} else if (isMobile && isLandscape) {
			return 'mobile-landscape' // Side by side compressed
		} else if (isTablet) {
			return 'tablet'
		} else {
			return 'desktop'
		}
	}

	return {
		width,
		height,
		isMobile,
		isTablet,
		isDesktop,
		isLandscape,
		isPortrait,
		boardSize: getBoardSize(),
		gameLayout: getGameLayout(),
	}
}
