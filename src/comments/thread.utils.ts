import type { Thread } from './comments.types';

// Counts conversations for the open, resolved, and all filters.
export function getThreadCounts(threads: Thread[]) {
  const open = threads.filter((thread) => !thread.resolved).length;
  return { open, resolved: threads.length - open, all: threads.length };
}

// Formats a reply count with the appropriate singular or plural label.
export function getReplyLabel(replyCount: number) {
  return `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`;
}
