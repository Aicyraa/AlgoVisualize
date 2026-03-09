import { useRef } from 'react';
import type { Step, ElementType } from '../../engine/types';
import { BarElement } from './elements/BarElement';
import { CircleElement } from './elements/CircleElement';
import { SquareElement } from './elements/SquareElement';
import { ArrayElement } from './elements/ArrayElement';

interface SortingVisualizerProps {
  values: number[];
  currentStep: Step | undefined;
  elementType: ElementType;
}

export function SortingVisualizer({ values, currentStep, elementType }: SortingVisualizerProps) {
  const sortedIndicesRef = useRef<Set<number>>(new Set());

  // Track sorted indices across steps
  if (currentStep) {
    if (currentStep.type === 'sorted') {
      for (const idx of currentStep.indices) {
        sortedIndicesRef.current.add(idx);
      }
    } else if (currentStep.type === 'done') {
      // Mark all as sorted
      const snap = currentStep.snapshot ?? values;
      sortedIndicesRef.current = new Set(snap.map((_, i) => i));
    }
  }

  // Reset sorted tracking when no step (engine was reset)
  if (!currentStep) {
    sortedIndicesRef.current = new Set();
  }

  const displayValues = currentStep?.snapshot ?? values;
  const maxValue = Math.max(...displayValues, 1);

  if (displayValues.length === 0) {
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

  function getState(index: number): string | undefined {
    if (!currentStep) return undefined;

    const { type, indices } = currentStep;

    // Current step highlighting takes priority
    if (type === 'done') return 'sorted';
    if (type === 'compare' && indices.includes(index)) return 'compare';
    if (type === 'swap' && indices.includes(index)) return 'swap';
    if (type === 'pivot' && indices.includes(index)) return 'pivot';
    if (type === 'highlight' && indices.includes(index)) return 'highlight';
    if (type === 'correct' && indices.includes(index)) return 'compare';
    if ((type === 'merge-place' || type === 'merge-split') && indices.includes(index)) return 'swap';
    if (type === 'sorted' && indices.includes(index)) return 'sorted';

    // Previously sorted indices persist
    if (sortedIndicesRef.current.has(index)) return 'sorted';

    return undefined;
  }

  return (
    <div className="sorting-visualizer">
      {displayValues.map((value, index) => {
        const state = getState(index);
        switch (elementType) {
          case 'circles':
            return <CircleElement key={index} value={value} state={state} />;
          case 'squares':
            return <SquareElement key={index} value={value} state={state} />;
          case 'array':
            return <ArrayElement key={index} value={value} state={state} />;
          default:
            return <BarElement key={index} value={value} maxValue={maxValue} state={state} />;
        }
      })}
    </div>
  );
}
