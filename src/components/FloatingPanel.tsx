import { useRef, useEffect, useState, useCallback } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import type { Step } from '../engine/types';
import type { EngineStatus } from '../engine/AnimationEngine';

interface FloatingPanelProps {
  visible: boolean;
  onToggle: () => void;
  currentStep: Step | undefined;
  stepIndex: number;
  totalSteps: number;
  status: EngineStatus;
  algorithmName: string;
  recentSteps: { index: number; description: string; type: string }[];
}

export function FloatingPanel({
  visible,
  onToggle,
  currentStep,
  stepIndex,
  totalSteps,
  status,
  algorithmName,
  recentSteps,
}: FloatingPanelProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const didDragRef = useRef(false);

  const onDragStop = useCallback((_e: DraggableEvent, data: DraggableData) => {
    setDragPos({ x: data.x, y: data.y });
  }, []);

  const onToggleDragStart = useCallback(() => {
    didDragRef.current = false;
  }, []);

  const onToggleDrag = useCallback(() => {
    didDragRef.current = true;
  }, []);

  const onToggleDragStop = useCallback((_e: DraggableEvent, data: DraggableData) => {
    setDragPos({ x: data.x, y: data.y });
    if (!didDragRef.current) {
      onToggle();
    }
  }, [onToggle]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [recentSteps.length]);

  if (!visible) {
    return (
      <Draggable
        nodeRef={toggleRef as React.RefObject<HTMLElement>}
        position={dragPos}
        onStart={onToggleDragStart}
        onDrag={onToggleDrag}
        onStop={onToggleDragStop}
      >
        <div className="panel-toggle" ref={toggleRef} title="Open steps panel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable
      handle=".floating-panel__header"
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      position={dragPos}
      onStop={onDragStop}
    >
      <div className="floating-panel" ref={nodeRef}>
        <div className="floating-panel__header">
          <span className="floating-panel__title">{algorithmName}</span>
          <button className="floating-panel__close" onClick={onToggle}>
            &times;
          </button>
        </div>
        <div className="floating-panel__body">
          <div className="panel-stat">
            <span className="panel-stat__label">Status</span>
            <span className={`panel-stat__value ${status === 'done' ? 'done' : ''}`}>
              {status === 'idle' ? 'Ready' : status === 'playing' ? 'Running' : status === 'paused' ? 'Paused' : 'Complete'}
            </span>
          </div>
          <div className="panel-stat">
            <span className="panel-stat__label">Step</span>
            <span className="panel-stat__value">
              {totalSteps > 0 ? `${stepIndex + 1} / ${totalSteps}` : '--'}
            </span>
          </div>
          {currentStep && (
            <div className="algo-info">
              <strong>{currentStep.type}:</strong> {currentStep.description}
            </div>
          )}
          <div className="panel-step-log" ref={logRef}>
            {recentSteps.map((entry, i) => (
              <div
                key={entry.index}
                className={`panel-step-entry ${i === recentSteps.length - 1 ? 'active' : ''}`}
              >
                <span className={`tag ${entry.type}`}>{entry.type}</span>{' '}
                {entry.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
