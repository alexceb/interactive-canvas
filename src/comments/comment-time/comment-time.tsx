import type { CommentTimeProps } from './comment-time.types';
import { relativeTime } from './relative-time';

// Shows a relative comment timestamp with the full date and optional edit time.
export function CommentTime({ createdAt, editedAt }: CommentTimeProps) {
  return (
    <time dateTime={createdAt} title={new Date(createdAt).toLocaleString()}>
      {relativeTime(createdAt)}
      {editedAt && <span title={new Date(editedAt).toLocaleString()}> · edited</span>}
    </time>
  );
}
