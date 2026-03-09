import type { Step, RecursionNode } from '../../engine/types';

export function fibonacci(n: number): { steps: Step[]; nodes: RecursionNode[] } {
  const steps: Step[] = [];
  const nodes: RecursionNode[] = [];
  let nodeCounter = 0;

  function fib(n: number, parentId?: string, depth = 0): number {
    const nodeId = `fib-${nodeCounter++}`;
    const node: RecursionNode = {
      id: nodeId,
      label: `fib(${n})`,
      depth,
      parentId,
      status: 'active',
      children: [],
    };
    nodes.push(node);
    if (parentId) {
      const parent = nodes.find(nd => nd.id === parentId);
      if (parent) parent.children.push(nodeId);
    }

    steps.push({
      type: 'call',
      indices: [],
      description: `Calling fib(${n})`,
      depth,
      nodeId,
    });

    let result: number;
    if (n <= 1) {
      result = n;
      steps.push({
        type: 'return',
        indices: [],
        description: `fib(${n}) = ${result} — base case`,
        depth,
        nodeId,
        meta: { returnValue: result },
      });
    } else {
      steps.push({
        type: 'compare',
        indices: [],
        description: `fib(${n}) = fib(${n - 1}) + fib(${n - 2}) — splitting`,
        depth,
        nodeId,
      });
      const left = fib(n - 1, nodeId, depth + 1);
      const right = fib(n - 2, nodeId, depth + 1);
      result = left + right;
      steps.push({
        type: 'return',
        indices: [],
        description: `fib(${n}) = ${left} + ${right} = ${result}`,
        depth,
        nodeId,
        meta: { returnValue: result },
      });
    }

    node.returnValue = result;
    node.status = 'returned';
    return result;
  }

  fib(n);
  steps.push({ type: 'done', indices: [], description: `fib(${n}) computed! 🎉` });
  return { steps, nodes };
}
