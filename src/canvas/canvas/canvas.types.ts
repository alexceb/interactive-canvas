import type { ReactNode } from 'react';
import type { Point } from '../coordinates.types';
import type { ViewportController } from '../viewport';

export type Tool = 'pan' | 'comment';
export interface CanvasProps {
  controller: ViewportController;
  tool: Tool;
  spaceHeld: boolean;
  onPlace: (point: Point) => void;
  children: ReactNode;
}
export type CanvasGestureOptions = Pick<
  CanvasProps,
  'controller' | 'tool' | 'spaceHeld' | 'onPlace'
>;
