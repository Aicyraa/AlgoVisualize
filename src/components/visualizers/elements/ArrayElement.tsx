interface ArrayElementProps {
  value: number;
  state?: string;
  style?: React.CSSProperties;
}

export function ArrayElement({ value, state, style }: ArrayElementProps) {
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`} style={style}>
      <div className="sort-element__cell">{value}</div>
    </div>
  );
}
