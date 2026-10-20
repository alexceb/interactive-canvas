import type { ModelProps } from '../model/model.types';
import type { createModel } from './model-preview.utils';

export type ModelPreviewProps = ModelProps;
export interface ModelPreviewState {
  failed: boolean;
  Model: ReturnType<typeof createModel>;
}
