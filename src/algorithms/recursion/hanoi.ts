import type { Step, RecursionNode } from '../../engine/types';

export function hanoi(n: number): { steps: Step[]; nodes: RecursionNode[] } {
  const steps: Step[] = [];
  const nodes: RecursionNode[] = [];
  let nodeCounter = 0;
  let moveCount = 0;

  function move(n: number, from: string, to: string, aux: string, parentId?: string, depth = 0): void {
    const nodeId = `hanoi-${nodeCounter++}`;
    const node: RecursionNode = {
      id: nodeId,
      label: `hanoi(${n}, ${from}→${to})`,
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
      description: `hanoi(${n}, from ${from}, to ${to}, via ${aux})`,
      depth,
      nodeId,
    });

    if (n === 1) {
      moveCount++;
      steps.push({
        type: 'move',
        indices: [],
        description: `Move disk 1 from ${from} → ${to} (Move #${moveCount})`,
        depth,
        nodeId,
        meta: { from, to, disk: 1, moveNumber: moveCount },
      });
      node.returnValue = `Move disk 1: ${from}→${to}`;
      node.status = 'returned';
      steps.push({
        type: 'return',
        indices: [],
        description: `Done: disk 1 from ${from} → ${to}`,
        depth,
        nodeId,
      });
      return;
    }

    steps.push({
      type: 'compare',
      indices: [],
      description: `Move top ${n - 1} disks from ${from} to ${aux} (using ${to})`,
      depth,
      nodeId,
    });
    move(n - 1, from, aux, to, nodeId, depth + 1);

    moveCount++;
    steps.push({
      type: 'move',
      indices: [],
      description: `Move disk ${n} from ${from} → ${to} (Move #${moveCount})`,
      depth,
      nodeId,
      meta: { from, to, disk: n, moveNumber: moveCount },
    });

    steps.push({
      type: 'compare',
      indices: [],
      description: `Move ${n - 1} disks from ${aux} to ${to} (using ${from})`,
      depth,
      nodeId,
    });
    move(n - 1, aux, to, from, nodeId, depth + 1);

    node.status = 'returned';
    steps.push({
      type: 'return',
      indices: [],
      description: `hanoi(${n}, ${from}→${to}) complete`,
      depth,
      nodeId,
    });
  }

  move(n, 'A', 'C', 'B');
  steps.push({ type: 'done', indices: [], description: `Tower of Hanoi with ${n} disks solved in ${moveCount} moves! 🎉` });
  return { steps, nodes };
}
