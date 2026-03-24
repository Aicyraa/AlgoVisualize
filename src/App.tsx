import { useState, useCallback, useRef } from 'react';
import { useAnimationEngine } from './engine/useAnimationEngine';
import { engine } from './engine/AnimationEngine';
import type {
  AlgorithmMode,
  SortingAlgorithm,
  RecursionScenario,
  ElementType,
  RecursionNode,
  Step,
} from './engine/types';

import { ControlBar } from './components/ControlBar';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { FloatingPanel } from './components/FloatingPanel';
import { SortingVisualizer } from './components/visualizers/SortingVisualizer';
import { RecursionVisualizer } from './components/visualizers/RecursionVisualizer';
import { ProgressBar } from './components/ProgressBar';

import { bubbleSort } from './algorithms/sorting/bubble';
import { selectionSort } from './algorithms/sorting/selection';
import { insertionSort } from './algorithms/sorting/insertion';
import { mergeSort } from './algorithms/sorting/merge';
import { quickSort } from './algorithms/sorting/quick';
import { fibonacci } from './algorithms/recursion/fibonacci';
import { factorial } from './algorithms/recursion/factorial';
import { hanoi } from './algorithms/recursion/hanoi';

const ALGO_NAMES: Record<string, string> = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  fibonacci: 'Fibonacci',
  factorial: 'Factorial',
  hanoi: 'Tower of Hanoi',
};

function generateRandom(count = 10): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 1);
}

function App() {
  const [mode, setMode] = useState<AlgorithmMode>('sorting');
  const [sortAlgorithm, setSortAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [recursionScenario, setRecursionScenario] = useState<RecursionScenario>('fibonacci');
  const [elementType, setElementType] = useState<ElementType>('bars');
  const [inputValue, setInputValue] = useState('');
  const [values, setValues] = useState<number[]>([]);
  const [recursionNodes, setRecursionNodes] = useState<RecursionNode[]>([]);
  const [panelVisible, setPanelVisible] = useState(true);
  const recentStepsRef = useRef<{ index: number; description: string; type: string }[]>([]);
  const [, forceUpdate] = useState(0);

  const { state, speed, play, pause, reset, stepForward, setSpeed } = useAnimationEngine();

  // Track recent steps for floating panel
  if (state.step && state.stepIndex >= 0) {
    const last = recentStepsRef.current[recentStepsRef.current.length - 1];
    if (!last || last.index !== state.stepIndex) {
      recentStepsRef.current = [
        ...recentStepsRef.current.slice(-19),
        { index: state.stepIndex, description: state.step.description, type: state.step.type },
      ];
    }
  }

  const runSorting = useCallback((arr: number[], algo: SortingAlgorithm) => {
    let steps: Step[];
    switch (algo) {
      case 'bubble': steps = bubbleSort(arr); break;
      case 'selection': steps = selectionSort(arr); break;
      case 'insertion': steps = insertionSort(arr); break;
      case 'merge': steps = mergeSort(arr); break;
      case 'quick': steps = quickSort(arr); break;
    }
    recentStepsRef.current = [];
    setRecursionNodes([]);
    engine.load(steps);
    forceUpdate(n => n + 1);
  }, []);

  const runRecursion = useCallback((n: number, scenario: RecursionScenario) => {
    let result: { steps: Step[]; nodes: RecursionNode[] };
    switch (scenario) {
      case 'fibonacci': result = fibonacci(n); break;
      case 'factorial': result = factorial(n); break;
      case 'hanoi': result = hanoi(n); break;
    }
    recentStepsRef.current = [];
    setRecursionNodes(result.nodes);
    engine.load(result.steps);
    forceUpdate(n => n + 1);
  }, []);

  const handleGenerate = useCallback(() => {
    if (mode === 'sorting') {
      const parsed = inputValue.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (parsed.length === 0) return;
      setValues(parsed);
      runSorting(parsed, sortAlgorithm);
    } else {
      const n = parseInt(inputValue.trim());
      if (isNaN(n) || n < 0) return;
      const clamped = recursionScenario === 'fibonacci' ? Math.min(n, 8) :
                      recursionScenario === 'factorial' ? Math.min(n, 10) :
                      Math.min(n, 5);
      setValues([clamped]);
      runRecursion(clamped, recursionScenario);
    }
  }, [mode, inputValue, sortAlgorithm, recursionScenario, runSorting, runRecursion]);

  const handleRandom = useCallback(() => {
    const arr = generateRandom(10);
    setValues(arr);
    setInputValue(arr.join(', '));
    runSorting(arr, sortAlgorithm);
  }, [sortAlgorithm, runSorting]);

  const handleReset = useCallback(() => {
    reset();
    recentStepsRef.current = [];
    forceUpdate(n => n + 1);
  }, [reset]);

  const handleModeChange = useCallback((newMode: AlgorithmMode) => {
    setMode(newMode);
    handleReset();
    setValues([]);
    setRecursionNodes([]);
    setInputValue('');
  }, [handleReset]);

  const algoName = mode === 'sorting'
    ? ALGO_NAMES[sortAlgorithm]
    : ALGO_NAMES[recursionScenario];

  return (
    <div className="app">
      <CanvasWorkspace>
        <div className="visualizer-wrapper">
          <ProgressBar
            progress={state.progress}
            stepIndex={state.stepIndex}
            totalSteps={engine.getTotalSteps()}
            status={state.status}
            stepType={state.step?.type}
          />
          {mode === 'sorting' ? (
            <SortingVisualizer
              values={values}
              currentStep={state.step}
              elementType={elementType}
              algorithm={sortAlgorithm}
            />
          ) : (
            <RecursionVisualizer
              nodes={recursionNodes}
              currentStep={state.step}
            />
          )}
        </div>
      </CanvasWorkspace>

      <ControlBar
        mode={mode}
        sortAlgorithm={sortAlgorithm}
        recursionScenario={recursionScenario}
        elementType={elementType}
        speed={speed}
        status={state.status}
        progress={state.progress}
        inputValue={inputValue}
        hasSteps={engine.getTotalSteps() > 0}
        onModeChange={handleModeChange}
        onSortAlgorithmChange={setSortAlgorithm}
        onRecursionScenarioChange={setRecursionScenario}
        onElementTypeChange={setElementType}
        onSpeedChange={setSpeed}
        onPlay={play}
        onPause={pause}
        onReset={handleReset}
        onStep={stepForward}
        onInputChange={setInputValue}
        onGenerate={handleGenerate}
        onRandom={handleRandom}
      />

      <FloatingPanel
        visible={panelVisible}
        onToggle={() => setPanelVisible(v => !v)}
        currentStep={state.step}
        stepIndex={state.stepIndex}
        totalSteps={engine.getTotalSteps()}
        status={state.status}
        algorithmName={algoName}
        recentSteps={recentStepsRef.current}
      />
    </div>
  );
}

export default App;
