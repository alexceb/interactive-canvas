import { MessageSquarePlus, MousePointer2 } from 'lucide-react';
import type { CanvasToolDefinition } from './canvas-tools.types';
export const CANVAS_TOOLS = [
  { tool: 'pan', label: 'Navigation tool', tooltip: 'Navigate · drag to pan', icon: MousePointer2 },
  { tool: 'comment', label: 'Comment tool', tooltip: 'Comment · C', icon: MessageSquarePlus },
] satisfies CanvasToolDefinition[];
