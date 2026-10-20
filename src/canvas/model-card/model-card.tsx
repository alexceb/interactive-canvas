import { Box } from 'lucide-react';
import shared from '../../shared.module.css';
import { ModelPreview } from '../model-preview/model-preview';
import styles from './model-card.module.css';
import type { ModelCardProps } from './model-card.types';

// Frames a model preview with its board position, review caption, and object label.
export function ModelCard({
  ordinal,
  name,
  caption,
  description,
  shape,
  tone,
  bounds,
}: ModelCardProps) {
  return (
    <article
      className={`${shared.boardItem} ${styles.modelCard} ${styles[tone]}`}
      style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }}
      aria-label={`${ordinal} — ${name}`}
    >
      <div className={`${shared.itemCaption} ${styles.itemCaption}`}>
        <span>
          {ordinal} / {caption}
        </span>
        <Box size={14} />
      </div>
      <ModelPreview shape={shape} />
      <div className={styles.modelFooter}>
        <span>{description}</span>
        <span className={styles.smallPill}>3D OBJECT</span>
      </div>
      <div className={shared.itemLabel}>
        {name}{' '}
        <span>
          · {bounds.width} × {bounds.height}
        </span>
      </div>
    </article>
  );
}
