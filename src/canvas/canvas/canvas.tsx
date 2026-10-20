import { BoardItems } from '../board-items/board-items';
import { ZoomControls } from '../zoom-controls/zoom-controls';
import type { CanvasProps } from './canvas.types';
import { handleCanvasKeyDown } from './canvas.utils';
import { useCanvasGestures } from './use-canvas-gestures';
import { useCanvasViewport } from './use-canvas-viewport';

/** Hosts the pan-and-zoom board, gesture navigation, and anchored comment content. */
export function Canvas({ controller, tool, spaceHeld, onPlace, children }: CanvasProps) {
  const { host, world } = useCanvasViewport(controller);
  const gestures = useCanvasGestures({ controller, tool, spaceHeld, onPlace });
  return (
    <main
      className="canvas"
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
      <div className="canvas-topline" aria-hidden="true">
        <span className="canvas-section-dot" /> EXPLORATION BOARD{' '}
        <span className="topline-divider">/</span> 4 objects
      </div>
      <div className="canvas-world" ref={world}>
        <BoardItems />
        {children}
      </div>
      <div className="canvas-bottom-hint">
        {tool === 'comment' && !spaceHeld
          ? 'Click anywhere to start a conversation'
          : 'Drag to pan · Ctrl / ⌘ + scroll to zoom'}
      </div>
      <ZoomControls controller={controller} />
    </main>
  );
}
