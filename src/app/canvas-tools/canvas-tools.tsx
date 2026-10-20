import { Hand } from 'lucide-react';
import { Tooltip } from '../../components/tooltip/tooltip';
import { TooltipButton } from '../../components/tooltip-button/tooltip-button';
import { CANVAS_TOOLS } from './canvas-tools.constants';
import type { CanvasToolsProps } from './canvas-tools.types';

// Selects navigation or comment placement and shows the temporary Space-to-pan hint.
export function CanvasTools({ tool, spaceHeld, onNavigate, onComment }: CanvasToolsProps) {
  return (
    <div className="tool-rail" role="toolbar" aria-label="Canvas tools">
      {CANVAS_TOOLS.map(({ tool: value, label, tooltip, icon: Icon }) => (
        <TooltipButton
          key={value}
          label={tooltip}
          className={`tool-button${tool === value ? ' active' : ''}`}
          aria-label={label}
          aria-pressed={tool === value}
          onClick={value === 'pan' ? onNavigate : onComment}
        >
          <Icon size={19} />
        </TooltipButton>
      ))}
      <span className="rail-divider" />
      <Tooltip label="Hold Space to pan">
        <span className={`tool-hint${spaceHeld ? ' active' : ''}`}>
          <Hand size={18} />
        </span>
      </Tooltip>
    </div>
  );
}
