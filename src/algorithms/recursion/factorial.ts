import type { Step, RecursionNode } from '../../engine/types';

export function factorial(n: number): { steps: Step[]; nodes: RecursionNode[] } {
  const steps: Step[] = [];
  const nodes: RecursionNode[] = [];
  let nodeCounter = 0;

  function fact(n: number, parentId?: string, depth = 0): number {
    const nodeId = `fact-${nodeCounter++}`;
    const isBase = n <= 1;
    const node: RecursionNode = {
      id: nodeId,
      label: `fact(${n})`,
      depth,
      parentId,
      status: 'active',
      children: [],
      // Plain-language: base shows "1! = 1", recursive shows "3 × 2!"
      baseCase: `${n}! = 1`,
      recursiveCase: isBase ? '\u2014' : `${n} \u00d7 ${n - 1}!`,
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
      meta: { parentId },
    });

    let result: number;
    if (isBase) {
      result = 1;
      steps.push({
        type: 'return',
        indices: [],
        description: `factorial(${n}) = 1 \u2014 base case`,
        depth,
        nodeId,
        meta: { returnValue: result, parentId, isBase: true },
      });
    } else {
      steps.push({
        type: 'compare',
        indices: [],
        description: `factorial(${n}) = ${n} \u00d7 factorial(${n - 1})`,
        depth,
        nodeId,
      });
      const sub = fact(n - 1, nodeId, depth + 1);
      result = n * sub;
      steps.push({
        type: 'return',
        indices: [],
        description: `factorial(${n}) = ${n} \u00d7 ${sub} = ${result}`,
        depth,
        nodeId,
        meta: { returnValue: result, parentId, isBase: false },
      });
    }

    node.returnValue = result;
    node.status = 'returned';
    return result;
  }

  fact(n);
  steps.push({ type: 'done', indices: [], description: `factorial(${n}) computed! \ud83c\udf89` });
  return { steps, nodes };
}
