interface SquareElementProps {
  value: number;
  state?: string;
  style?: React.CSSProperties;
}

export function SquareElement({ value, state, style }: SquareElementProps) {
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`} style={style}>
      <div className="sort-element__square">{value}</div>
    </div>
  );
}
