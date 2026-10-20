import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, X } from 'lucide-react';
import { useId, useState } from 'react';
import shared from '../../shared.module.css';
import { CommentDraftPanel } from '../comment-draft-panel/comment-draft-panel';
import { useComments } from '../comments-provider/use-comments';
import { ThreadDetail } from '../thread-detail/thread-detail';
import type { CommentFilter } from '../thread-filters/thread-filters.types';
import { ThreadList } from '../thread-list/thread-list';
import styles from './sidebar.module.css';
import type { SidebarProps } from './sidebar.types';

// Hosts the responsive comments dialog and switches between drafts, threads, and the list.
export function Sidebar({
  open,
  mobile,
  selectedId,
  draft,
  onOpenChange,
  onDraftChange,
  onCloseAutoFocus,
  onSelect,
  onBack,
  onCreate,
  onAdd,
  onEscape,
}: SidebarProps) {
  const { threads } = useComments();
  const [filter, setFilter] = useState<CommentFilter>('open');
  const descriptionId = useId();
  const list = Object.values(threads);
  const thread = selectedId ? threads[selectedId] : undefined;
  const ordinal = thread ? list.findIndex((item) => item.id === thread.id) + 1 : undefined;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={mobile}>
      {mobile && (
        <Dialog.Portal>
          <Dialog.Overlay className={styles.sidebarScrim} data-testid="sidebar-scrim" />
        </Dialog.Portal>
      )}
      <Dialog.Content
        className={styles.sidebar}
        data-modal={mobile}
        aria-describedby={descriptionId}
        onOpenAutoFocus={(event) => {
          if (!mobile) event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onCloseAutoFocus();
        }}
        onInteractOutside={(event) => {
          if (!mobile) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          if (document.activeElement?.closest('[data-editing="true"]')) return;
          onEscape();
        }}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitleGroup}>
            {(thread || draft) && (
              <button
                type="button"
                className={`${shared.iconButton} ${styles.iconButton}`}
                aria-label="Back to comments"
                onClick={onBack}
              >
                <ArrowLeft size={17} />
              </button>
            )}
            <Dialog.Title>
              {draft ? 'New comment' : thread ? `Thread ${ordinal}` : 'Threads'}
            </Dialog.Title>
            {!thread && !draft && <span className={styles.countBadge}>{list.length}</span>}
          </div>
          <Dialog.Close className={shared.iconButton} aria-label="Close comments">
            <X size={18} />
          </Dialog.Close>
        </div>
        <Dialog.Description id={descriptionId} className={shared.srOnly}>
          Review canvas conversations. Comments are saved only in this browser.
        </Dialog.Description>
        {draft ? (
          <CommentDraftPanel
            draft={draft}
            onChange={onDraftChange}
            onCreate={onCreate}
            onCancel={onBack}
          />
        ) : thread ? (
          <ThreadDetail key={thread.id} thread={thread} />
        ) : (
          <ThreadList
            threads={list}
            filter={filter}
            onFilterChange={setFilter}
            onSelect={onSelect}
            onAdd={onAdd}
          />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
