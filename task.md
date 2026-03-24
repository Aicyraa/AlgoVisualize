# AlgoVisualize Rebuild — Task Checklist

## Phase 1: Setup
- [ ] Create `rebuild/v2` git branch
- [ ] Scaffold Vite + React + TypeScript project
- [ ] Install dependencies (anime.js, react-draggable)
- [ ] Set up base CSS variables and dark theme

## Phase 2: Core Engine
- [ ] Create `types.ts` (Step, AlgorithmMode, ElementType)
- [ ] Create `AnimationEngine.ts` (step queue, play/pause/speed/reset)
- [ ] Create `useAnimationEngine.ts` React hook

## Phase 3: Sorting Algorithms
- [ ] Bubble Sort → Step[]
- [ ] Selection Sort → Step[]
- [ ] Insertion Sort → Step[]
- [ ] Merge Sort → Step[]
- [ ] Quick Sort → Step[]

## Phase 4: Canvas & Layout
- [ ] `CanvasWorkspace` (zoom/pan with right-click drag + scroll wheel)
- [ ] `ControlBar` (toolbar with all controls)
- [ ] `FloatingPanel` (draggable, closeable info window)

## Phase 5: Visualizers
- [ ] `SortingVisualizer` component
- [ ] `BarElement`, `CircleElement`, `SquareElement`, `ArrayElement`
- [ ] `RecursionVisualizer` component

## Phase 6: Recursion Algorithms
- [ ] Fibonacci → call tree Steps
- [ ] Factorial → chain Steps
- [ ] Tower of Hanoi → move Steps

## Phase 7: Polish
- [ ] Dark theme, micro-animations, premium UI
- [ ] Smooth entry/exit transitions
- [ ] Responsive canvas behavior

## Phase 8: Deploy
- [ ] Vercel deployment
- [ ] Confirm live URL works
