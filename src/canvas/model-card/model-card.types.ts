import type { Bounds } from '../coordinates.types';
import type { ModelShape } from '../model/model.types';
export interface ModelCardProps {
  ordinal: string;
  name: string;
  caption: string;
  description: string;
  shape: ModelShape;
  tone: 'lavender' | 'sage';
  bounds: Bounds;
}
