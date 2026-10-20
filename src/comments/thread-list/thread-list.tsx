import { CheckCheck, MessageSquarePlus } from 'lucide-react';
import shared from '../../shared.module.css';
import { ThreadFilters } from '../thread-filters/thread-filters';
import { ThreadPreview } from '../thread-preview/thread-preview';
import styles from './thread-list.module.css';
import type { ThreadListProps } from './thread-list.types';

// Presents filtered conversation previews, empty states, and the add-comment action.
export function ThreadList({ threads, filter, onFilterChange, onSelect, onAdd }: ThreadListProps) {
  const ordinals = new Map(threads.map((thread, index) => [thread.id, index + 1]));
  const shown = threads.filter(
    (thread) => filter === 'all' || thread.resolved === (filter === 'resolved'),
  );
  return (
    <>
      <ThreadFilters threads={threads} value={filter} onChange={onFilterChange} />
      <section
        className={`${shared.scrollArea} ${styles.threadList}`}
        aria-label={`${filter} comment threads`}
      >
        {shown.map((thread) => (
          <ThreadPreview
            key={thread.id}
            thread={thread}
            ordinal={ordinals.get(thread.id) ?? 0}
            onClick={() => onSelect(thread.id)}
          />
        ))}
        {!shown.length && (
          <div className={styles.emptyState}>
            <CheckCheck size={32} strokeWidth={1.3} />
            <h3>{filter === 'open' ? 'All caught up.' : 'Nothing here yet.'}</h3>
            <p>
              {filter === 'open'
                ? 'No open conversations. Nice work.'
                : 'Conversations will appear here.'}
            </p>
          </div>
        )}
      </section>
      <div className={styles.sidebarFooter}>
        <button
          type="button"
          className={`${shared.secondaryButton} ${styles.secondaryButton}`}
          onClick={onAdd}
        >
          <MessageSquarePlus size={16} /> Add a comment <kbd>C</kbd>
        </button>
        <p>Click anywhere on the canvas to leave a thought.</p>
      </div>
    </>
  );
}
