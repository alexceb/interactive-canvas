import { Pencil } from 'lucide-react';
import { Avatar } from '../avatar/avatar';
import { CommentTime } from '../comment-time/comment-time';
import { AUTHORS, CURRENT_USER } from '../comments.constants';
import { useCommentActions } from '../comments-provider/use-comments';
import { Composer } from '../composer/composer';
import type { MessageViewProps } from './message-view.types';
import { useMessageEdit } from './use-message-edit';

/** Renders one message and lets its owner edit it without losing keyboard focus. */
export function MessageView({ message, threadId }: MessageViewProps) {
  const { edit } = useCommentActions();
  const { editing, setEditing, editButton } = useMessageEdit();
  const own = message.authorId === CURRENT_USER;
  return (
    <article className="message" aria-label={`Comment by ${AUTHORS[message.authorId].name}`}>
      <div className="message-heading">
        <Avatar authorId={message.authorId} small />
        <div>
          <strong>
            {AUTHORS[message.authorId].name}
            {own && <span className="you-label">you</span>}
          </strong>
          <CommentTime createdAt={message.createdAt} editedAt={message.editedAt} />
        </div>
        {own && !editing && (
          <button
            type="button"
            className="icon-button edit-button"
            aria-label="Edit comment"
            ref={editButton}
            onClick={() => setEditing(true)}
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
      {editing ? (
        <Composer
          editing
          initialText={message.text}
          autoFocus
          onCancel={() => setEditing(false)}
          onSubmit={(text) => {
            edit(threadId, message.id, text);
            setEditing(false);
          }}
        />
      ) : (
        <p className="message-text">{message.text}</p>
      )}
    </article>
  );
}
