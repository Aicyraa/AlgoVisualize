import type { Step, RecursionNode } from '../../engine/types';

export function factorial(n: number): { steps: Step[]; nodes: RecursionNode[] } {
  const steps: Step[] = [];
  const nodes: RecursionNode[] = [];
  let nodeCounter = 0;

  function fact(n: number, parentId?: string, depth = 0): number {
    const nodeId = `fact-${nodeCounter++}`;
    const node: RecursionNode = {
      id: nodeId,
      label: `fact(${n})`,
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
      description: `Calling factorial(${n})`,
      depth,
      nodeId,
    });

    let result: number;
    if (n <= 1) {
      result = 1;
      steps.push({
        type: 'return',
        indices: [],
        description: `factorial(${n}) = 1 — base case`,
        depth,
        nodeId,
        meta: { returnValue: result },
      });
    } else {
      steps.push({
        type: 'compare',
        indices: [],
        description: `factorial(${n}) = ${n} × factorial(${n - 1})`,
        depth,
        nodeId,
      });
      const sub = fact(n - 1, nodeId, depth + 1);
      result = n * sub;
      steps.push({
        type: 'return',
        indices: [],
        description: `factorial(${n}) = ${n} × ${sub} = ${result}`,
        depth,
        nodeId,
        meta: { returnValue: result },
      });
    }

    node.returnValue = result;
    node.status = 'returned';
    return result;
  }

  fact(n);
  steps.push({ type: 'done', indices: [], description: `factorial(${n}) computed! 🎉` });
  return { steps, nodes };
}
