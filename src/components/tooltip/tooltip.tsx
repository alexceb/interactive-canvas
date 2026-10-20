import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import styles from './tooltip.module.css';
import type { TooltipProps } from './tooltip.types';

// Adds an accessible tooltip to its child control.
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className={styles.tooltip} sideOffset={8}>
          {label}
          <TooltipPrimitive.Arrow />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
