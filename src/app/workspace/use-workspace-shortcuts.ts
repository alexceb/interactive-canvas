import { useEffect } from 'react';
import { screenToWorld } from '../../canvas/coordinates';
import type { WorkspaceShortcutsOptions } from './workspace.types';

export function useWorkspaceShortcuts({
  startComment,
  handleEscape,
  tool,
  controller,
  onPlace,
  onSpaceHeldChange,
}: WorkspaceShortcutsOptions) {
  useEffect(() => {
    const typing = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest('input, textarea, [contenteditable="true"]');
    const keydown = (event: KeyboardEvent) => {
      if (
        typing(event.target) ||
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.isComposing
      )
        return;
      if (document.querySelector('[data-modal="true"]')) return;
      if (event.key.toLowerCase() === 'c') {
        event.preventDefault();
        startComment();
      }
      if (
        event.code === 'Space' &&
        !(event.target instanceof Element && event.target.closest('button, a, [role="menuitem"]'))
      ) {
        event.preventDefault();
        onSpaceHeldChange(true);
      }
      if (event.key === 'Escape') handleEscape();
      // A focused board offers keyboard-only comment placement at its center.
      if (
        event.key === 'Enter' &&
        tool === 'comment' &&
        event.target instanceof HTMLElement &&
        event.target.dataset.testid === 'canvas'
      ) {
        event.preventDefault();
        const rect = event.target.getBoundingClientRect();
        onPlace(screenToWorld({ x: rect.width / 2, y: rect.height / 2 }, controller.view));
      }
    };
    const keyup = (event: KeyboardEvent) => {
      if (event.code === 'Space') onSpaceHeldChange(false);
    };
    const blur = () => onSpaceHeldChange(false);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    window.addEventListener('blur', blur);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', blur);
    };
  }, [startComment, handleEscape, tool, controller, onPlace, onSpaceHeldChange]);
}
