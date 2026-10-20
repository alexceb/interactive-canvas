import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { DialogStateProps } from '../dialog.types';
import { HELP_SHORTCUTS } from './help-dialog.constants';

/** Explains board gestures and keyboard controls in a dismissible help dialog. */
export function HelpDialog({ open, onOpenChange }: DialogStateProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-scrim" />
        <Dialog.Content className="modal-card help-card" data-modal="true">
          <Dialog.Close className="icon-button modal-close" aria-label="Close help">
            <X size={18} />
          </Dialog.Close>
          <Dialog.Title>A little room to explore.</Dialog.Title>
          <Dialog.Description>
            Navigate the board, then leave a thought where it belongs.
          </Dialog.Description>
          <dl className="shortcut-list">
            {HELP_SHORTCUTS.map(({ label, content }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{content}</dd>
              </div>
            ))}
          </dl>
          <p className="help-note">
            A local workspace. Conversations are saved in this browser, with no live multiplayer.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
