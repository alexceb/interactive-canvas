import { useEffect, useRef, useState } from 'react';
import { isValidMessageText } from '../message.utils';
import type { ComposerProps } from './composer.types';

// Manages draft, reply, or edit input in controlled or local state.
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
  // Updates local input when uncontrolled and forwards text changes to the caller.
  const changeText = (next: string) => {
    if (value === undefined) setLocalText(next);
    onChange?.(next);
  };
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);
  const valid = isValidMessageText(text);
  // Submits valid trimmed text, then clears and refocuses inputs outside edit mode.
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
