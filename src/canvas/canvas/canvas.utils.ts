import type { KeyboardEvent, PointerEvent } from 'react';
import type { Point } from '../coordinates.types';
import type { ViewportController } from '../viewport';
import { KEYBOARD_PAN, ZOOM_STEP } from './canvas.constants';

// Identifies controls whose pointer input should not start a board gesture.
export const isControl = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('button, input, textarea, a, [role="dialog"]');

// Converts a pointer position from window coordinates to canvas-local pixels.
export function localPoint(event: PointerEvent): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Returns the midpoint of two pointers for pinch panning and zoom anchoring.
export function getPointerCenter(points: Point[]): Point {
  return { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
}

// Returns the distance between two pointers for calculating pinch scale.
export function getPointerDistance(points: Point[]): number {
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

// Handles pan, zoom, and fit keys when the board itself has keyboard focus.
export function handleCanvasKeyDown(event: KeyboardEvent, controller: ViewportController) {
  if (
    event.target !== event.currentTarget ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.nativeEvent.isComposing
  )
    return;
  if (KEYBOARD_PAN[event.key]) {
    event.preventDefault();
    controller.pan(...KEYBOARD_PAN[event.key]);
  }
  if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    controller.zoom(controller.view.zoom * ZOOM_STEP);
  }
  if (event.key === '-') {
    event.preventDefault();
    controller.zoom(controller.view.zoom / ZOOM_STEP);
  }

  if (event.key === '0') controller.fit();
}
