import { useLayoutEffect, useRef, useState } from 'react';

// Tracks edit mode and restores focus to the Edit button after the editor closes.
export function useMessageEdit() {
  const [editing, setEditing] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);
  useLayoutEffect(() => {
    if (wasEditing.current && !editing) editButton.current?.focus({ preventScroll: true });
    wasEditing.current = editing;
  }, [editing]);
  return { editing, setEditing, editButton };
}
