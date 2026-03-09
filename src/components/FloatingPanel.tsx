import { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import type { Step } from '../engine/types';
import type { EngineStatus } from '../engine/AnimationEngine';

interface FloatingPanelProps {
  visible: boolean;
  onClose: () => void;
  currentStep: Step | undefined;
  stepIndex: number;
  totalSteps: number;
  status: EngineStatus;
  algorithmName: string;
  recentSteps: { index: number; description: string; type: string }[];
}

export function FloatingPanel({
  visible,
  onClose,
  currentStep,
  stepIndex,
  totalSteps,
  status,
  algorithmName,
  recentSteps,
}: FloatingPanelProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [recentSteps.length]);

  if (!visible) return null;

  return (
    <Draggable handle=".floating-panel__header" nodeRef={nodeRef as React.RefObject<HTMLElement>}>
      <div className="floating-panel" ref={nodeRef} style={{ top: 80, right: 20 }}>
        <div className="floating-panel__header">
          <span className="floating-panel__title">{algorithmName}</span>
          <button className="floating-panel__close" onClick={onClose}>
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
              {totalSteps > 0 ? `${stepIndex + 1} / ${totalSteps}` : '—'}
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
