import { createContext } from 'react';
import type { Workspace } from '../comments.types';
import type { CommentActions, PersistenceStatus } from './comments-provider.types';
export const DataContext = createContext<Workspace | null>(null);
export const ActionsContext = createContext<CommentActions | null>(null);
export const PersistenceContext = createContext<PersistenceStatus>({
  error: null,
  saved: false,
});
