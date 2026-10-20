import { CURRENT_USER, MAX_MESSAGE_LENGTH } from './comments.constants';
import type { Message } from './comments.types';
export function createMessage(text: string): Message {
  return {
    id: crypto.randomUUID(),
    authorId: CURRENT_USER,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}
export const isValidMessageText = (text: string) =>
  text.trim().length > 0 && text.length <= MAX_MESSAGE_LENGTH;
