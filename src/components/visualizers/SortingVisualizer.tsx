import { useRef } from 'react';
import type { Step, ElementType, SortingAlgorithm } from '../../engine/types';
import { BarElement } from './elements/BarElement';
import { CircleElement } from './elements/CircleElement';
import { SquareElement } from './elements/SquareElement';
import { ArrayElement } from './elements/ArrayElement';

const ELEMENT_WIDTHS: Record<ElementType, number> = {
  bars: 42,
  circles: 52,
  squares: 52,
  array: 52,
};
const GAP = 8;

interface SortingVisualizerProps {
  values: number[];
  currentStep: Step | undefined;
  elementType: ElementType;
  algorithm: SortingAlgorithm;
}

/**
 * Elements are identified by their original index. Instead of swapping values
 * at fixed positions, we track which element sits at which position and
 * physically move elements via CSS `left` transitions.
 *
 * For merge sort: elements start at the top and move downward as the recursion
 * splits deeper. During merging they move back up.
 */
export function SortingVisualizer({ values, currentStep, elementType, algorithm }: SortingVisualizerProps) {
  const sortedPositionsRef = useRef<Set<number>>(new Set());
  // order[position] = elementId (original index)
  const orderRef = useRef<number[]>([]);
  const elementValuesRef = useRef<number[]>([]);
  // Track which step we last processed to avoid double-applying swaps
  const lastAppliedStepRef = useRef<Step | undefined>(undefined);
  const prevValuesRef = useRef<number[]>([]);
  // Track which elements are being swapped this step (by elementId)
  const swappingElementIds = useRef<Set<number>>(new Set());
  // For merge sort: track the current depth per element position
  const mergeDepthRef = useRef<Map<number, number>>(new Map());

  const isMergeSort = algorithm === 'merge';

  // Reset when no step (engine reset) or values array changed
  const valuesChanged = prevValuesRef.current !== values && (
    prevValuesRef.current.length !== values.length ||
    prevValuesRef.current.some((v, i) => v !== values[i])
  );
  prevValuesRef.current = values;

  if (!currentStep || valuesChanged) {
    orderRef.current = values.map((_, i) => i);
    elementValuesRef.current = [...values];
    sortedPositionsRef.current = new Set();
    lastAppliedStepRef.current = undefined;
    mergeDepthRef.current = new Map();
  }

  // Ensure order is initialized
  if (orderRef.current.length === 0 && values.length > 0) {
    orderRef.current = values.map((_, i) => i);
    elementValuesRef.current = [...values];
  }

  // Apply swap to order — only once per step
  if (currentStep && currentStep !== lastAppliedStepRef.current) {
    lastAppliedStepRef.current = currentStep;
    swappingElementIds.current = new Set();

    if (currentStep.type === 'swap') {
      const [posA, posB] = currentStep.indices;
      const order = orderRef.current;
      swappingElementIds.current.add(order[posA]);
      swappingElementIds.current.add(order[posB]);
      [order[posA], order[posB]] = [order[posB], order[posA]];
    }

    // For merge sort: track depth per position
    if (isMergeSort && currentStep.meta) {
      const depth = currentStep.meta.depth as number;
      for (const idx of currentStep.indices) {
        mergeDepthRef.current.set(idx, depth);
      }
    }

    // Track sorted positions
    if (currentStep.type === 'sorted') {
      for (const idx of currentStep.indices) {
        sortedPositionsRef.current.add(idx);
      }
      // For merge sort: sorted elements rise back to depth 0
      if (isMergeSort) {
        for (const idx of currentStep.indices) {
          mergeDepthRef.current.set(idx, 0);
        }
      }
    } else if (currentStep.type === 'done') {
      sortedPositionsRef.current = new Set(values.map((_, i) => i));
      if (isMergeSort) {
        mergeDepthRef.current = new Map();
      }
    }
  }

  const maxValue = Math.max(...values, 1);
  const slotWidth = ELEMENT_WIDTHS[elementType] + GAP;

  if (values.length === 0) {
    return (
      <div className="sorting-visualizer">
        <div className="empty-state">
          <div className="empty-state__icon">[ ]</div>
          <div className="empty-state__text">
            Enter values or generate random data to start visualizing.
          </div>
        </div>
      </div>
    );
  }

  // Build position map: elementId -> current position
  const order = orderRef.current;
  const positionOf: Record<number, number> = {};
  for (let pos = 0; pos < order.length; pos++) {
    positionOf[order[pos]] = pos;
  }

  function getState(elementId: number): string | undefined {
    if (!currentStep) return undefined;

    const { type, indices } = currentStep;
    const pos = positionOf[elementId];

    if (type === 'done') return 'sorted';
    if (type === 'compare' && indices.includes(pos)) return 'compare';
    if (type === 'swap' && swappingElementIds.current.has(elementId)) return 'swap';
    if (type === 'pivot' && indices.includes(pos)) return 'pivot';
    if (type === 'highlight' && indices.includes(pos)) return 'highlight';
    if (type === 'correct' && indices.includes(pos)) return 'compare';
    if ((type === 'merge-place' || type === 'merge-split') && indices.includes(pos)) return 'swap';
    if (type === 'sorted' && indices.includes(pos)) return 'sorted';

    if (sortedPositionsRef.current.has(pos)) return 'sorted';

    return undefined;
  }

  function getPositionStyle(elementId: number): React.CSSProperties {
    const pos = positionOf[elementId];

    if (isMergeSort) {
      const depth = mergeDepthRef.current.get(pos) ?? 0;
      const maxDepth = (currentStep?.meta?.maxDepth as number) ?? Math.ceil(Math.log2(values.length));
      // Each depth level moves elements down by a fraction of the container
      const yOffset = depth * 40; // 40px per depth level

      const style: React.CSSProperties = {
        position: 'absolute',
        left: `${pos * slotWidth}px`,
        top: `${20 + yOffset}px`,
        transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), top 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      };

      if (currentStep?.type === 'swap' && swappingElementIds.current.has(elementId)) {
        style.transform = 'translateY(-10px)';
      }

      return style;
    }

    // Default (non-merge) positioning
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${pos * slotWidth}px`,
      bottom: 0,
      transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (currentStep?.type === 'swap' && swappingElementIds.current.has(elementId)) {
      style.transform = 'translateY(-10px)';
    }

    if (currentStep?.type === 'merge-place' && currentStep.indices.includes(pos)) {
      style.transform = 'translateY(-10px)';
    }

    return style;
  }

  const totalWidth = values.length * slotWidth - GAP;
  const mergeMaxDepth = (currentStep?.meta?.maxDepth as number) ?? Math.ceil(Math.log2(values.length));
  const mergeMinHeight = isMergeSort ? 360 + mergeMaxDepth * 40 : undefined;

  return (
    <div className="sorting-visualizer" style={isMergeSort ? { alignItems: 'flex-start', minHeight: mergeMinHeight ? `${mergeMinHeight}px` : undefined } : undefined}>
      <div className="sorting-visualizer__inner" style={{ position: 'relative', minWidth: `${totalWidth}px` }}>
        {elementValuesRef.current.map((value, elementId) => {
          const state = getState(elementId);
          const style = getPositionStyle(elementId);
          switch (elementType) {
            case 'circles':
              return <CircleElement key={elementId} value={value} state={state} style={style} />;
            case 'squares':
              return <SquareElement key={elementId} value={value} state={state} style={style} />;
            case 'array':
              return <ArrayElement key={elementId} value={value} state={state} style={style} />;
            default:
              return <BarElement key={elementId} value={value} maxValue={maxValue} state={state} style={style} />;
          }
        })}
      </div>
    </div>
  );
}
