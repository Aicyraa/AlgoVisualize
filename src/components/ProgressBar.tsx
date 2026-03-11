import type { EngineStatus } from '../engine/AnimationEngine';
import type { StepType } from '../engine/types';

interface ProgressBarProps {
  progress: number;
  stepIndex: number;
  totalSteps: number;
  status: EngineStatus;
  stepType?: StepType;
}

const STATUS_LABELS: Record<EngineStatus, string> = {
  idle: 'Ready',
  playing: 'Running',
  paused: 'Paused',
  done: 'Complete',
};

const STEP_LABELS: Partial<Record<StepType, string>> = {
  compare: 'Comparing',
  swap: 'Swapping',
  sorted: 'Sorted',
  highlight: 'Inspecting',
  pivot: 'Pivot',
  correct: 'Correct',
  'merge-split': 'Splitting',
  'merge-place': 'Placing',
  call: 'Calling',
  return: 'Returning',
  move: 'Moving',
  done: 'Done',
};

export function ProgressBar({ progress, stepIndex, totalSteps, status, stepType }: ProgressBarProps) {
  const current = totalSteps > 0 ? stepIndex + 1 : 0;
  const statusLabel = STATUS_LABELS[status];
  const stepLabel = stepType ? STEP_LABELS[stepType] : undefined;

  return (
    <div className="progress-header">
      <div className="progress-header__info">
        <div className="progress-header__left">
          <span className={`progress-header__status progress-header__status--${status}`}>
            {statusLabel}
          </span>
          {stepLabel && (status === 'playing' || status === 'paused') && (
            <span className="progress-header__step-type">{stepLabel}</span>
          )}
        </div>
        <div className="progress-header__right">
          <span className="progress-header__counter">
            {current} <span className="progress-header__sep">/</span> {totalSteps}
          </span>
          <span className="progress-header__pct">{progress}%</span>
        </div>
      </div>
      <div className="progress-header__track">
        <div
          className={`progress-header__fill progress-header__fill--${status}`}
          style={{ width: `${progress}%` }}
        />
        {totalSteps > 0 && (
          <div
            className="progress-header__thumb"
            style={{ left: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );
}
