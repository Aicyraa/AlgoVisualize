export type ElementType = 'bars' | 'circles' | 'squares' | 'array';
export type AlgorithmMode = 'sorting' | 'recursion';
export type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
export type RecursionScenario = 'fibonacci' | 'factorial' | 'hanoi';

export type StepType =
  | 'compare'
  | 'swap'
  | 'sorted'
  | 'highlight'
  | 'pivot'
  | 'correct'
  | 'merge-split'
  | 'merge-place'
  | 'call'
  | 'return'
  | 'move'
  | 'reset'
  | 'done';

export interface Step {
  type: StepType;
  indices: number[];
  description: string;
  /** For recursion: call depth */
  depth?: number;
  /** For recursion: node id for tree rendering */
  nodeId?: string;
  /** Full array snapshot at this step (for array redraw) */
  snapshot?: number[];
  /** Extra key-value pairs for algorithm-specific data */
  meta?: Record<string, unknown>;
}

export interface RecursionNode {
  id: string;
  label: string;
  value?: string | number;
  depth: number;
  parentId?: string;
  status: 'pending' | 'active' | 'returned';
  returnValue?: number | string;
  children: string[];
}
