interface SquareElementProps {
  value: number;
  state?: string;
}

export function SquareElement({ value, state }: SquareElementProps) {
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`}>
      <div className="sort-element__square">{value}</div>
    </div>
  );
}
