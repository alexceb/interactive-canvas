import type { PointerEvent as ReactPointerEvent } from 'react';
import { useRef } from 'react';
import { screenToWorld } from '../coordinates';
import type { Point } from '../coordinates.types';
import type { CanvasGestureOptions } from './canvas.types';
import { getPointerCenter, getPointerDistance, isControl, localPoint } from './canvas.utils';

// Tracks pointer gestures for panning, pinch zoom, and stationary comment placement.
export function useCanvasGestures({ controller, tool, spaceHeld, onPlace }: CanvasGestureOptions) {
  const gesture = useRef({
    pointers: new Map<number, Point>(),
    start: { x: 0, y: 0 },
    moved: false,
    pinched: false,
  });
  // Captures eligible pointer input and starts or extends the active gesture.
  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isControl(event.target) || (event.button !== 0 && event.button !== 1)) return;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    const state = gesture.current;
    const point = localPoint(event);
    if (!state.pointers.size) {
      state.start = point;
      state.moved = false;
      state.pinched = false;
    }
    state.pointers.set(event.pointerId, point);
    if (state.pointers.size > 1) state.pinched = true;
    event.currentTarget.dataset.dragging = 'true';
  };
  // Pans with one pointer or combines center movement and zoom for a two-pointer pinch.
  const pointerMove = (event: ReactPointerEvent) => {
    const state = gesture.current;
    const previous = state.pointers.get(event.pointerId);
    if (!previous) return;
    const before = [...state.pointers.values()];
    const point = localPoint(event);
    state.pointers.set(event.pointerId, point);
    if (Math.hypot(point.x - state.start.x, point.y - state.start.y) > 4) state.moved = true;
    if (before.length === 2) {
      const after = [...state.pointers.values()];
      const previousCenter = getPointerCenter(before);
      const nextCenter = getPointerCenter(after);
      const previousDistance = getPointerDistance(before);
      // Move the pinch center first, then zoom around its new position.
      controller.pan(nextCenter.x - previousCenter.x, nextCenter.y - previousCenter.y);
      if (previousDistance > 1) {
        controller.zoom(
          (controller.view.zoom * getPointerDistance(after)) / previousDistance,
          nextCenter,
        );
      }
    } else if (before.length === 1) {
      controller.pan(point.x - previous.x, point.y - previous.y);
    }
  };
  // Ends pointer tracking and places comments only after an unmoved, unpinched primary click.
  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = gesture.current;
    if (!state.pointers.has(event.pointerId)) return;
    state.pointers.delete(event.pointerId);
    if (!state.pointers.size) {
      event.currentTarget.dataset.dragging = 'false';
      if (!state.moved && !state.pinched && tool === 'comment' && !spaceHeld && event.button === 0)
        onPlace(screenToWorld(localPoint(event), controller.view));
    }
  };
  // Cancels pointer tracking and prevents remaining touches from becoming comment clicks.
  const cancelPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = gesture.current;
    if (!state.pointers.delete(event.pointerId)) return;
    state.pinched = true;
    if (!state.pointers.size) event.currentTarget.dataset.dragging = 'false';
  };

  return {
    onPointerDown: pointerDown,
    onPointerMove: pointerMove,
    onPointerUp: pointerUp,
    onPointerCancel: cancelPointer,
    onLostPointerCapture: cancelPointer,
  };
}
