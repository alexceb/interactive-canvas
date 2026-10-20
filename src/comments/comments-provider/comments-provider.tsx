import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import type { Point } from '../../canvas/coordinates.types';
import type { Workspace } from '../comments.types';
import { createMessage } from '../message.utils';
import { workspaceReducer } from '../model';
import { createSeedWorkspace } from '../seed-workspace';
import { saveWorkspace } from '../storage';
import { ActionsContext, DataContext, PersistenceContext } from './comments-context';
import { STORAGE_UNAVAILABLE_MESSAGE } from './comments-provider.constants';
import type { CommentActions, CommentsProviderProps } from './comments-provider.types';
import { loadInitialWorkspace } from './comments-provider.utils';

/** Shares comment data, domain actions, and local persistence status with the workspace. */
export function CommentsProvider({ children }: CommentsProviderProps) {
  const [initial] = useState(loadInitialWorkspace);
  const [data, dispatch] = useReducer(workspaceReducer, initial.data);
  const [blocked, setBlocked] = useState(initial.blocked);
  const [error, setError] = useState(initial.error);
  const [savedData, setSavedData] = useState<Workspace | null>(null);
  useEffect(() => {
    if (blocked) return;
    const persist = () => {
      try {
        const failure = saveWorkspace(window.localStorage, data);
        setError(failure);
        if (!failure) setSavedData(data);
      } catch {
        setError(STORAGE_UNAVAILABLE_MESSAGE);
      }
    };
    // Coalesce rapid actions, and flush the latest committed state before reload/navigation.
    const timer = window.setTimeout(persist, 80);
    window.addEventListener('pagehide', persist);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pagehide', persist);
    };
  }, [data, blocked]);
  const addThread = useCallback((anchor: Point, text: string) => {
    const id = crypto.randomUUID();
    dispatch({
      type: 'thread/add',
      thread: { id, anchor, resolved: false, messages: [createMessage(text)] },
    });
    return id;
  }, []);
  const actions = useMemo<CommentActions>(
    () => ({
      addThread,
      reply: (threadId, text) =>
        dispatch({ type: 'message/reply', threadId, message: createMessage(text) }),
      edit: (threadId, messageId, text) =>
        dispatch({
          type: 'message/edit',
          threadId,
          messageId,
          text,
          editedAt: new Date().toISOString(),
        }),
      resolve: (threadId, resolved) => dispatch({ type: 'thread/resolve', threadId, resolved }),
      reset: () => {
        setBlocked(false);
        setError(null);
        dispatch({ type: 'workspace/reset', workspace: createSeedWorkspace() });
      },
    }),
    [addThread],
  );
  const persistence = useMemo(
    () => ({ error, saved: !error && savedData === data }),
    [error, savedData, data],
  );
  return (
    <ActionsContext.Provider value={actions}>
      <DataContext.Provider value={data}>
        <PersistenceContext.Provider value={persistence}>{children}</PersistenceContext.Provider>
      </DataContext.Provider>
    </ActionsContext.Provider>
  );
}
