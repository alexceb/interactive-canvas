import { Component, Suspense } from 'react';
import { ModelFallback } from '../model-fallback/model-fallback';
import styles from './model-preview.module.css';
import type { ModelPreviewProps, ModelPreviewState } from './model-preview.types';
import { createModel, InitialModel } from './model-preview.utils';

// Lazily loads a model preview and offers recovery from renderer import failures.
export class ModelPreview extends Component<ModelPreviewProps, ModelPreviewState> {
  state: ModelPreviewState = { failed: false, Model: InitialModel };

  // Switches to the retry fallback when the model fails to load or render.
  static getDerivedStateFromError() {
    return { failed: true };
  }

  // Shows the retry fallback, loading placeholder, or resolved model renderer.
  render() {
    if (this.state.failed)
      return (
        <div className={styles.modelRender} data-unavailable="true">
          <ModelFallback
            message="3D preview could not load."
            onRetry={() => this.setState({ failed: false, Model: createModel() })}
          />
        </div>
      );
    const { Model } = this.state;
    return (
      <Suspense fallback={<div className={styles.modelRender} />}>
        <Model shape={this.props.shape} />
      </Suspense>
    );
  }
}
