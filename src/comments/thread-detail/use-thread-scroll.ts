import { useEffect, useRef } from 'react';

export function useThreadScroll(lastMessageId: string | undefined) {
  const scrollArea = useRef<HTMLElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: A new last message triggers scrolling; editing existing messages preserves the reading position.
  useEffect(() => {
    const element = scrollArea.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lastMessageId]);
  return scrollArea;
}
