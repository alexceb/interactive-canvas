import type { Thread } from './comments.types';

export function getThreadCounts(threads: Thread[]) {
  const open = threads.filter((thread) => !thread.resolved).length;
  return { open, resolved: threads.length - open, all: threads.length };
}

export function getReplyLabel(replyCount: number) {
  return `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`;
}
