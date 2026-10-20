import { BoardItems } from '../board-items/board-items';
import { ZoomControls } from '../zoom-controls/zoom-controls';
import styles from './canvas.module.css';
import type { CanvasProps } from './canvas.types';
import { handleCanvasKeyDown } from './canvas.utils';
import { useCanvasGestures } from './use-canvas-gestures';
import { useCanvasViewport } from './use-canvas-viewport';

// Hosts the pan-and-zoom board, gesture navigation, and anchored comment content.
export function Canvas({ controller, tool, spaceHeld, onPlace, children }: CanvasProps) {
  const { host, world } = useCanvasViewport(controller);
  const gestures = useCanvasGestures({ controller, tool, spaceHeld, onPlace });
  return (
    <main
      className={styles.canvas}
      ref={host}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: The board implements keyboard pan, zoom, and comment placement and must be focusable.
      tabIndex={0}
      aria-label="Design canvas"
      data-testid="canvas"
      data-tool={spaceHeld ? 'pan' : tool}
      {...gestures}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => handleCanvasKeyDown(event, controller)}
    >
      <div className={styles.canvasTopline} aria-hidden="true">
        <span className={styles.canvasSectionDot} /> EXPLORATION BOARD{' '}
        <span className={styles.toplineDivider}>/</span> 4 objects
      </div>
      <div className={styles.canvasWorld} ref={world} data-testid="canvas-world">
        <BoardItems />
        {children}
      </div>
      <div className={styles.canvasBottomHint}>
        {tool === 'comment' && !spaceHeld
          ? 'Click anywhere to start a conversation'
          : 'Drag to pan · Ctrl / ⌘ + scroll to zoom'}
      </div>
      <ZoomControls controller={controller} />
    </main>
  );
}
