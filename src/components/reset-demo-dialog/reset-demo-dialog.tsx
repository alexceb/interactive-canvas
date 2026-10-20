import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { RotateCcw } from 'lucide-react';
import type { ResetDemoDialogProps } from './reset-demo-dialog.types';

// Confirms replacing locally saved conversations with the original demo data.
export function ResetDemoDialog({ open, onOpenChange, onReset }: ResetDemoDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="modal-scrim" />
        <AlertDialog.Content className="modal-card" data-modal="true">
          <div className="modal-icon">
            <RotateCcw size={24} />
          </div>
          <AlertDialog.Title>Start fresh?</AlertDialog.Title>
          <AlertDialog.Description>
            This replaces your local comments and edits with the original demo conversations. This
            cannot be undone.
          </AlertDialog.Description>
          <div className="modal-actions">
            <AlertDialog.Cancel className="secondary-button">Keep my work</AlertDialog.Cancel>
            <AlertDialog.Action className="primary-button" onClick={onReset}>
              Reset demo
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
