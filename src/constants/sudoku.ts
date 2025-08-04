// ✨ Sudoku Game Constants - ใช้ร่วมกันทั้ง project

/** Complete Sudoku numbers 1-9 */
export const SUDOKU_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

/** Subset for floating animations (performance optimized) */
export const FLOATING_NUMBERS = [1, 5, 9] as const

/** Alternative floating numbers pattern */
export const FLOATING_NUMBERS_ALT = [3, 6, 9] as const

/** Grid dimensions */
export const GRID_SIZE = 9 as const
export const BOX_SIZE = 3 as const

/** Animation timing constants */
export const ANIMATION_DELAYS = {
	STAGGER_FAST: 0.1,
	STAGGER_MEDIUM: 0.15,
	STAGGER_SLOW: 0.2,
} as const

/** Common positions for floating elements */
export const FLOATING_POSITIONS = {
	LEFT_OFFSET: 20,
	HORIZONTAL_SPACING: 30,
	TOP_OFFSET: 25,
	VERTICAL_SPACING: 40,
} as const