import type { Context } from 'react';
import { useContext } from 'react';
import { ActionsContext, DataContext, PersistenceContext } from './comments-context';

function useRequiredContext<T>(context: Context<T | null>): T {
  const value = useContext(context);
  if (!value) throw new Error('CommentsProvider is required');
  return value;
}

export function useComments() {
  return useRequiredContext(DataContext);
}
export function useCommentActions() {
  return useRequiredContext(ActionsContext);
}
export function usePersistence() {
  return useContext(PersistenceContext);
}
