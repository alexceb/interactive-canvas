import { Tooltip } from '../tooltip/tooltip';
import type { TooltipButtonProps } from './tooltip-button.types';

/** Combines a native button with a tooltip while preserving labels, refs, and event props. */
export function TooltipButton({ label, children, type = 'button', ...props }: TooltipButtonProps) {
  return (
    <Tooltip label={label}>
      <button type={type} {...props} aria-label={props['aria-label'] ?? label}>
        {children}
      </button>
    </Tooltip>
  );
}
