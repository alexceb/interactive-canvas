import { fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubResizeObserver } from '../../test/browser-stubs';
import { setup } from './canvas.test-utils';

vi.mock('../board-items/board-items', () => ({ BoardItems: () => null }));

beforeEach(() => {
  stubResizeObserver();
  vi.stubGlobal(
    'PointerEvent',
    class extends MouseEvent {
      pointerId: number;
      constructor(type: string, options: PointerEventInit = {}) {
        super(type, options);
        this.pointerId = options.pointerId ?? 1;
      }
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('canvas gesture cancellation', () => {
  it.each(['lostPointerCapture', 'pointerCancel'] as const)(
    'stops an interrupted drag on %s and allows a fresh gesture',
    (event) => {
      // Interrupted input must not leave ghost dragging or accidentally place a comment.
      const { canvas, controller, onPlace } = setup();
      const initial = { ...controller.view };
      fireEvent.pointerDown(canvas, { pointerId: 1, button: 0, clientX: 100, clientY: 100 });
      fireEvent[event](canvas, { pointerId: 1 });
      fireEvent.pointerMove(canvas, { pointerId: 1, buttons: 0, clientX: 150, clientY: 100 });
      fireEvent.pointerUp(canvas, { pointerId: 1, button: 0 });

      expect(controller.view).toEqual(initial);
      expect(canvas).toHaveAttribute('data-dragging', 'false');
      expect(onPlace).not.toHaveBeenCalled();

      fireEvent.pointerDown(canvas, { pointerId: 1, button: 0, clientX: 30, clientY: 40 });
      fireEvent.pointerUp(canvas, { pointerId: 1, button: 0, clientX: 30, clientY: 40 });
      expect(onPlace).toHaveBeenCalledExactlyOnceWith({ x: 30, y: 40 });
    },
  );

  it('keeps the remaining pointer usable after a pinch is interrupted', () => {
    // Losing one touch must not corrupt the remaining touch or turn a pinch into a comment.
    const { canvas, controller, onPlace } = setup();
    fireEvent.pointerDown(canvas, { pointerId: 1, button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerDown(canvas, { pointerId: 2, button: 0, clientX: 200, clientY: 100 });
    fireEvent.lostPointerCapture(canvas, { pointerId: 1 });
    fireEvent.pointerMove(canvas, { pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(canvas, { pointerId: 2, clientX: 210, clientY: 100 });
    fireEvent.pointerUp(canvas, { pointerId: 2, button: 0 });

    expect(controller.view).toEqual({ x: 10, y: 0, zoom: 1 });
    expect(canvas).toHaveAttribute('data-dragging', 'false');
    expect(onPlace).not.toHaveBeenCalled();
  });

  it('ignores capture loss after a normal pointer release', () => {
    // Browsers release capture after pointerup; that notification must not duplicate placement.
    const { canvas, onPlace } = setup();
    fireEvent.pointerDown(canvas, { pointerId: 1, button: 0, clientX: 30, clientY: 40 });
    fireEvent.pointerUp(canvas, { pointerId: 1, button: 0, clientX: 30, clientY: 40 });
    fireEvent.lostPointerCapture(canvas, { pointerId: 1 });

    expect(onPlace).toHaveBeenCalledExactlyOnceWith({ x: 30, y: 40 });
    expect(canvas).toHaveAttribute('data-dragging', 'false');
  });
});
