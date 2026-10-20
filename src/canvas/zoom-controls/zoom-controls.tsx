import { Maximize, Minus, Plus } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { TooltipButton } from '../../components/tooltip-button/tooltip-button';
import shared from '../../shared.module.css';
import { ZOOM_STEP } from '../canvas/canvas.constants';
import styles from './zoom-controls.module.css';
import type { ZoomControlsProps } from './zoom-controls.types';

// Provides zoom in/out, actual-size reset, and fit-to-content actions.
export function ZoomControls({ controller }: ZoomControlsProps) {
  const zoom = useSyncExternalStore(controller.subscribe, controller.getZoom);
  return (
    <section
      className={styles.zoomControls}
      aria-label="Canvas zoom controls"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <TooltipButton
        label="Zoom out"
        type="button"
        className={`${shared.iconButton} ${styles.iconButton}`}
        aria-label="Zoom out"
        onClick={() => controller.zoom(zoom / ZOOM_STEP)}
      >
        <Minus size={16} />
      </TooltipButton>
      <TooltipButton
        label="Reset to 100%"
        type="button"
        className={styles.zoomValue}
        aria-label={`Zoom ${Math.round(zoom * 100)}%. Reset to 100%`}
        onClick={() => controller.zoom(1)}
      >
        {Math.round(zoom * 100)}%
      </TooltipButton>
      <TooltipButton
        label="Zoom in"
        type="button"
        className={`${shared.iconButton} ${styles.iconButton}`}
        aria-label="Zoom in"
        onClick={() => controller.zoom(zoom * ZOOM_STEP)}
      >
        <Plus size={16} />
      </TooltipButton>
      <span className={styles.controlDivider} />
      <TooltipButton
        label="Fit content · 0"
        type="button"
        className={`${shared.iconButton} ${styles.iconButton}`}
        aria-label="Fit content"
        onClick={() => controller.fit()}
      >
        <Maximize size={16} />
      </TooltipButton>
    </section>
  );
}
