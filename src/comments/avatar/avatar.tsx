import { AUTHORS } from '../comments.constants';
import type { AvatarProps } from './avatar.types';

/** Displays the initials and color assigned to a demo participant. */
export function Avatar({ authorId, small = false }: AvatarProps) {
  const author = AUTHORS[authorId];
  return (
    <span
      role="img"
      className={`avatar avatar-${author.color}${small ? ' avatar-small' : ''}`}
      aria-label={author.name}
      title={author.name}
    >
      {author.initials}
    </span>
  );
}
