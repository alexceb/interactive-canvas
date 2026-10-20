import { Component, Suspense } from 'react';
import { ModelFallback } from '../model-fallback/model-fallback';
import type { ModelPreviewProps, ModelPreviewState } from './model-preview.types';
import { createModel, InitialModel } from './model-preview.utils';

/** Lazily loads the model renderer and contains import failures with a retryable fallback. */
export class ModelPreview extends Component<ModelPreviewProps, ModelPreviewState> {
  state: ModelPreviewState = { failed: false, Model: InitialModel };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="model-render" data-unavailable="true">
          <ModelFallback
            message="3D preview could not load."
            onRetry={() => this.setState({ failed: false, Model: createModel() })}
          />
        </div>
      );
    const { Model } = this.state;
    return (
      <Suspense fallback={<div className="model-render" />}>
        <Model shape={this.props.shape} />
      </Suspense>
    );
  }
}
