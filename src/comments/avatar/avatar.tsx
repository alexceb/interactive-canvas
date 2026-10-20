import { AUTHORS } from '../comments.constants';
import styles from './avatar.module.css';
import type { AvatarProps } from './avatar.types';

// Displays the initials and color assigned to a demo participant.
export function Avatar({ authorId, small = false, className }: AvatarProps) {
  const author = AUTHORS[authorId];
  return (
    <span
      role="img"
      className={[styles.avatar, styles[author.color], small ? styles.small : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={author.name}
      title={author.name}
    >
      {author.initials}
    </span>
  );
}
