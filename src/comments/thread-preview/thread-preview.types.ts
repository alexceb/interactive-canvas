import type { Thread } from '../comments.types';
export interface ThreadPreviewProps {
  thread: Thread;
  ordinal: number;
  onClick: () => void;
}
