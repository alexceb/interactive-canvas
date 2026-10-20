import type { KeyboardEvent, PointerEvent } from 'react';
import type { Point } from '../coordinates.types';
import type { ViewportController } from '../viewport';
import { KEYBOARD_PAN, ZOOM_STEP } from './canvas.constants';

export const isControl = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('button, input, textarea, a, [role="dialog"]');

export function localPoint(event: PointerEvent): Point {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
export function getPointerCenter(points: Point[]): Point {
  return { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
}
export function getPointerDistance(points: Point[]): number {
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}
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
