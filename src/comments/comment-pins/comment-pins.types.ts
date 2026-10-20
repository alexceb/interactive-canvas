import type { Point } from '../../canvas/coordinates.types';
export interface CommentPinsProps {
  selectedId: string | null;
  draft: Point | null;
  onSelect: (id: string) => void;
}
