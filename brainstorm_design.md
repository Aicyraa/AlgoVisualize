# AlgoVisualize — Rebuild Design Document
> Generated via `brainstorming` skill · 2026-03-09
>   ➜  Local:   http://localhost:5173/
---

## 1. Current State Analysis

### What Exists
The current project is a **vanilla HTML/CSS/JS** single-page app:
- `index.html` — static layout, no framework
- `script.js` — orchestrator (graphInfo object, bar generation, sort dispatch)
- `scripts/funcs.algo.js` — bubble, selection, insertion (merge/quick stubbed out)
- `scripts/funcs.algo.animate.js` — DOM-based swap animation + status log
- `scripts/funcs.utils.js` — dropdown handlers, throttle, sleep

### What's Missing (vs. Requirements)
| Requirement | Current Status |
|---|---|
| Canvas with zoom/pan (right-click drag) | ❌ Not present |
| Draggable/closeable detail panel | ❌ Not present |
| 5 sorting algorithms | ⚠️ 3/5 done (merge, quick missing) |
| Recursion visualizer | ❌ Not present |
| Pause / Resume animation | ❌ Not present |
| Animation speed slider (0.1 – 2x) | ⚠️ Preset buttons only |
| Multiple element types (bars, circles, squares, array) | ❌ Bars only |
| Vercel deployment | ❌ Not deployed |
| New git branch | ❌ Not created |

---

## 2. Understanding Summary

- **What is being built:** A web-based DSA learning visualizer for students, showing sorting algorithms and recursion with step-by-step animated explanations.
- **Why it exists:** To make abstract CS concepts tangible through visual, interactive animation.
- **Who it is for:** Students learning Data Structures & Algorithms (beginner to intermediate level).
- **Key constraints:**
  - Must run in-browser (no backend needed)
  - Must be deployable to Vercel (static hosting)
  - Canvas must support zoom/pan via right-click drag
  - Info panels must be draggable and closeable (floating windows)
  - Animation must be pauseable and speed-controllable (0.1× – 2×)
- **Explicit non-goals:**
  - No user accounts / persistence
  - No mobile-optimized layout (desktop-first)
  - No backend APIs
  - No accessibility audit (out of scope for v1 rebuild)

---

## 3. Assumptions

| # | Assumption |
|---|---|
| A1 | Vite + React + TypeScript is approved as the new stack (replaces vanilla JS) |
| A2 | `anime.js` is used for sequenced animations (swap, highlight, recursion tree) |
| A3 | The canvas is a CSS-transform-based infinite canvas (not WebGL/Three.js) |
| A4 | Draggable panels use `react-draggable` or `framer-motion` layout |
| A5 | Recursion scenarios: Fibonacci, Factorial, Tower of Hanoi (3 scenarios minimum) |
| A6 | Element types for sorting: Bars, Circles, Squares, Array (text boxes) |
| A7 | Element types for recursion: Call stack tree only (tree nodes) |
| A8 | Speed control is a continuous slider (0.1 – 2.0) mapped to animation duration |
| A9 | Branch name: `rebuild/v2` |
| A10 | Vercel deployment via `vercel` CLI or GitHub integration |

---

## 4. Design Approaches

### Approach A — Recommended: Vite + React + TypeScript
**Architecture:** Component-based React app with a global animation engine.

**Pros:**
- Clean separation of concerns (algorithm logic vs. UI vs. animation)
- Easy state management for pause/resume/speed
- Reusable components for element types
- TypeScript catches bugs early

**Cons:**
- Requires project setup (npm deps)
- Slightly more complex than vanilla JS

---

### Approach B — Enhanced Vanilla JS (Minimal Rewrite)
**Architecture:** Extend the existing codebase, add canvas wrapper, modularize more.

**Pros:** Less setup, preserves existing code

**Cons:** No component model, harder to manage complex state (pause/resume, recursion tree), scaling becomes painful

---

### Approach C — Svelte
Fast, reactive, simple syntax. But less community tooling for animation integration.

**→ Decision: Approach A (Vite + React + TypeScript)**

---

## 5. Component Architecture

```
App
├── CanvasWorkspace          ← infinite canvas (zoom, pan via right-click drag)
│   ├── SortingVisualizer    ← renders bars/circles/squares/array elements
│   └── RecursionVisualizer  ← renders call stack tree nodes
│
├── ControlBar               ← top toolbar
│   ├── ModeSelector         ← "Sorting" | "Recursion" tabs
│   ├── AlgorithmSelector    ← dropdown for algo choice
│   ├── ElementTypeSelector  ← bars / circles / squares / array
│   ├── PlayPauseButton
│   ├── SpeedSlider          ← 0.1 – 2.0x
│   └── InputPanel           ← custom values or random count
│
└── FloatingPanel            ← draggable, closeable info window
    ├── StepLog              ← "Is 3 > 5? No swap."
    ├── SwapCounter
    └── AlgorithmDescription
```

---

## 6. Data Flow

```
User Input (values / algo / speed)
        │
        ▼
  AnimationEngine (global singleton)
  ├── stepQueue: Step[]        ← algorithm pushes steps here
  ├── speed: number            ← 0.1 – 2.0
  ├── status: playing|paused|idle
  └── currentStep: number
        │
        ▼
  Visualizer Component (reads steps, drives anime.js)
        │
        ▼
  FloatingPanel (reads currentStep.description)
```

**Step object shape:**
```ts
type Step = {
  type: 'compare' | 'swap' | 'sorted' | 'highlight' | 'call' | 'return';
  indices: number[];
  description: string;    // human-readable: "Is 3 > 5? No swap."
  metadata?: Record<string, unknown>;
}
```

The algorithm runs **synchronously** and produces a `Step[]` array **upfront** before any animation starts. The `AnimationEngine` replays these steps with timing. This decouples algorithm logic from animation timing, making pause/resume trivial.

---

## 7. Sorting Algorithms

All 5 algorithms produce `Step[]` arrays:

| Algorithm | Steps produced |
|---|---|
| Bubble Sort | compare, swap, sorted |
| Selection Sort | compare, correct-value, swap, sorted |
| Insertion Sort | compare, swap, sorted |
| Merge Sort | split, merge, compare, place |
| Quick Sort | pivot, compare, swap, sorted |

---

## 8. Recursion Scenarios

Each scenario renders a **call stack tree** that grows as calls are made and collapses as they return.

| Scenario | Visual |
|---|---|
| Fibonacci(n) | Binary tree — each node shows `fib(k)` → value |
| Factorial(n) | Linear chain — shows multiplication steps |
| Tower of Hanoi | 3-peg diagram with disk moves |

User selects scenario from a dropdown. Input is the parameter `n`.

---

## 9. Canvas & Panel System

### Infinite Canvas
- Implemented with a CSS `transform: translate() scale()` wrapper
- **Zoom:** mouse wheel
- **Pan:** right-click + drag (`onContextMenu` suppressed, `onMouseDown` right-button)
- Canvas holds the visualizer component as its child

### Floating Info Panel
- Positioned absolutely, draggable via `react-draggable`
- Closeable with an `×` button (hidden via state, re-opened from toolbar)
- Scrollable step log (auto-scrolls to latest step)
- Shows: current comparison description, swap count, algorithm name

---

## 10. Animation Engine Design

```ts
class AnimationEngine {
  private steps: Step[] = [];
  private currentIndex = 0;
  private speed = 1.0;        // multiplier
  private status: 'idle' | 'playing' | 'paused' = 'idle';
  private timeoutId: number | null = null;

  load(steps: Step[]): void       // load algorithm output
  play(): void                    // start/resume
  pause(): void                   // pause
  setSpeed(x: number): void       // 0.1 – 2.0
  reset(): void                   // go back to step 0
  private tick(): void            // process currentIndex, schedule next
  private applyStep(step: Step)   // drive anime.js + update FloatingPanel
}
```

Base delay between steps: `500ms / speed`. At `2.0x` → `250ms`. At `0.1x` → `5000ms`.

---

## 11. Visual Element Types

The visualizer renders elements differently based on selected type:

| Type | Description | Sorting Use |
|---|---|---|
| Bars | Vertical rectangles (height = value) | ✅ |
| Circles | Circles with value text inside | ✅ |
| Squares | Fixed-size squares — value text inside, color-coded by magnitude | ✅ |
| Array | Horizontal text cells (classic CS array notation) | ✅ |

All four types share the same Step interface — only the renderer differs.

---

## 12. Tech Stack

| Concern | Tool |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Animation | anime.js v3 |
| Draggable panels | react-draggable |
| Canvas pan/zoom | Custom hook (`useCanvasTransform`) |
| Styling | Vanilla CSS (CSS variables, dark theme) |
| Fonts | JetBrains Mono (kept from original) |
| Deploy | Vercel (static) |
| Version control | New branch: `rebuild/v2` |

---

## 13. Decision Log

| # | Decision | Alternatives | Reason |
|---|---|---|---|
| D1 | Use Vite + React + TS | Vanilla JS, Svelte | Component model needed for complex state (pause/resume, multiple panels, element type switching) |
| D2 | Pre-compute steps before animating | Async sleep-based like original | Decouples algorithm from animation; makes pause/resume trivial; easier to scrub |
| D3 | CSS-transform canvas | SVG canvas, Canvas API, WebGL | Simpler to implement; DOM elements stay interactive; no redraw loop needed |
| D4 | react-draggable for panels | framer-motion, DIY | Lightweight, zero-config drag for absolute-positioned divs |
| D5 | anime.js for animation | GSAP, CSS transitions, framer-motion | Sequence API fits step-by-step playback well; small bundle size |
| D6 | 3 recursion scenarios (Fibonacci, Factorial, Hanoi) | More/fewer | Covers linear, binary-tree, and multi-state recursion patterns without over-scoping |
| D7 | Right-click drag for canvas pan | Middle-click, left-click | Preserves left-click for element interaction; right-click is conventional for canvas pan in design tools |

---

## 14. File Structure (New Project)

```
AlgoVisualize/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                   ← global CSS variables + base styles
│   │
│   ├── engine/
│   │   ├── AnimationEngine.ts      ← step queue, play/pause/speed
│   │   ├── types.ts                ← Step, AlgorithmMode, ElementType
│   │   └── useAnimationEngine.ts   ← React hook wrapper
│   │
│   ├── algorithms/
│   │   ├── sorting/
│   │   │   ├── bubble.ts
│   │   │   ├── selection.ts
│   │   │   ├── insertion.ts
│   │   │   ├── merge.ts
│   │   │   └── quick.ts
│   │   └── recursion/
│   │       ├── fibonacci.ts
│   │       ├── factorial.ts
│   │       └── hanoi.ts
│   │
│   ├── components/
│   │   ├── CanvasWorkspace.tsx     ← zoom/pan wrapper
│   │   ├── ControlBar.tsx          ← top toolbar
│   │   ├── FloatingPanel.tsx       ← draggable info window
│   │   ├── visualizers/
│   │   │   ├── SortingVisualizer.tsx
│   │   │   ├── RecursionVisualizer.tsx
│   │   │   └── elements/
│   │   │       ├── BarElement.tsx
│   │   │       ├── CircleElement.tsx
│   │   │       ├── SquareElement.tsx
│   │   │       └── ArrayElement.tsx
│   │   └── ui/
│   │       ├── SpeedSlider.tsx
│   │       ├── PlayPauseButton.tsx
│   │       └── Dropdown.tsx
│   │
│   └── hooks/
│       ├── useCanvasTransform.ts   ← zoom/pan logic
│       └── useDraggable.ts         ← (if not using react-draggable)
│
└── public/
    └── favicon.ico
```

---

## 15. Verification Plan

### Automated (None in current codebase — new tests to be written)
- No existing tests found. Manual verification will be used for v1.

### Manual Verification Checklist
1. **Canvas pan/zoom** — right-click drag moves canvas, scroll wheel zooms in/out
2. **Sorting animation** — all 5 algorithms animate step-by-step with colored highlights
3. **Pause/Resume** — clicking pause mid-sort freezes correctly; resume continues
4. **Speed slider** — 0.1x is very slow, 2.0x is fast
5. **Element switching** — changing bars→circles→squares→array re-renders elements correctly
6. **Floating panel** — shows current step description, is draggable, closeable
7. **Recursion** — selecting Fibonacci/Factorial/Hanoi renders call tree with animation
8. **Vercel deploy** — app loads at Vercel URL with all features working

---

## 16. Implementation Order

1. `rebuild/v2` branch + Vite + React + TS scaffold
2. `AnimationEngine` + `types.ts`
3. Sorting algorithms (all 5) → Step[] output
4. `CanvasWorkspace` (zoom/pan)
5. `SortingVisualizer` + all 4 element types
6. `ControlBar` (algo picker, speed slider, play/pause, element type)
7. `FloatingPanel` (draggable, step log)
8. Recursion algorithms + `RecursionVisualizer`
9. Visual polish (dark theme, animations, micro-interactions)
10. Vercel deployment
