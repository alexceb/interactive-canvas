import { Box } from 'lucide-react';
import type { ModelFallbackProps } from './model-fallback.types';

/** Explains an unavailable 3D preview and optionally offers a failed-import retry. */
export function ModelFallback({ message, detail, onRetry }: ModelFallbackProps) {
  return (
    <div className="model-fallback" role={onRetry ? 'status' : undefined}>
      <Box size={40} />
      <span>{message}</span>
      {detail && <small>{detail}</small>}
      {onRetry && (
        <button type="button" className="secondary-button small-button" onClick={onRetry}>
          Retry preview
        </button>
      )}
    </div>
  );
}
