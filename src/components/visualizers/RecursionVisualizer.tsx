import { useRef, useEffect, useState } from 'react';
import type { RecursionNode, Step } from '../../engine/types';

interface RecursionVisualizerProps {
  nodes: RecursionNode[];
  currentStep: Step | undefined;
}

interface LineData {
  parentId: string;
  childId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
}

interface ReturnBubble {
  value: number | string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  key: string;
}

// ─── Tree layout ──────────────────────────────────────────────────────────────
// Returns a map of nodeId → { x, y } in logical grid units.
// x is the center column (fractional), y is the depth row.
// Algorithm: post-order — give each leaf width=1, each parent width=sum of children.
//            Parent x = average of first-child.x and last-child.x.

interface LayoutNode {
  x: number; // center x in grid units (0-based)
  y: number; // depth
  width: number; // subtree width in grid units
}

function computeTreeLayout(nodes: RecursionNode[]): Map<string, LayoutNode> {
  if (nodes.length === 0) return new Map();

  // Build adjacency
  const childrenOf = new Map<string, string[]>();
  let rootId: string | null = null;
  for (const n of nodes) {
    if (!n.parentId) rootId = n.id;
    childrenOf.set(n.id, [...n.children]);
  }
  if (!rootId) return new Map();

  const result = new Map<string, LayoutNode>();

  // Post-order: compute subtree widths and assign x offsets
  let leafIndex = 0; // running counter for leaf placement

  function visit(id: string, depth: number): { x: number; width: number } {
    const children = childrenOf.get(id) ?? [];
    const visibleChildren = children.filter(cid => nodes.some(n => n.id === cid));

    if (visibleChildren.length === 0) {
      // Leaf: occupy one column
      const x = leafIndex + 0.5;
      leafIndex++;
      result.set(id, { x, y: depth, width: 1 });
      return { x, width: 1 };
    }

    let totalWidth = 0;
    let firstX = 0;
    let lastX = 0;
    for (let i = 0; i < visibleChildren.length; i++) {
      const child = visit(visibleChildren[i], depth + 1);
      if (i === 0) firstX = child.x;
      lastX = child.x;
      totalWidth += child.width;
    }

    const x = (firstX + lastX) / 2;
    result.set(id, { x, y: depth, width: totalWidth });
    return { x, width: totalWidth };
  }

  visit(rootId, 0);
  return result;
}

// ─── Edge state ───────────────────────────────────────────────────────────────
type EdgeState = 'animating' | 'settled';
type EdgeMap = Map<string, EdgeState>;

function edgeKey(parentId: string, childId: string) {
  return `${parentId}->${childId}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const NODE_W = 148; // px, must match CSS .recursion-node__box width
const NODE_H = 52;  // px — actual card height: header(~28) + divider(1) + section(~20) + borders(2) ≈ 51px
const H_GAP  = 12;  // horizontal gap between node cards
const V_GAP  = 60;  // vertical gap between depth levels

export function RecursionVisualizer({ nodes, currentStep }: RecursionVisualizerProps) {
  // Progressive state tracked across steps
  const nodeValuesRef   = useRef<Map<string, number | string>>(new Map());
  const nodeStatusRef   = useRef<Map<string, 'active' | 'returned'>>(new Map());
  const lastStepRef     = useRef<Step | undefined>(undefined);
  const returningPairRef = useRef<Set<string>>(new Set());
  const prevNodesRef    = useRef<RecursionNode[]>([]);
  const edgeMapRef      = useRef<EdgeMap>(new Map());

  // Return bubble
  const [bubble, setBubble]           = useState<ReturnBubble | null>(null);
  const bubbleRafRef                  = useRef<number | null>(null);
  const bubbleCounterRef              = useRef(0);
  const pendingBubbleRef              = useRef<{ fromId: string; toId: string; value: number | string } | null>(null);

  // Animated edges (for the draw-in CSS keyframe)
  const [animatingEdges, setAnimatingEdges] = useState<Set<string>>(new Set());

  // Layout state (recomputed whenever nodes change)
  const [layout, setLayout]     = useState<Map<string, LayoutNode>>(new Map());
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [lines, setLines]       = useState<LineData[]>([]);

  const containerRef  = useRef<HTMLDivElement>(null);

  // ─── Step-tracking (runs synchronously during render) ──────────────────────
  let newEdgeKey: string | null = null;

  if (prevNodesRef.current !== nodes) {
    prevNodesRef.current = nodes;
    nodeValuesRef.current = new Map();
    nodeStatusRef.current = new Map();
    lastStepRef.current = undefined;
    returningPairRef.current = new Set();
    edgeMapRef.current = new Map();
    pendingBubbleRef.current = null;
  }

  if (currentStep && currentStep !== lastStepRef.current) {
    lastStepRef.current = currentStep;
    returningPairRef.current = new Set();
    pendingBubbleRef.current = null;

    if (currentStep.type === 'call' && currentStep.nodeId) {
      nodeStatusRef.current.set(currentStep.nodeId, 'active');
      const parentId = currentStep.meta?.parentId as string | undefined;
      if (parentId) {
        const key = edgeKey(parentId, currentStep.nodeId);
        if (!edgeMapRef.current.has(key)) {
          edgeMapRef.current.set(key, 'animating');
          newEdgeKey = key;
        }
      }
    }

    if (currentStep.type === 'return' && currentStep.nodeId) {
      const returnValue = currentStep.meta?.returnValue;
      if (returnValue !== undefined) {
        nodeValuesRef.current.set(currentStep.nodeId, returnValue as number | string);
      }
      nodeStatusRef.current.set(currentStep.nodeId, 'returned');
      returningPairRef.current.add(currentStep.nodeId);
      const parentId = currentStep.meta?.parentId as string | undefined;
      if (parentId) {
        returningPairRef.current.add(parentId);
        if (returnValue !== undefined) {
          pendingBubbleRef.current = {
            fromId: currentStep.nodeId,
            toId: parentId,
            value: returnValue as number | string,
          };
        }
        edgeMapRef.current.set(edgeKey(parentId, currentStep.nodeId), 'settled');
      }
    }

    if (currentStep.type === 'done') {
      for (const node of nodes) {
        nodeStatusRef.current.set(node.id, 'returned');
        if (node.returnValue !== undefined) nodeValuesRef.current.set(node.id, node.returnValue);
      }
      for (const node of nodes) {
        if (node.parentId) {
          const key = edgeKey(node.parentId, node.id);
          if (!edgeMapRef.current.has(key)) edgeMapRef.current.set(key, 'settled');
        }
      }
    }
  }

  if (!currentStep) {
    nodeValuesRef.current = new Map();
    nodeStatusRef.current = new Map();
    lastStepRef.current = undefined;
    returningPairRef.current = new Set();
    edgeMapRef.current = new Map();
    pendingBubbleRef.current = null;
    if (bubble) setBubble(null);
  }

  // ─── Compute layout whenever nodes change ──────────────────────────────────
  useEffect(() => {
    if (nodes.length === 0) { setLayout(new Map()); setCanvasSize({ w: 0, h: 0 }); return; }

    const computed = computeTreeLayout(nodes);

    // Find max x (in grid units) to size canvas
    let maxX = 0;
    let maxY = 0;
    for (const v of computed.values()) {
      if (v.x > maxX) maxX = v.x;
      if (v.y > maxY) maxY = v.y;
    }

    // Convert grid units → px:
    // x * (NODE_W + H_GAP) is the pixel center, but we need some padding on left
    const canvasW = Math.ceil(maxX + 0.5) * (NODE_W + H_GAP);
    const canvasH = (maxY + 1) * (NODE_H + V_GAP);

    setLayout(computed);
    setCanvasSize({ w: canvasW, h: canvasH });
  }, [nodes]);

  // ─── Compute SVG lines from layout (no DOM measurement needed) ─────────────
  useEffect(() => {
    if (layout.size === 0) { setLines([]); return; }
    const SLOT_W = NODE_W + H_GAP;
    const SLOT_H = NODE_H + V_GAP;

    const newLines: LineData[] = [];

    for (const node of nodes) {
      if (!node.parentId) continue;
      const key = edgeKey(node.parentId, node.id);
      if (!edgeMapRef.current.has(key)) continue;

      const pLayout = layout.get(node.parentId);
      const cLayout = layout.get(node.id);
      if (!pLayout || !cLayout) continue;

      // Center-bottom of parent card → center-top of child card
      const x1 = pLayout.x * SLOT_W;
      const y1 = pLayout.y * SLOT_H + NODE_H;
      const x2 = cLayout.x * SLOT_W;
      const y2 = cLayout.y * SLOT_H;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      newLines.push({ parentId: node.parentId, childId: node.id, x1, y1, x2, y2, length });
    }

    setLines(newLines);

    // Trigger draw animation for new edge
    if (newEdgeKey) {
      setAnimatingEdges(prev => { const n = new Set(prev); n.add(newEdgeKey!); return n; });
      setTimeout(() => {
        setAnimatingEdges(prev => { const n = new Set(prev); n.delete(newEdgeKey!); return n; });
        edgeMapRef.current.set(newEdgeKey!, 'settled');
      }, 500);
    }

    // Bubble animation from pendingBubble
    const pending = pendingBubbleRef.current;
    if (pending) {
      const line = newLines.find(l => l.childId === pending.fromId && l.parentId === pending.toId);
      if (line) {
        bubbleCounterRef.current++;
        if (bubbleRafRef.current) { cancelAnimationFrame(bubbleRafRef.current); bubbleRafRef.current = null; }
        const duration = 520;
        const startTime = performance.now();
        const fromX = line.x2; const fromY = line.y2;
        const toX = line.x1;   const toY = line.y1;
        const bkey = `bubble-${bubbleCounterRef.current}`;
        const animate = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setBubble({ value: pending.value, fromX, fromY, toX, toY, progress: ease, key: bkey });
          if (t < 1) {
            bubbleRafRef.current = requestAnimationFrame(animate);
          } else {
            bubbleRafRef.current = null;
            setTimeout(() => setBubble(null), 120);
          }
        };
        bubbleRafRef.current = requestAnimationFrame(animate);
      }
      pendingBubbleRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, nodes, currentStep]);

  // Cleanup on unmount
  useEffect(() => () => { if (bubbleRafRef.current) cancelAnimationFrame(bubbleRafRef.current); }, []);

  // ─── Bubble position ───────────────────────────────────────────────────────
  let bubbleCx = 0, bubbleCy = 0, bubbleOpacity = 0, bubbleScale = 1;
  if (bubble) {
    const t = bubble.progress;
    bubbleCx = bubble.fromX + (bubble.toX - bubble.fromX) * t;
    bubbleCy = bubble.fromY + (bubble.toY - bubble.fromY) * t;
    bubbleOpacity = t < 0.08 ? t / 0.08 : t > 0.82 ? (1 - t) / 0.18 : 1;
    bubbleScale = 0.85 + 0.2 * Math.sin(t * Math.PI);
  }

  // ─── Early empty state ────────────────────────────────────────────────────
  if (nodes.length === 0) {
    return (
      <div className="recursion-visualizer">
        <div className="empty-state">
          <div className="empty-state__icon">{ }</div>
          <div className="empty-state__text">Select a recursion scenario and input to visualize.</div>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  const activeNodeId = currentStep?.nodeId;
  const isComplete   = currentStep?.type === 'done';
  const isReturnStep = currentStep?.type === 'return';
  const isCompareStep = currentStep?.type === 'compare';
  const stepIsBase   = currentStep?.meta?.isBase === true;

  const SLOT_W = NODE_W + H_GAP;
  const SLOT_H = NODE_H + V_GAP;

  // Cubic bezier path: control points make a smooth S-curve
  // from center-bottom of parent to center-top of child
  function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
    const cy = (y1 + y2) / 2;
    return `M ${x1},${y1} C ${x1},${cy} ${x2},${cy} ${x2},${y2}`;
  }

  return (
    <div
      className="recursion-visualizer"
      ref={containerRef}
      style={{ position: 'relative', overflowX: 'auto', overflowY: 'auto' }}
    >
      {/* Fixed-size inner canvas that holds absolutely-positioned nodes */}
      <div
        style={{
          position: 'relative',
          width: canvasSize.w,
          minWidth: canvasSize.w,
          height: canvasSize.h,
          minHeight: canvasSize.h,
          margin: '0 auto',
        }}
      >
        {/* SVG edge layer (below nodes) */}
        <svg
          className="recursion-lines"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
        >
          {lines.map(line => {
            const key = edgeKey(line.parentId, line.childId);
            const isAnimating   = animatingEdges.has(key);
            const childReturned = nodeStatusRef.current.get(line.childId) === 'returned';
            const isReturning   = returningPairRef.current.has(line.childId) && returningPairRef.current.has(line.parentId);
            const childActive   = nodeStatusRef.current.get(line.childId) === 'active' && !childReturned;

            const d = bezierPath(line.x1, line.y1, line.x2, line.y2);

            return (
              <g key={`${line.parentId}-${line.childId}`}>
                {/* Bezier curve path instead of straight line */}
                <path
                  d={d}
                  className={[
                    'recursion-line',
                    isAnimating   ? 'recursion-line--drawing'  : '',
                    childReturned ? 'recursion-line--returned' : '',
                    isReturning   ? 'recursion-line--active'   : '',
                    childActive   ? 'recursion-line--calling'  : '',
                  ].filter(Boolean).join(' ')}
                  style={isAnimating ? ({
                    strokeDasharray: line.length,
                    '--line-len': line.length,
                  } as React.CSSProperties & { '--line-len': number }) : undefined}
                />
                {/* Dot at parent bottom */}
                <circle cx={line.x1} cy={line.y1} r="3"
                  className={`recursion-dot ${childReturned ? 'recursion-dot--returned' : ''} ${childActive ? 'recursion-dot--active' : ''}`} />
                {/* Dot at child top */}
                <circle cx={line.x2} cy={line.y2} r="3"
                  className={`recursion-dot ${childReturned ? 'recursion-dot--returned' : ''} ${childActive ? 'recursion-dot--active' : ''}`} />
              </g>
            );
          })}

          {/* Animated return value bubble */}
          {bubble && (
            <g
              className="return-bubble"
              opacity={bubbleOpacity}
              transform={`translate(${bubbleCx}, ${bubbleCy}) scale(${bubbleScale})`}
            >
              <circle r="20" className="return-bubble__glow" />
              <circle r="17" className="return-bubble__bg" />
              <circle r="14" className="return-bubble__circle" />
              <text className="return-bubble__text" x="0" y="0">{bubble.value}</text>
              <circle r="3.5" cx={-22} cy={0} className="return-bubble__trail" opacity={0.5} />
              <circle r="2"   cx={-32} cy={0} className="return-bubble__trail" opacity={0.25} />
            </g>
          )}
        </svg>

        {/* Absolutely-positioned node cards */}
        {nodes.map(node => {
          const lNode = layout.get(node.id);
          if (!lNode) return null;

          const left = lNode.x * SLOT_W - NODE_W / 2;
          const top  = lNode.y * SLOT_H;

          const progStatus = nodeStatusRef.current.get(node.id);
          const progValue  = nodeValuesRef.current.get(node.id);
          const isPulsing  = returningPairRef.current.has(node.id);
          const isNodeBase = node.recursiveCase === '—';

          let statusClass = '';
          if (isComplete)            statusClass = 'status-returned';
          else if (isPulsing)        statusClass = 'status-returning';
          else if (node.id === activeNodeId) statusClass = 'status-active';
          else if (progStatus === 'returned') statusClass = 'status-returned';
          else if (progStatus === 'active')   statusClass = 'status-active';

          const isThisNodeActive    = node.id === activeNodeId;
          const highlightBase       = isThisNodeActive && isReturnStep  && stepIsBase;
          const highlightRecursive  = isThisNodeActive && isCompareStep;
          const displayValue        = progValue !== undefined ? progValue : (progStatus ? '?' : '');

          return (
            <div
              key={node.id}
              className={`recursion-node ${statusClass}`}
              style={{
                position: 'absolute',
                left,
                top,
                width: NODE_W,
                transition: 'top 0.35s ease, left 0.35s ease',
              }}
            >
              <div className="recursion-node__box">
                <div className="recursion-node__header">
                  <span className="recursion-node__label">{node.label}</span>
                  {progStatus && (
                    <span className="recursion-node__value">= {displayValue}</span>
                  )}
                </div>
                <div className="recursion-node__sections">
                  {isNodeBase ? (
                    <div className={`recursion-node__section ${highlightBase ? 'recursion-node__section--active' : ''}`}>
                      <span className="recursion-node__section-tag">Base</span>
                      {node.baseCase}
                    </div>
                  ) : (
                    <div className={`recursion-node__section ${highlightRecursive ? 'recursion-node__section--active' : ''}`}>
                      <span className="recursion-node__section-tag">Rec</span>
                      {node.recursiveCase}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
