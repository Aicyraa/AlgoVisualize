import type { Step } from '../../engine/types';

export function selectionSort(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  for (let i = 0; i < n; i++) {
    const last = n - i - 1;
    let maxIdx = 0;

    for (let j = 1; j <= last; j++) {
      steps.push({
        type: 'compare',
        indices: [j, maxIdx],
        description: `Is ${a[j]} >= ${a[maxIdx]}? ${a[j] >= a[maxIdx] ? 'Yes — new max!' : 'No.'}`,
        snapshot: [...a],
        meta: { maxIdx },
      });
      if (a[j] >= a[maxIdx]) {
        maxIdx = j;
        steps.push({
          type: 'correct',
          indices: [maxIdx],
          description: `New maximum found: ${a[maxIdx]} at index ${maxIdx}`,
          snapshot: [...a],
          meta: { maxIdx },
        });
      }
    }

    if (maxIdx !== last) {
      steps.push({
        type: 'swap',
        indices: [maxIdx, last],
        description: `Swapping ${a[maxIdx]} and ${a[last]}`,
        snapshot: [...a],
      });
      [a[maxIdx], a[last]] = [a[last], a[maxIdx]];
    }

    sorted.push(last);
    steps.push({
      type: 'sorted',
      indices: [...sorted],
      description: `${a[last]} is in its final position.`,
      snapshot: [...a],
    });
  }

  steps.push({ type: 'done', indices: [], description: 'Array is fully sorted! 🎉', snapshot: [...a] });
  return steps;
}
