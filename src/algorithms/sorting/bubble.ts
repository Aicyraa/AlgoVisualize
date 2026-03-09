import type { Step } from '../../engine/types';

export function bubbleSort(arr: number[]): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Is ${a[j]} > ${a[j + 1]}? ${a[j] > a[j + 1] ? 'Yes — swap!' : 'No — move on.'}`,
        snapshot: [...a],
      });

      if (a[j] > a[j + 1]) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          description: `Swapping ${a[j]} and ${a[j + 1]}`,
          snapshot: [...a],
        });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          description: `After swap: ${a[j]} ↔ ${a[j + 1]}`,
          snapshot: [...a],
        });
      }
    }
    sorted.push(n - i - 1);
    steps.push({
      type: 'sorted',
      indices: [...sorted],
      description: `${a[n - i - 1]} is in its final sorted position.`,
      snapshot: [...a],
    });
  }

  steps.push({ type: 'done', indices: [], description: 'Array is fully sorted! 🎉', snapshot: [...a] });
  return steps;
}
