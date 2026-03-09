interface BarElementProps {
  value: number;
  maxValue: number;
  state?: string;
}

export function BarElement({ value, maxValue, state }: BarElementProps) {
  const height = Math.max(12, (value / maxValue) * 280);
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`}>
      <span className="sort-element__label">{value}</span>
      <div className="sort-element__bar" style={{ height: `${height}px` }} />
    </div>
  );
}
