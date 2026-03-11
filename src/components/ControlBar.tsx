import { useState, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import type { AlgorithmMode, SortingAlgorithm, RecursionScenario, ElementType } from '../engine/types';
import type { EngineStatus } from '../engine/AnimationEngine';
import { SpeedSlider } from './ui/SpeedSlider';

interface ControlBarProps {
  mode: AlgorithmMode;
  sortAlgorithm: SortingAlgorithm;
  recursionScenario: RecursionScenario;
  elementType: ElementType;
  speed: number;
  status: EngineStatus;
  progress: number;
  inputValue: string;
  hasSteps: boolean;
  onModeChange: (mode: AlgorithmMode) => void;
  onSortAlgorithmChange: (algo: SortingAlgorithm) => void;
  onRecursionScenarioChange: (scenario: RecursionScenario) => void;
  onElementTypeChange: (type: ElementType) => void;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  onRandom: () => void;
}

export function ControlBar({
  mode,
  sortAlgorithm,
  recursionScenario,
  elementType,
  speed,
  status,
  progress,
  inputValue,
  hasSteps,
  onModeChange,
  onSortAlgorithmChange,
  onRecursionScenarioChange,
  onElementTypeChange,
  onSpeedChange,
  onPlay,
  onPause,
  onReset,
  onStep,
  onInputChange,
  onGenerate,
  onRandom,
}: ControlBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const isRunning = status === 'playing';
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
      setCollapsed(false);
    }
  }, []);

  if (collapsed) {
    return (
      <Draggable
        nodeRef={toggleRef as React.RefObject<HTMLElement>}
        position={dragPos}
        onStart={onToggleDragStart}
        onDrag={onToggleDrag}
        onStop={onToggleDragStop}
      >
        <div className="sidebar-toggle" ref={toggleRef}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable
      handle=".sidebar__header"
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      position={dragPos}
      onStop={onDragStop}
    >
      <div className="sidebar" ref={nodeRef}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            Inztra<span>lise</span>
          </div>
          <button className="sidebar__close" onClick={() => setCollapsed(true)} title="Collapse">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sidebar__body">
          {/* Mode */}
          <div className="sidebar__section">
            <label className="sidebar__label">Mode</label>
            <div className="sidebar__row">
              <button
                className={`btn btn--sm ${mode === 'sorting' ? 'btn--active' : ''}`}
                onClick={() => onModeChange('sorting')}
                disabled={isRunning}
              >
                Sorting
              </button>
              <button
                className={`btn btn--sm ${mode === 'recursion' ? 'btn--active' : ''}`}
                onClick={() => onModeChange('recursion')}
                disabled={isRunning}
              >
                Recursion
              </button>
            </div>
          </div>

          {/* Algorithm */}
          <div className="sidebar__section">
            <label className="sidebar__label">Algorithm</label>
            {mode === 'sorting' ? (
              <select
                className="ctrl-select"
                value={sortAlgorithm}
                onChange={e => onSortAlgorithmChange(e.target.value as SortingAlgorithm)}
                disabled={isRunning}
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            ) : (
              <select
                className="ctrl-select"
                value={recursionScenario}
                onChange={e => onRecursionScenarioChange(e.target.value as RecursionScenario)}
                disabled={isRunning}
              >
                <option value="fibonacci">Fibonacci</option>
                <option value="factorial">Factorial</option>
                <option value="hanoi">Tower of Hanoi</option>
              </select>
            )}
          </div>

          {/* Element Type */}
          {mode === 'sorting' && (
            <div className="sidebar__section">
              <label className="sidebar__label">Style</label>
              <select
                className="ctrl-select"
                value={elementType}
                onChange={e => onElementTypeChange(e.target.value as ElementType)}
                disabled={isRunning}
              >
                <option value="bars">Bars</option>
                <option value="circles">Circles</option>
                <option value="squares">Squares</option>
                <option value="array">Array</option>
              </select>
            </div>
          )}

          {/* Input */}
          <div className="sidebar__section">
            <label className="sidebar__label">Data</label>
            <input
              className="ctrl-input"
              type="text"
              placeholder={mode === 'sorting' ? 'e.g. 5,3,8,1,4' : 'e.g. 6'}
              value={inputValue}
              onChange={e => onInputChange(e.target.value)}
              disabled={isRunning}
            />
            <div className="sidebar__row" style={{ marginTop: 6 }}>
              <button className="btn btn--sm" onClick={onGenerate} disabled={isRunning}>
                Go
              </button>
              {mode === 'sorting' && (
                <button className="btn btn--sm" onClick={onRandom} disabled={isRunning}>
                  Random
                </button>
              )}
            </div>
          </div>

          {/* Playback */}
          <div className="sidebar__section">
            <label className="sidebar__label">Playback</label>
            <div className="sidebar__row">
              {status === 'playing' ? (
                <button className="btn btn--sm btn--pause" onClick={onPause}>
                  Pause
                </button>
              ) : (
                <button
                  className="btn btn--sm btn--play"
                  onClick={onPlay}
                  disabled={!hasSteps || status === 'done'}
                >
                  {status === 'paused' ? 'Resume' : 'Play'}
                </button>
              )}
              <button
                className="btn btn--sm btn--icon"
                onClick={onStep}
                disabled={!hasSteps || status === 'playing' || status === 'done'}
              >
                Step
              </button>
              <button className="btn btn--sm btn--reset" onClick={onReset}>
                Reset
              </button>
            </div>
            <div style={{ marginTop: 8 }}>
              <SpeedSlider speed={speed} onSpeedChange={onSpeedChange} />
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
