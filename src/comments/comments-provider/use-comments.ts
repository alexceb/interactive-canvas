import type { Context } from 'react';
import { useContext } from 'react';
import { ActionsContext, DataContext, PersistenceContext } from './comments-context';

// Reads a required comment context and fails clearly when its provider is missing.
function useRequiredContext<T>(context: Context<T | null>): T {
  const value = useContext(context);
  if (!value) throw new Error('CommentsProvider is required');
  return value;
}

// Reads conversation data from the comments provider.
export function useComments() {
  return useRequiredContext(DataContext);
}
// Reads the shared actions for updating conversations.
export function useCommentActions() {
  return useRequiredContext(ActionsContext);
}
// Reads browser save status and any persistence error.
export function usePersistence() {
  return useContext(PersistenceContext);
}
