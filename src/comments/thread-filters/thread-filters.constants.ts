import type { CommentFilter } from './thread-filters.types';
export const THREAD_FILTERS = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'all', label: 'All' },
] satisfies { value: CommentFilter; label: string }[];
