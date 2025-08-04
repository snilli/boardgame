// Object utilities using es-toolkit
import { cloneDeep, pick, omit, isEqual } from 'es-toolkit'

// Export es-toolkit functions
export { cloneDeep, pick, omit, isEqual }

// Replace JSON.parse(JSON.stringify()) with proper deep clone
export const deepClone = <T>(obj: T): T => {
	return cloneDeep(obj)
}

// Utility for comparing game states
export const compareGameStates = (state1: any, state2: any): boolean => {
	return isEqual(state1, state2)
}