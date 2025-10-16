# Sudoku App - Code Flow & Architecture

## 🚀 Entry Point & Initialization

```typescript
// Next.js App Router Flow
layout.tsx → page.tsx → <SudokuApp />
```

## 🏗️ Component Hierarchy & Call Stack

### Level 1: Root Component
```typescript
// SudokuApp.tsx (line 24)
export default function SudokuApp() {
  // Hooks initialization
  const { startGame, selectDifficulty, ... } = useGameActions()  // ←── Main orchestrator
  const { highlightedNumber, handleCellSelection } = useUIStore() // ←── UI state
  const { formattedTime } = useGameTimer()                       // ←── Timer hook
  
  // Conditional rendering based on gameMode
  if (gameMode === 'start') return <GameStartScreen />
  if (gameMode === 'difficulty-select') return <DifficultyScreen />
  // ... main game UI
}
```

### Level 2: Action Orchestrator
```typescript
// useGameActions.ts (line 6)
export function useGameActions() {
  const gameFlowService = useMemo(() => new GameFlowServiceImpl(), [])  // ←── Service layer
  
  // Store connections
  const { gameState, createNewGame, handleCellInput, ... } = useGameStore()  // ←── Game state
  const { selectedCell, clearSelection } = useUIStore()                     // ←── UI state
  
  // Action handlers
  const startGame = useCallback(() => setGameMode('difficulty-select'), [])
  const selectDifficulty = useCallback((difficulty: string) => {
    createNewGame(difficulty)  // ←── Triggers game creation
    setGameMode('playing')
  }, [])
  
  const placeNumber = useCallback((value: number) => {
    if (!gameFlowService.canPlaceNumber(gameState, row, col)) return  // ←── Business validation
    handleCellInput(row, col, value)  // ←── Store mutation
  }, [])
}
```

### Level 3: State Management (Zustand Stores)

#### Game Store (gameStore.ts)
```typescript
export const useGameStore = create<GameState>()(
  devtools(persist(immer((set, get) => ({
    // State
    gameState: null,
    gameMode: 'start',
    history: [],
    
    // Key actions
    createNewGame: (difficulty: string) => {
      set((state) => {
        state.gameState = createInitialGameState(difficulty)  // ←── Domain logic call
        state.gameMode = 'playing'
        state.history = []
      })
    },
    
    handleCellInput: (row, col, value) => {
      get().saveToHistory()  // ←── Save state before changes
      set((state) => {
        if (state.gameState.noteMode) {
          // Note mode logic (lines 71-93)
          const cellKey = `${row}-${col}`
          if (!state.gameState.notes[cellKey]) {
            state.gameState.notes[cellKey] = []
          }
          // Toggle note logic...
        } else {
          // Number placement logic (lines 95-166)
          state.gameState.board[row][col] = value
          delete state.gameState.errors[cellKey]
          delete state.gameState.notes[cellKey]
          
          // Clear related notes in same row/col/box
          // Error validation
          // Completion check
        }
      })
    }
  })))
)
```

#### UI Store (uiStore.ts)
```typescript
export const useUIStore = create<UIState>()(
  immer((set) => ({
    selectedCell: null,
    highlightedNumber: null,
    
    handleCellSelection: (row, col, currentValue) => {
      set((state) => {
        // Toggle selection logic (lines 60-71)
        if (state.selectedCell?.row === row && state.selectedCell?.col === col) {
          state.selectedCell = null              // Deselect current
          state.highlightedNumber = null
        } else {
          state.selectedCell = { row, col }      // Select new cell
          state.highlightedNumber = currentValue !== 0 ? currentValue : null
        }
      })
    }
  }))
)
```

### Level 4: Domain Layer
```typescript
// sudoku-game.ts (line 51)
export const createInitialGameState = (difficulty?: string | number): SudokuGameState => {
  const difficultyToUse = difficulty ?? 'easy'
  
  let puzzleConfig
  if (typeof difficultyToUse === 'string') {
    puzzleConfig = createRandomPuzzle(difficultyToUse)  // ←── Factory pattern
  } else {
    const sudoku = new SudokuAdvanced(3, 3, undefined, undefined, seed)
    const puzzle = sudoku.solve().setDifficulty(difficultyToUse)
    // Custom difficulty logic...
  }
  
  return {
    board: puzzleConfig.board.map(row => [...row]),
    initialBoard: puzzleConfig.initialBoard.map(row => [...row]),
    solution: puzzleConfig.solution,
    isCompleted: false,
    difficulty: puzzleConfig.difficulty,
    startTime: Date.now(),
    // ... other state
  }
}
```

### Level 5: Service Layer
```typescript
// GameFlowService.ts (line 29)
export class GameFlowServiceImpl implements GameFlowService {
  canPlaceNumber(gameState: SudokuGameState, row: number, col: number): boolean {
    if (!this.isGameActive(gameState)) return false           // ←── Game state check
    if (gameState.initialBoard[row][col] !== 0) return false  // ←── Initial clue check
    return true
  }
  
  isGameActive(gameState: SudokuGameState): boolean {
    return !gameState.isPaused && !gameState.isCompleted     // ←── Pure business logic
  }
  
  validateCellAction(gameState, row, col) {
    if (!this.canPerformAction(gameState)) {
      const reason = gameState.isPaused ? 'Game is paused' : 'Game is completed'
      return { canPlace: false, canClear: false, reason }
    }
    // ... validation logic
  }
}
```

## 📞 Call Flow Examples

### User Clicks Cell
```
1. User clicks cell → SudokuBoard.tsx → onCellClick(row, col)
   ↓
2. SudokuApp.tsx → handleCellClick() → handleCellSelection(row, col, cellValue)
   ↓  
3. useUIStore → handleCellSelection() [uiStore.ts:60]
   ↓
4. Zustand immer → set((state) => { state.selectedCell = { row, col } })
   ↓
5. React re-renders → SudokuBoard gets new selectedCell prop
   ↓
6. Cell highlights visually
```

### Number Input
```
1. User presses number → useKeyboardHandler → onNumberInput(num)
   ↓
2. useGameActions → placeNumber(value) [useGameActions.ts:63]
   ↓
3. GameFlowService → canPlaceNumber() validation [GameFlowService.ts:34]
   ↓
4. useGameStore → handleCellInput(row, col, value) [gameStore.ts:58]
   ↓
5. saveToHistory() → Deep clone current state [gameStore.ts:252]
   ↓
6. Zustand immer → Complex game logic [gameStore.ts:66-167]
   ↓
7. Check completion → set isCompleted if solved [gameStore.ts:154]
```

### Game Flow Transitions
```
Start Screen → Difficulty Screen → Game Screen
     ↓               ↓                ↓
startGame()    selectDifficulty()  pause()/newGame()
     ↓               ↓                ↓
gameMode =    createNewGame() +     gameMode =
'difficulty-  gameMode =            'paused'/'difficulty-select'
select'       'playing'
```

## 🧠 Architecture Layers

```
┌─────────────────────────────────────────────────┐
│ UI Layer                                        │
│ SudokuApp, DifficultyScreen, GameStartScreen   │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ Hook Layer                                      │
│ useGameActions, useGameTimer, useKeyboardHandler│
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ Store Layer (Zustand)                          │
│ useGameStore, useUIStore                       │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ Service Layer                                   │
│ GameFlowServiceImpl                            │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ Domain Layer                                    │
│ sudoku-game.ts, sudoku-advanced.ts             │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ Pattern Layer                                   │
│ PuzzleFactory, DifficultyStrategy               │
└─────────────────────────────────────────────────┘
```

## 🔑 Key Design Principles

### Single Responsibility
- **useGameActions**: Action orchestration only
- **GameFlowService**: Business rule validation only  
- **gameStore**: Game state management only
- **uiStore**: UI state management only

### Dependency Injection
- Services injected via `useMemo(() => new GameFlowServiceImpl(), [])`
- Stores connected via Zustand hooks
- No tight coupling between layers

### Immutable State Updates
- **Immer middleware**: Enables mutation-like syntax with immutable updates
- **History management**: Deep cloning for undo functionality
- **React Compiler**: Optimizes re-renders automatically

### Type Safety
```typescript
interface SudokuGameState {
  board: number[][]
  initialBoard: number[][]
  solution: number[][]
  isCompleted: boolean
  // ... all properties typed
}

type GameMode = 'start' | 'difficulty-select' | 'playing' | 'completed' | 'paused'
```

### Clean Architecture Benefits
1. **Testability**: Each layer can be tested in isolation
2. **Maintainability**: Clear separation of concerns
3. **Scalability**: Easy to add new features
4. **Performance**: React Compiler + Zustand optimization

## 📁 File Structure & Responsibilities

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Entry point → <SudokuApp />
├── components/             # UI Components
│   ├── SudokuApp.tsx       # Main orchestrator
│   ├── SudokuBoard.tsx     # Game board rendering
│   ├── DifficultyScreen.tsx # Difficulty selection
│   └── GameStartScreen.tsx # Welcome screen
├── hooks/                  # Custom Hooks
│   ├── useGameActions.ts   # Action orchestration
│   ├── useGameTimer.ts     # Timer management
│   └── useKeyboardHandler.ts # Keyboard input
├── stores/                 # Zustand Stores
│   ├── gameStore.ts        # Game state & logic
│   └── uiStore.ts          # UI state management
├── services/               # Business Services
│   └── GameFlowService.ts  # Business rules validation
├── domain/                 # Domain Logic
│   ├── sudoku-game.ts      # Core game logic
│   └── sudoku-advanced.ts  # Advanced puzzle generation
└── patterns/               # Design Patterns
    ├── PuzzleFactory.ts    # Factory pattern
    └── DifficultyStrategy.ts # Strategy pattern
```

## 🎯 Performance Optimizations

### React Compiler
- Automatic memoization of components and hooks
- Eliminates need for manual `React.memo`, `useMemo`, `useCallback`
- Zero-cost abstractions

### Zustand Optimizations
- **Granular subscriptions**: Components only re-render on relevant state changes
- **Immer middleware**: Efficient immutable updates
- **DevTools**: Development debugging without performance impact

### GPU Acceleration
```typescript
// Motion components with GPU acceleration
<motion.div 
  className="transform-gpu will-change-[transform,opacity]"
  animate={{ scale: [1, 1.1, 1] }}
/>
```

This architecture provides a solid foundation for complex state management while maintaining clean separation of concerns and optimal performance.