interface SpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedSlider({ speed, onSpeedChange }: SpeedSliderProps) {
  return (
    <div className="speed-control">
      <span>{speed.toFixed(1)}x</span>
      <input
        type="range"
        className="speed-slider"
        min="0.1"
        max="3.0"
        step="0.1"
        value={speed}
        onChange={e => onSpeedChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
