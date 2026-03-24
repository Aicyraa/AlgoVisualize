import type { Step } from './types';

export type EngineStatus = 'idle' | 'playing' | 'paused' | 'done';

export type EngineListener = (stepIndex: number, step: Step, status: EngineStatus) => void;

export class AnimationEngine {
  private steps: Step[] = [];
  private currentIndex = 0;
  private speed = 1.0; // multiplier (0.1 – 2.0)
  private status: EngineStatus = 'idle';
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private listeners: EngineListener[] = [];

  private readonly BASE_DELAY = 600; // ms at 1x speed

  /** Load a new step array and reset state */
  load(steps: Step[]) {
    this.clear();
    this.steps = steps;
    this.currentIndex = 0;
    this.status = 'idle';
    // Notify with index -1 and undefined step to signal "loaded but not started"
    this.listeners.forEach(l => l(-1, undefined as unknown as Step, this.status));
  }

  play() {
    if (this.status === 'done') return;
    if (this.currentIndex >= this.steps.length) {
      this.status = 'done';
      this.notify();
      return;
    }
    this.status = 'playing';
    this.tick();
  }

  pause() {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.notify();
  }

  reset() {
    this.clear();
    this.currentIndex = 0;
    this.status = 'idle';
    this.notify();
  }

  /** Step forward one step manually */
  stepForward() {
    if (this.currentIndex >= this.steps.length) return;
    const step = this.steps[this.currentIndex];
    this.currentIndex++;
    this.status = this.currentIndex >= this.steps.length ? 'done' : 'paused';
    this.notifyStep(this.currentIndex - 1, step);
  }

  setSpeed(speed: number) {
    this.speed = Math.max(0.1, Math.min(3.0, speed));
  }

  getSpeed() { return this.speed; }
  getStatus() { return this.status; }
  getCurrentIndex() { return this.currentIndex; }
  getTotalSteps() { return this.steps.length; }
  getStep(i: number): Step | undefined { return this.steps[i]; }

  subscribe(listener: EngineListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private get delay() {
    return this.BASE_DELAY / this.speed;
  }

  private tick() {
    if (this.status !== 'playing') return;
    if (this.currentIndex >= this.steps.length) {
      this.status = 'done';
      this.notify();
      return;
    }

    const step = this.steps[this.currentIndex];
    this.currentIndex++;
    this.notifyStep(this.currentIndex - 1, step);

    if (this.status === 'playing') {
      this.timeoutId = setTimeout(() => this.tick(), this.delay);
    }
  }

  private clear() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private notify() {
    const step = this.steps[this.currentIndex - 1];
    const idx = this.currentIndex - 1;
    this.listeners.forEach(l => l(idx, step, this.status));
  }

  private notifyStep(idx: number, step: Step) {
    this.listeners.forEach(l => l(idx, step, this.status));
  }
}

export const engine = new AnimationEngine();
