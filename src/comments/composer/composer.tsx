import { ArrowUp } from 'lucide-react';
import { Avatar } from '../avatar/avatar';
import { CURRENT_USER, MAX_MESSAGE_LENGTH } from '../comments.constants';
import type { ComposerProps } from './composer.types';
import { useComposer } from './use-composer';

/** Composes a new comment, reply, or edit with multiline text and keyboard submission. */
export function Composer({
  onSubmit,
  onCancel,
  initialText = '',
  value,
  onChange,
  editing = false,
  label = editing ? 'Edit comment text' : 'Reply text',
  placeholder = 'Write a reply…',
  autoFocus = false,
}: ComposerProps) {
  const { text, changeText, input, valid, submit } = useComposer({
    initialText,
    value,
    onChange,
    autoFocus,
    editing,
    onSubmit,
  });
  return (
    <form
      className={`composer${editing ? ' editing-composer' : ''}`}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape' && onCancel) {
          event.preventDefault();
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      {!editing && (
        <div className="composer-author">
          <Avatar authorId={CURRENT_USER} small />
          <span>
            Commenting as <strong>Alex</strong>
          </span>
        </div>
      )}
      <div className="composer-input-wrap">
        <textarea
          ref={input}
          aria-label={label}
          value={text}
          onChange={(event) => changeText(event.target.value)}
          placeholder={placeholder}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={editing ? 4 : 3}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <div className="composer-footer">
          <span>
            {text.length > 4500
              ? `${text.length} / ${MAX_MESSAGE_LENGTH}`
              : '⌘ / Ctrl + Enter to send'}
          </span>
          <div className="composer-actions">
            {onCancel && (
              <button className="text-button" type="button" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button
              className={editing ? 'primary-button small-button' : 'send-button'}
              type="submit"
              disabled={!valid}
              aria-label={editing ? 'Save edit' : 'Send comment'}
            >
              {editing ? 'Save' : <ArrowUp size={17} />}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
