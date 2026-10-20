import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { RotateCcw } from 'lucide-react';
import shared from '../../shared.module.css';
import styles from './reset-demo-dialog.module.css';
import type { ResetDemoDialogProps } from './reset-demo-dialog.types';

// Confirms replacing locally saved conversations with the original demo data.
export function ResetDemoDialog({ open, onOpenChange, onReset }: ResetDemoDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={shared.modalScrim} />
        <AlertDialog.Content className={shared.modalCard} data-modal="true">
          <div className={styles.modalIcon}>
            <RotateCcw size={24} />
          </div>
          <AlertDialog.Title>Start fresh?</AlertDialog.Title>
          <AlertDialog.Description>
            This replaces your local comments and edits with the original demo conversations. This
            cannot be undone.
          </AlertDialog.Description>
          <div className={styles.modalActions}>
            <AlertDialog.Cancel className={shared.secondaryButton}>Keep my work</AlertDialog.Cancel>
            <AlertDialog.Action className={shared.primaryButton} onClick={onReset}>
              Reset demo
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
