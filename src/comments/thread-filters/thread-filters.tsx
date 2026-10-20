import { getThreadCounts } from '../thread.utils';
import { THREAD_FILTERS } from './thread-filters.constants';
import type { ThreadFiltersProps } from './thread-filters.types';

// Filters conversations by their resolution state and displays each state's count.
export function ThreadFilters({ threads, value, onChange }: ThreadFiltersProps) {
  const counts = getThreadCounts(threads);
  return (
    <fieldset className="filter-tabs" aria-label="Filter comments">
      {THREAD_FILTERS.map((filter) => (
        <button
          type="button"
          key={filter.value}
          aria-pressed={value === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
          <span>{counts[filter.value]}</span>
        </button>
      ))}
    </fieldset>
  );
}
