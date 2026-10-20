import type { AuthorId } from '../comments.types';
export interface AvatarProps {
  authorId: AuthorId;
  small?: boolean;
  className?: string;
}
