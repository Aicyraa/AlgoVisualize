import type { Step } from '../../engine/types';

export function mergeSort(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];

  function merge(arr: number[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    steps.push({
      type: 'merge-split',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Merging subarrays [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      snapshot: [...arr],
    });

    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        description: `Is ${leftArr[i]} <= ${rightArr[j]}? ${leftArr[i] <= rightArr[j] ? 'Yes' : 'No'}`,
        snapshot: [...arr],
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        steps.push({
          type: 'merge-place',
          indices: [k],
          description: `Placing ${leftArr[i]} at position ${k}`,
          snapshot: [...arr],
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        steps.push({
          type: 'merge-place',
          indices: [k],
          description: `Placing ${rightArr[j]} at position ${k}`,
          snapshot: [...arr],
        });
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        type: 'merge-place',
        indices: [k],
        description: `Placing remaining ${leftArr[i]} at position ${k}`,
        snapshot: [...arr],
      });
      i++; k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        type: 'merge-place',
        indices: [k],
        description: `Placing remaining ${rightArr[j]} at position ${k}`,
        snapshot: [...arr],
      });
      j++; k++;
    }

    steps.push({
      type: 'sorted',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Subarray [${left}..${right}] is merged and sorted.`,
      snapshot: [...arr],
    });
  }

  function mergeSortRecur(arr: number[], left: number, right: number) {
    if (left >= right) {
      steps.push({
        type: 'highlight',
        indices: [left],
        description: `Single element ${arr[left]} — base case, already sorted.`,
        snapshot: [...arr],
      });
      return;
    }
    const mid = Math.floor((left + right) / 2);
    steps.push({
      type: 'merge-split',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      description: `Splitting [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`,
      snapshot: [...arr],
    });
    mergeSortRecur(arr, left, mid);
    mergeSortRecur(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  mergeSortRecur(a, 0, a.length - 1);
  steps.push({ type: 'done', indices: [], description: 'Array is fully sorted! 🎉', snapshot: [...a] });
  return steps;
}
