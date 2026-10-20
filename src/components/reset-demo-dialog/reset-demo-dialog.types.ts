import type { DialogStateProps } from '../dialog.types';
export interface ResetDemoDialogProps extends DialogStateProps {
  onReset: () => void;
}
