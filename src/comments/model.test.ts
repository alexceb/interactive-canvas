import { describe, expect, it } from 'vitest';
import { MAX_MESSAGE_LENGTH } from './comments.constants';
import { createMessage } from './message.utils';
import { workspaceReducer } from './model';
import { createSeedWorkspace } from './seed-workspace';

describe('thread mutations', () => {
  it.each(['', '   ', '\t\n'])('rejects a blank thread ID: %j', (id) => {
    // New threads must always have usable identifiers for selection and persistence.
    const state = createSeedWorkspace();
    expect(
      workspaceReducer(state, {
        type: 'thread/add',
        thread: {
          id,
          anchor: { x: 0, y: 0 },
          resolved: false,
          messages: [createMessage('Feedback')],
        },
      }),
    ).toBe(state);
  });

  it('creates a thread without changing its supplied world anchor', () => {
    // World anchors must survive creation unchanged so pins stay attached during navigation.
    const state = createSeedWorkspace();
    const anchor = { x: -100.25, y: 9000 };
    const next = workspaceReducer(state, {
      type: 'thread/add',
      thread: { id: 'new', anchor, resolved: false, messages: [createMessage('First thought')] },
    });
    expect(next.threads.new.anchor).toEqual(anchor);
    expect(state.threads.new).toBeUndefined();
    expect(next.threads.volume).toBe(state.threads.volume);
  });
  it('appends replies to their conversation, preserving the root anchor', () => {
    // Replies must stay in the same pinned conversation without mutating earlier state.
    const state = createSeedWorkspace();
    const next = workspaceReducer(state, {
      type: 'message/reply',
      threadId: 'volume',
      message: createMessage('A reply'),
    });
    expect(next.threads.volume.messages.at(-1)?.text).toBe('A reply');
    expect(next.threads.volume.anchor).toBe(state.threads.volume.anchor);
    expect(state.threads.volume.messages).toHaveLength(3);
  });
  it('allows editing an owned root and records the edit timestamp', () => {
    // Preserving creation time and marking edits keeps discussion history clear.
    const state = createSeedWorkspace();
    const now = new Date().toISOString();
    const next = workspaceReducer(state, {
      type: 'message/edit',
      threadId: 'direction',
      messageId: 'd1',
      text: ' Updated\nthought ',
      editedAt: now,
    });
    expect(next.threads.direction.messages[0]).toMatchObject({
      text: 'Updated\nthought',
      editedAt: now,
    });
    expect(next.threads.direction.messages[0].createdAt).toBe(
      state.threads.direction.messages[0].createdAt,
    );
  });
  it('allows editing an owned reply', () => {
    // Editing one's own feedback must work equally for root comments and replies.
    const next = workspaceReducer(createSeedWorkspace(), {
      type: 'message/edit',
      threadId: 'volume',
      messageId: 'v2',
      text: 'Revised reply',
      editedAt: new Date().toISOString(),
    });
    expect(next.threads.volume.messages[1].text).toBe('Revised reply');
  });
  it('rejects editing another author’s message', () => {
    // The reducer must enforce ownership even if a caller bypasses the edit controls.
    const state = createSeedWorkspace();
    expect(
      workspaceReducer(state, {
        type: 'message/edit',
        threadId: 'volume',
        messageId: 'v1',
        text: 'Unauthorized',
        editedAt: new Date().toISOString(),
      }),
    ).toBe(state);
  });
  it.each(['   ', 'x'.repeat(MAX_MESSAGE_LENGTH + 1)])(
    'rejects empty or oversized messages',
    (text) => {
      // Invalid content must be rejected even when a caller bypasses the composer.
      const state = createSeedWorkspace();
      expect(
        workspaceReducer(state, {
          type: 'message/reply',
          threadId: 'volume',
          message: createMessage(text),
        }),
      ).toBe(state);
    },
  );
  it('resolves and reopens another author’s thread without losing its conversation', () => {
    // Resolution must preserve the discussion so reviewers can revisit earlier decisions.
    const state = createSeedWorkspace();
    const resolved = workspaceReducer(state, {
      type: 'thread/resolve',
      threadId: 'volume',
      resolved: true,
    });
    expect(resolved.threads.volume.resolved).toBe(true);
    expect(resolved.threads.volume.messages).toBe(state.threads.volume.messages);
    expect(
      workspaceReducer(resolved, { type: 'thread/resolve', threadId: 'volume', resolved: false })
        .threads.volume.resolved,
    ).toBe(false);
  });
  it('ignores stale thread IDs and duplicate message IDs', () => {
    // Delayed or repeated actions must not corrupt the conversation.
    const state = createSeedWorkspace();
    expect(
      workspaceReducer(state, { type: 'thread/resolve', threadId: 'missing', resolved: true }),
    ).toBe(state);
    expect(
      workspaceReducer(state, {
        type: 'message/reply',
        threadId: 'volume',
        message: { ...state.threads.volume.messages[1] },
      }),
    ).toBe(state);
  });
});
