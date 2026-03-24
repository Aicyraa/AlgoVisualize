import type { EngineStatus } from '../../engine/AnimationEngine';

interface PlayPauseButtonProps {
  status: EngineStatus;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  disabled?: boolean;
}

export function PlayPauseButton({ status, onPlay, onPause, onReset, onStep, disabled }: PlayPauseButtonProps) {
  return (
    <>
      {status === 'playing' ? (
        <button className="btn btn--pause" onClick={onPause}>
          Pause
        </button>
      ) : (
        <button
          className="btn btn--play"
          onClick={onPlay}
          disabled={disabled || status === 'done'}
        >
          {status === 'paused' ? 'Resume' : 'Play'}
        </button>
      )}
      <button
        className="btn btn--icon"
        onClick={onStep}
        disabled={disabled || status === 'playing' || status === 'done'}
        title="Step forward"
      >
        Step
      </button>
      <button className="btn btn--reset" onClick={onReset}>
        Reset
      </button>
    </>
  );
}
