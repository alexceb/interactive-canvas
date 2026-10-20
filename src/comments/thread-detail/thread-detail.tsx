import { Check, CheckCheck, RotateCcw } from 'lucide-react';
import { useCommentActions } from '../comments-provider/use-comments';
import { Composer } from '../composer/composer';
import { MessageView } from '../message-view/message-view';
import { getReplyLabel } from '../thread.utils';
import type { ThreadDetailProps } from './thread-detail.types';
import { useThreadScroll } from './use-thread-scroll';

// Displays a conversation with its replies, resolution controls, and reply composer.
export function ThreadDetail({ thread }: ThreadDetailProps) {
  const { reply, resolve } = useCommentActions();
  const scrollArea = useThreadScroll(thread.messages.at(-1)?.id);
  return (
    <>
      <div className="thread-status">
        <span className={`status-label${thread.resolved ? ' status-resolved' : ''}`}>
          <span />
          {thread.resolved ? 'Resolved' : 'Open conversation'}
        </span>
        <button
          type="button"
          className="text-button resolve-button"
          onClick={() => resolve(thread.id, !thread.resolved)}
        >
          {thread.resolved ? <RotateCcw size={14} /> : <Check size={14} />}
          {thread.resolved ? 'Reopen' : 'Resolve'}
        </button>
      </div>
      <section className="messages" ref={scrollArea} aria-label="Conversation">
        {thread.messages.map((message, index) => (
          <div key={message.id}>
            {index === 1 && (
              <div className="replies-divider">
                <span />
                {getReplyLabel(thread.messages.length - 1)}
                <span />
              </div>
            )}
            <MessageView message={message} threadId={thread.id} />
          </div>
        ))}
        {thread.resolved && (
          <div className="resolved-notice">
            <CheckCheck size={16} />
            <span>
              This conversation is resolved.
              <br />
              You can reopen it or keep the discussion going.
            </span>
          </div>
        )}
      </section>
      <div className="reply-area">
        <Composer onSubmit={(text) => reply(thread.id, text)} />
      </div>
    </>
  );
}
