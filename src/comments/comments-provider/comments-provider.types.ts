import type { ReactNode } from 'react';
import type { Point } from '../../canvas/coordinates.types';

export interface CommentsProviderProps {
  children: ReactNode;
}
export interface CommentActions {
  addThread: (anchor: Point, text: string) => string;
  reply: (threadId: string, text: string) => void;
  edit: (threadId: string, messageId: string, text: string) => void;
  resolve: (threadId: string, resolved: boolean) => void;
  reset: () => void;
}
export interface PersistenceStatus {
  error: string | null;
  saved: boolean;
}
