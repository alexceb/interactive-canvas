import { useEffect } from 'react';
import { screenToWorld } from '../../canvas/coordinates';
import type { WorkspaceShortcutsOptions } from './workspace.types';

// Connects workspace actions to keyboard shortcuts and temporary Space-to-pan mode.
export function useWorkspaceShortcuts({
  startComment,
  handleEscape,
  tool,
  controller,
  onPlace,
  onSpaceHeldChange,
}: WorkspaceShortcutsOptions) {
  useEffect(() => {
    // Detects text-entry targets whose keystrokes belong to the editor.
    const typing = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest('input, textarea, [contenteditable="true"]');

    // Routes unmodified workspace shortcuts while respecting editors and active dialogs.
    const keydown = (event: KeyboardEvent) => {
      if (
        typing(event.target) ||
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.isComposing
      ) {
        return;
      }

      if (document.querySelector('[data-modal="true"]')) return;

      if (event.key.toLowerCase() === 'c') {
        event.preventDefault();
        startComment();
      }

      // Leave Space activation available to focused buttons, links, and menu items.
      if (
        event.code === 'Space' &&
        !(event.target instanceof Element && event.target.closest('button, a, [role="menuitem"]'))
      ) {
        event.preventDefault();
        onSpaceHeldChange(true);
      }

      if (event.key === 'Escape') handleEscape();

      // Place keyboard comments at the visible board center, converted to world coordinates.
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

    // Releases temporary pan even if focus moved into an editor after Space was pressed.
    const keyup = (event: KeyboardEvent) => {
      if (event.code === 'Space') onSpaceHeldChange(false);
    };

    // Releases temporary pan when switching windows prevents keyup from reaching the page.
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
