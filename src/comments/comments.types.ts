import type { Point } from '../canvas/coordinates.types';
import type { AUTHORS } from './comments.constants';
export type AuthorId = keyof typeof AUTHORS;
export interface CommentDraft {
  anchor: Point;
  text: string;
}
export interface Message {
  id: string;
  authorId: AuthorId;
  text: string;
  createdAt: string;
  editedAt?: string;
}
export interface Thread {
  id: string;
  anchor: Point;
  resolved: boolean;
  messages: Message[];
}
export interface Workspace {
  version: 1;
  threads: Record<string, Thread>;
}
export type Action =
  | { type: 'thread/add'; thread: Thread }
  | { type: 'message/reply'; threadId: string; message: Message }
  | { type: 'message/edit'; threadId: string; messageId: string; text: string; editedAt: string }
  | { type: 'thread/resolve'; threadId: string; resolved: boolean }
  | { type: 'workspace/reset'; workspace: Workspace };
