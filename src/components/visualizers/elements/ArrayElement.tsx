interface ArrayElementProps {
  value: number;
  state?: string;
}

export function ArrayElement({ value, state }: ArrayElementProps) {
  return (
    <div className={`sort-element ${state ? `state-${state}` : ''}`}>
      <div className="sort-element__cell">{value}</div>
    </div>
  );
}
