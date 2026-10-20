import { Box } from 'lucide-react';
import shared from '../../shared.module.css';
import styles from './model-fallback.module.css';
import type { ModelFallbackProps } from './model-fallback.types';

// Explains an unavailable 3D preview and optionally offers a failed-import retry.
export function ModelFallback({ message, detail, onRetry }: ModelFallbackProps) {
  return (
    <div className={styles.modelFallback} role={onRetry ? 'status' : undefined}>
      <Box size={40} />
      <span>{message}</span>

      {detail && <small>{detail}</small>}

      {onRetry && (
        <button
          type="button"
          className={`${shared.secondaryButton} ${shared.smallButton}`}
          onClick={onRetry}
        >
          Retry preview
        </button>
      )}
    </div>
  );
}
