import type { RecursionNode, Step } from '../../engine/types';

interface RecursionVisualizerProps {
  nodes: RecursionNode[];
  currentStep: Step | undefined;
}

export function RecursionVisualizer({ nodes, currentStep }: RecursionVisualizerProps) {
  if (nodes.length === 0) {
    return (
      <div className="recursion-visualizer">
        <div className="empty-state">
          <div className="empty-state__icon">{ }</div>
          <div className="empty-state__text">
            Select a recursion scenario and input to visualize.
          </div>
        </div>
      </div>
    );
  }

  // Build node status based on current step
  const activeNodeId = currentStep?.nodeId;
  const isComplete = currentStep?.type === 'done';

  // Group nodes by depth level for tree rendering
  const maxDepth = Math.max(...nodes.map(n => n.depth));
  const levels: RecursionNode[][] = [];
  for (let d = 0; d <= maxDepth; d++) {
    levels.push(nodes.filter(n => n.depth === d));
  }

  return (
    <div className="recursion-visualizer">
      {levels.map((level, depth) => (
        <div key={depth} className="recursion-level">
          {level.map(node => {
            let statusClass = '';
            if (isComplete) {
              statusClass = 'status-returned';
            } else if (node.id === activeNodeId) {
              statusClass = 'status-active';
            } else if (node.status === 'returned') {
              statusClass = 'status-returned';
            }

            return (
              <div key={node.id} className={`recursion-node ${statusClass}`}>
                <div className="recursion-node__box">
                  {node.label}
                </div>
                {node.returnValue !== undefined && (
                  <span className="recursion-node__return">= {node.returnValue}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
