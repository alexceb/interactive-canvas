import { useEffect, useRef } from 'react';
import { ModelFallback } from '../model-fallback/model-fallback';
import type { ModelProps } from './model.types';
import { createModelScene } from './model-scene';

// Renders one static Three.js shape and releases its WebGL resources on unmount.
export function Model({ shape }: ModelProps) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (element) return createModelScene(element, shape);
  }, [shape]);
  return (
    <div className="model-render" ref={host} role="img" aria-label={`Static 3D ${shape}`}>
      <ModelFallback
        message="3D preview unavailable"
        detail="WebGL is required to display this model."
      />
    </div>
  );
}
