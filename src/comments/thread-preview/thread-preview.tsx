import { Check, ChevronRight, MessageCircle } from 'lucide-react';
import { Avatar } from '../avatar/avatar';
import { CommentTime } from '../comment-time/comment-time';
import { AUTHORS } from '../comments.constants';
import { getReplyLabel } from '../thread.utils';
import type { ThreadPreviewProps } from './thread-preview.types';

// Summarizes a pinned conversation, its participants, reply count, and last activity.
export function ThreadPreview({ thread, ordinal, onClick }: ThreadPreviewProps) {
  const root = thread.messages[0];
  const last = thread.messages[thread.messages.length - 1];
  const authors = [...new Set(thread.messages.map((message) => message.authorId))];
  return (
    <button
      type="button"
      className="thread-preview"
      onClick={onClick}
      data-testid={`thread-${thread.id}`}
    >
      <div className="thread-preview-heading">
        <Avatar authorId={root.authorId} small />
        <strong>{AUTHORS[root.authorId].name}</strong>
        <CommentTime createdAt={root.createdAt} />
      </div>
      <p className="thread-excerpt">{root.text}</p>
      <div className="thread-preview-footer">
        <span className={`thread-number${thread.resolved ? ' is-resolved' : ''}`}>
          {thread.resolved ? <Check size={11} /> : <MessageCircle size={11} />} {ordinal}
        </span>
        {thread.messages.length > 1 ? (
          <>
            <span className="mini-avatars">
              {authors.map((id) => (
                <Avatar key={id} authorId={id} small />
              ))}
            </span>
            <span>{getReplyLabel(thread.messages.length - 1)}</span>
          </>
        ) : (
          <span>No replies yet</span>
        )}
        <span className="last-activity">
          <CommentTime createdAt={last.createdAt} />
        </span>
        <ChevronRight size={14} />
      </div>
    </button>
  );
}
