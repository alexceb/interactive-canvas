import { useEffect, useRef, useState } from 'react';
import { isValidMessageText } from '../message.utils';
import type { ComposerProps } from './composer.types';

export function useComposer({
  initialText = '',
  value,
  onChange,
  autoFocus = false,
  editing = false,
  onSubmit,
}: ComposerProps) {
  const [localText, setLocalText] = useState(initialText);
  const text = value ?? localText;
  const changeText = (next: string) => {
    if (value === undefined) setLocalText(next);
    onChange?.(next);
  };
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    // Only drafts and edits opened by an explicit user action request focus.
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);
  const valid = isValidMessageText(text);
  const submit = () => {
    if (!valid) return;
    onSubmit(text.trim());
    if (!editing) {
      changeText('');
      input.current?.focus();
    }
  };

  return { text, changeText, input, valid, submit };
}
