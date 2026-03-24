import type { Step } from '../../engine/types';

export function quickSort(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    steps.push({
      type: 'pivot',
      indices: [high],
      description: `Pivot selected: ${pivot} (at index ${high})`,
      snapshot: [...arr],
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        description: `Is ${arr[j]} <= pivot ${pivot}? ${arr[j] <= pivot ? 'Yes' : 'No'}`,
        snapshot: [...arr],
        meta: { pivot, pivotIdx: high },
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          steps.push({
            type: 'swap',
            indices: [i, j],
            description: `Swapping ${arr[i]} and ${arr[j]}`,
            snapshot: [...arr],
            meta: { pivot, pivotIdx: high },
          });
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    if (i + 1 !== high) {
      steps.push({
        type: 'swap',
        indices: [i + 1, high],
        description: `Moving pivot ${pivot} to position ${i + 1}`,
        snapshot: [...arr],
        meta: { pivot, pivotIdx: high },
      });
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      type: 'sorted',
      indices: [i + 1],
      description: `Pivot ${pivot} placed at its final position ${i + 1}`,
      snapshot: [...arr],
    });
    return i + 1;
  }

  function quickSortRecur(arr: number[], low: number, high: number) {
    if (low < high) {
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        description: `Partitioning subarray [${low}..${high}]`,
        snapshot: [...arr],
      });
      const pi = partition(arr, low, high);
      quickSortRecur(arr, low, pi - 1);
      quickSortRecur(arr, pi + 1, high);
    } else if (low === high) {
      steps.push({
        type: 'sorted',
        indices: [low],
        description: `Single element ${arr[low]} — already in place.`,
        snapshot: [...arr],
      });
    }
  }

  quickSortRecur(a, 0, a.length - 1);
  steps.push({ type: 'done', indices: [], description: 'Array is fully sorted! 🎉', snapshot: [...a] });
  return steps;
}
