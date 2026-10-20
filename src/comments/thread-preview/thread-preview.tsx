import { Check, ChevronRight, MessageCircle } from 'lucide-react';
import { Avatar } from '../avatar/avatar';
import { CommentTime } from '../comment-time/comment-time';
import { AUTHORS } from '../comments.constants';
import { getReplyLabel } from '../thread.utils';
import styles from './thread-preview.module.css';
import type { ThreadPreviewProps } from './thread-preview.types';

// Summarizes a pinned conversation, its participants, reply count, and last activity.
export function ThreadPreview({ thread, ordinal, onClick }: ThreadPreviewProps) {
  const root = thread.messages[0];
  const last = thread.messages[thread.messages.length - 1];
  const authors = [...new Set(thread.messages.map((message) => message.authorId))];
  return (
    <button
      type="button"
      className={styles.threadPreview}
      onClick={onClick}
      data-testid={`thread-${thread.id}`}
    >
      <div className={styles.threadPreviewHeading}>
        <Avatar authorId={root.authorId} small />
        <strong>{AUTHORS[root.authorId].name}</strong>
        <CommentTime createdAt={root.createdAt} />
      </div>
      <p className={styles.threadExcerpt}>{root.text}</p>
      <div className={styles.threadPreviewFooter}>
        <span className={`${styles.threadNumber} ${thread.resolved ? styles.isResolved : ''}`}>
          {thread.resolved ? <Check size={11} /> : <MessageCircle size={11} />} {ordinal}
        </span>
        {thread.messages.length > 1 ? (
          <>
            <span className={styles.miniAvatars}>
              {authors.map((id) => (
                <Avatar key={id} authorId={id} small className={styles.avatar} />
              ))}
            </span>
            <span>{getReplyLabel(thread.messages.length - 1)}</span>
          </>
        ) : (
          <span>No replies yet</span>
        )}
        <span className={styles.lastActivity}>
          <CommentTime createdAt={last.createdAt} />
        </span>
        <ChevronRight size={14} />
      </div>
    </button>
  );
}
