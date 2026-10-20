import { Box } from 'lucide-react';
import { ModelPreview } from '../model-preview/model-preview';
import type { ModelCardProps } from './model-card.types';

/** Frames a model preview with its board position, review caption, and object label. */
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
      className={`board-item model-card ${tone}`}
      style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }}
      aria-label={`${ordinal} — ${name}`}
    >
      <div className="item-caption">
        <span>
          {ordinal} / {caption}
        </span>
        <Box size={14} />
      </div>
      <ModelPreview shape={shape} />
      <div className="model-footer">
        <span>{description}</span>
        <span className="small-pill">3D OBJECT</span>
      </div>
      <div className="item-label">
        {name}{' '}
        <span>
          · {bounds.width} × {bounds.height}
        </span>
      </div>
    </article>
  );
}
