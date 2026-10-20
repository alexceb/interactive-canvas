import { MessageSquarePlus } from 'lucide-react';
import { Composer } from '../composer/composer';
import styles from './comment-draft-panel.module.css';
import type { CommentDraftPanelProps } from './comment-draft-panel.types';

// Edits the temporary text attached to a new board anchor before a thread is submitted.
export function CommentDraftPanel({ draft, onChange, onCreate, onCancel }: CommentDraftPanelProps) {
  return (
    <div className={styles.draftPanel}>
      <div className={styles.draftIllustration}>
        <MessageSquarePlus size={27} strokeWidth={1.5} />
      </div>
      <h2>A thought starts here.</h2>
      <p>
        Your comment is pinned to the canvas.
        <br />
        Give it a little context.
      </p>
      <Composer
        key={`${draft.anchor.x},${draft.anchor.y}`}
        value={draft.text}
        onChange={onChange}
        onSubmit={onCreate}
        onCancel={onCancel}
        label="New comment text"
        placeholder="Share your thoughts…"
        autoFocus
      />
    </div>
  );
}
