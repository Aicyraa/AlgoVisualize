import type { Step } from '../../engine/types';

export function insertionSort(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [0];

  steps.push({ type: 'sorted', indices: [0], description: 'First element is trivially sorted.', snapshot: [...a] });

  for (let i = 1; i < n; i++) {
    let j = i;
    steps.push({
      type: 'highlight',
      indices: [i],
      description: `Inserting ${a[i]} into the sorted portion.`,
      snapshot: [...a],
    });

    while (j > 0 && a[j] < a[j - 1]) {
      steps.push({
        type: 'compare',
        indices: [j, j - 1],
        description: `Is ${a[j]} < ${a[j - 1]}? Yes — shift left.`,
        snapshot: [...a],
      });
      steps.push({
        type: 'swap',
        indices: [j - 1, j],
        description: `Swapping ${a[j]} and ${a[j - 1]}`,
        snapshot: [...a],
      });
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      j--;
    }

    if (j === i) {
      steps.push({
        type: 'compare',
        indices: [j, j - 1 >= 0 ? j - 1 : j],
        description: `${a[j]} is already in correct position.`,
        snapshot: [...a],
      });
    }

    sorted.push(i);
    steps.push({
      type: 'sorted',
      indices: [...sorted],
      description: `Sorted portion now includes index 0–${i}.`,
      snapshot: [...a],
    });
  }

  steps.push({ type: 'done', indices: [], description: 'Array is fully sorted! 🎉', snapshot: [...a] });
  return steps;
}
