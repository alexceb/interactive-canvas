import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import shared from '../../shared.module.css';
import type { DialogStateProps } from '../dialog.types';
import { HELP_SHORTCUTS } from './help-dialog.constants';
import styles from './help-dialog.module.css';

// Explains board gestures and keyboard controls in a dismissible help dialog.
export function HelpDialog({ open, onOpenChange }: DialogStateProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={shared.modalScrim} />
        <Dialog.Content className={`${shared.modalCard} ${styles.helpCard}`} data-modal="true">
          <Dialog.Close
            className={`${shared.iconButton} ${styles.modalClose}`}
            aria-label="Close help"
          >
            <X size={18} />
          </Dialog.Close>
          <Dialog.Title>A little room to explore.</Dialog.Title>
          <Dialog.Description>
            Navigate the board, then leave a thought where it belongs.
          </Dialog.Description>
          <dl className={styles.shortcutList}>
            {HELP_SHORTCUTS.map(({ label, content }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{content}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.helpNote}>
            A local workspace. Conversations are saved in this browser, with no live multiplayer.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
