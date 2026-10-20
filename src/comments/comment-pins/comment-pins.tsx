import { Check, MessageSquare } from 'lucide-react';
import { memo } from 'react';
import { AUTHORS } from '../comments.constants';
import { useComments } from '../comments-provider/use-comments';
import type { CommentPinsProps } from './comment-pins.types';

/** Renders anchored, selectable thread pins and the current draft marker. */
export const CommentPins = memo(function CommentPins({
  selectedId,
  draft,
  onSelect,
}: CommentPinsProps) {
  const { threads } = useComments();
  return (
    <div className="pins-layer">
      {Object.values(threads).map((thread, index) => (
        <button
          type="button"
          key={thread.id}
          className={`comment-pin ${selectedId === thread.id ? 'selected' : ''} ${thread.resolved ? 'resolved' : ''}`}
          style={{ left: thread.anchor.x, top: thread.anchor.y }}
          data-testid={`pin-${thread.id}`}
          aria-label={`Thread ${index + 1} by ${AUTHORS[thread.messages[0].authorId].name}${thread.resolved ? ', resolved' : ''}: ${thread.messages[0].text}`}
          aria-pressed={selectedId === thread.id}
          onClick={() => onSelect(thread.id)}
        >
          {thread.resolved ? <Check size={15} /> : <span>{index + 1}</span>}
        </button>
      ))}
      {draft && (
        <span
          role="img"
          className="comment-pin draft-pin"
          style={{ left: draft.x, top: draft.y }}
          aria-label="Draft comment location"
        >
          <MessageSquare size={15} />
        </span>
      )}
    </div>
  );
});
