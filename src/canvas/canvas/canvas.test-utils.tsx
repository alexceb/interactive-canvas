import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ViewportController } from '../viewport';
import { Canvas } from './canvas';

// Renders a canvas in comment mode with a placement spy and stubbed pointer capture.
export function setup() {
  const controller = new ViewportController();
  const onPlace = vi.fn();

  render(
    <TooltipPrimitive.Provider>
      <Canvas controller={controller} tool="comment" spaceHeld={false} onPlace={onPlace}>
        {null}
      </Canvas>
    </TooltipPrimitive.Provider>,
  );

  const canvas = screen.getByTestId('canvas');
  canvas.setPointerCapture = vi.fn();

  return { canvas, controller, onPlace };
}
