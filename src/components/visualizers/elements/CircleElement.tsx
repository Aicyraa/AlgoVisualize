interface CircleElementProps {
  value: number;
  state?: string;
}

export function CircleElement({ value, state }: CircleElementProps) {
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`}>
      <div className="sort-element__circle">{value}</div>
    </div>
  );
}
