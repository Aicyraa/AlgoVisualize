import type { ReactNode } from 'react';
import { useCanvasTransform } from '../hooks/useCanvasTransform';

interface CanvasWorkspaceProps {
  children: ReactNode;
}

export function CanvasWorkspace({ children }: CanvasWorkspaceProps) {
  const { transform, containerRef, handlers } = useCanvasTransform();

  // The inner div is positioned at 50%/50% of the canvas.
  // The CSS transform then translates from that center point.
  // At transform {x:0, y:0, scale:1}, content sits centered.
  return (
    <div className="canvas-workspace" ref={containerRef} {...handlers}>
      <div
        className="canvas-inner"
        style={{
          transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
