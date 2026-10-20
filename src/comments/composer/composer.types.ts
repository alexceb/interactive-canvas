export interface ComposerProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  initialText?: string;
  value?: string;
  onChange?: (text: string) => void;
  editing?: boolean;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
}
