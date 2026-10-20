import type { LucideIcon } from 'lucide-react';
import type { Tool } from '../../canvas/canvas/canvas.types';
export interface CanvasToolsProps {
  tool: Tool;
  spaceHeld: boolean;
  onNavigate: () => void;
  onComment: () => void;
}
export interface CanvasToolDefinition {
  tool: Tool;
  label: string;
  tooltip: string;
  icon: LucideIcon;
}
