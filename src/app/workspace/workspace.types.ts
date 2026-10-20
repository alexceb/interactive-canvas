import type { Tool } from '../../canvas/canvas/canvas.types';
import type { Point } from '../../canvas/coordinates.types';
import type { ViewportController } from '../../canvas/viewport';

export interface WorkspaceShortcutsOptions {
  startComment: () => void;
  handleEscape: () => void;
  tool: Tool;
  controller: ViewportController;
  onSpaceHeldChange: (held: boolean) => void;
  onPlace: (point: Point) => void;
}
