import type { Thread } from '../comments.types';
import type { CommentFilter } from '../thread-filters/thread-filters.types';
export interface ThreadListProps {
  threads: Thread[];
  filter: CommentFilter;
  onFilterChange: (filter: CommentFilter) => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}
