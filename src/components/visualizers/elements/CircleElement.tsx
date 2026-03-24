interface CircleElementProps {
  value: number;
  state?: string;
  style?: React.CSSProperties;
}

export function CircleElement({ value, state, style }: CircleElementProps) {
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`} style={style}>
      <div className="sort-element__circle">{value}</div>
    </div>
  );
}
