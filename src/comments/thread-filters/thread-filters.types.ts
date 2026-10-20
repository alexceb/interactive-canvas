import type { Thread } from '../comments.types';
export type CommentFilter = 'open' | 'resolved' | 'all';
export interface ThreadFiltersProps {
  threads: Thread[];
  value: CommentFilter;
  onChange: (value: CommentFilter) => void;
}
