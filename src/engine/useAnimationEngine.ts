import { useEffect, useState, useCallback } from 'react';
import { engine } from './AnimationEngine';
import type { EngineStatus } from './AnimationEngine';
import type { Step } from './types';

export interface EngineState {
  stepIndex: number;
  step: Step | undefined;
  status: EngineStatus;
  progress: number; // 0-100
}

export function useAnimationEngine() {
  const [state, setState] = useState<EngineState>({
    stepIndex: -1,
    step: undefined,
    status: 'idle',
    progress: 0,
  });

  const [speed, setSpeedState] = useState(1.0);

  useEffect(() => {
    const unsub = engine.subscribe((stepIndex, step, status) => {
      setState({
        stepIndex,
        step,
        status,
        progress: engine.getTotalSteps() > 0
          ? Math.round((stepIndex + 1) / engine.getTotalSteps() * 100)
          : 0,
      });
    });
    return unsub;
  }, []);

  const play = useCallback(() => engine.play(), []);
  const pause = useCallback(() => engine.pause(), []);
  const reset = useCallback(() => engine.reset(), []);
  const stepForward = useCallback(() => engine.stepForward(), []);

  const setSpeed = useCallback((s: number) => {
    engine.setSpeed(s);
    setSpeedState(s);
  }, []);

  return { state, speed, play, pause, reset, stepForward, setSpeed };
}
