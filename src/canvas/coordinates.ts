import { CONTENT_BOUNDS, MAX_ZOOM, MIN_ZOOM } from './coordinates.constants';
import type { Point, Viewport } from './coordinates.types';
export const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

// Points here are relative to the canvas element, never the browser window.
export function screenToWorld(point: Point, view: Viewport): Point {
  return { x: (point.x - view.x) / view.zoom, y: (point.y - view.y) / view.zoom };
}
export function worldToScreen(point: Point, view: Viewport): Point {
  return { x: point.x * view.zoom + view.x, y: point.y * view.zoom + view.y };
}
export function zoomAt(view: Viewport, point: Point, zoom: number): Viewport {
  const anchor = screenToWorld(point, view);
  const nextZoom = clampZoom(zoom);
  return { x: point.x - anchor.x * nextZoom, y: point.y - anchor.y * nextZoom, zoom: nextZoom };
}
export function fitBounds(
  size: { width: number; height: number },
  bounds = CONTENT_BOUNDS,
): Viewport {
  const padding = size.width < 600 ? 32 : 100;
  const zoom = clampZoom(
    Math.min((size.width - padding * 2) / bounds.width, (size.height - 96) / bounds.height, 1),
  );
  return {
    x: (size.width - bounds.width * zoom) / 2 - bounds.x * zoom,
    y: (size.height - bounds.height * zoom) / 2 - bounds.y * zoom,
    zoom,
  };
}
