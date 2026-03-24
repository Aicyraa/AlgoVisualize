import type { Step } from '../../engine/types';

export function mergeSort(arr: number[]): Step[] {  const steps: Step[] = [];
  const a = [...arr];
  const maxDepth = Math.ceil(Math.log2(a.length));

  function merge(arr: number[], left: number, mid: number, right: number, depth: number) {
    const leftSnapshot = arr.slice(left, mid + 1);
    const rightSnapshot = arr.slice(mid + 1, right + 1);

    steps.push({
      type: 'merge-split',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Merging subarrays [${leftSnapshot.join(', ')}] and [${rightSnapshot.join(', ')}]`,
      snapshot: [...arr],
      meta: { depth, maxDepth, phase: 'merge' },
    });

    // Build the sorted target for this subarray
    const target = arr.slice(left, right + 1).slice().sort((a, b) => a - b);

    // Place each element using swaps — find where the target value currently
    // sits and swap it into the correct position (like selection sort within
    // the subarray). This produces real swap steps the visualizer can animate.
    for (let k = left; k <= right; k++) {
      const want = target[k - left];

      if (arr[k] === want) {
        steps.push({
          type: 'compare',
          indices: [k, k],
          description: `${want} is already at position ${k}`,
          snapshot: [...arr],
          meta: { depth, maxDepth, phase: 'merge' },
        });
        continue;
      }

      // Find where `want` currently lives (must be to the right of k)
      let from = k + 1;
      while (from <= right && arr[from] !== want) from++;

      steps.push({
        type: 'compare',
        indices: [k, from],
        description: `Need ${want} at position ${k} — found at position ${from}`,
        snapshot: [...arr],
        meta: { depth, maxDepth, phase: 'merge' },
      });

      // Emit the swap step BEFORE mutating (pre-swap snapshot)
      steps.push({
        type: 'swap',
        indices: [k, from],
        description: `Swapping ${arr[k]} and ${arr[from]}`,
        snapshot: [...arr],
        meta: { depth, maxDepth, phase: 'merge' },
      });

      [arr[k], arr[from]] = [arr[from], arr[k]];
    }

    steps.push({
      type: 'sorted',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Subarray [${left}..${right}] is merged and sorted.`,
      snapshot: [...arr],
      meta: { depth: depth - 1, maxDepth, phase: 'merge' },
    });
  }

  function mergeSortRecur(arr: number[], left: number, right: number, depth: number) {
    if (left >= right) {
      steps.push({
        type: 'highlight',
        indices: [left],
        description: `Single element ${arr[left]} — base case, already sorted.`,
        snapshot: [...arr],
        meta: { depth, maxDepth, phase: 'split' },
      });
      return;
    }
    const mid = Math.floor((left + right) / 2);
    steps.push({
      type: 'merge-split',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Splitting [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`,
      snapshot: [...arr],
      meta: { depth, maxDepth, phase: 'split' },
    });
    mergeSortRecur(arr, left, mid, depth + 1);
    mergeSortRecur(arr, mid + 1, right, depth + 1);
    merge(arr, left, mid, right, depth);
  }

  mergeSortRecur(a, 0, a.length - 1, 0);
  steps.push({ type: 'done', indices: [], description: 'Array is fully sorted! 🎉', snapshot: [...a], meta: { depth: 0, maxDepth, phase: 'done' } });
  return steps;
}
