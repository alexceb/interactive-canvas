import { describe, expect, it } from "vitest";
import { clampZoom, fitBounds, screenToWorld, worldToScreen, zoomAt } from "./coordinates";
import { CONTENT_BOUNDS } from "./coordinates.constants";

describe("canvas coordinates", () => {
  it.each([0.2, 0.75, 1, 3])("round-trips negative world coordinates at zoom %s", (zoom) => {
    const view = { x: 213, y: -97, zoom };
    const point = { x: -394.25, y: 281.5 };
    const result = screenToWorld(worldToScreen(point, view), view);

    expect(result.x).toBeCloseTo(point.x);
    expect(result.y).toBeCloseTo(point.y);
  });

  it.each([0.01, 0.4, 2, 20])("keeps the point under the pointer fixed when zooming to %s", (zoom) => {
    const view = { x: -50, y: 90, zoom: 0.8 };
    const pointer = { x: 467, y: 223 };
    const anchor = screenToWorld(pointer, view);
    const next = zoomAt(view, pointer, zoom);

    expect(worldToScreen(anchor, next).x).toBeCloseTo(pointer.x);
    expect(worldToScreen(anchor, next).y).toBeCloseTo(pointer.y);
    expect(next.zoom).toBe(clampZoom(zoom));
  });

  it.each([
    { width: 1100, height: 850 },
    { width: 390, height: 700 },
  ])("fits the board inside $width × $height", (size) => {
    const view = fitBounds(size);
    const topLeft = worldToScreen(CONTENT_BOUNDS, view);
    const bottomRight = worldToScreen(
      { x: CONTENT_BOUNDS.x + CONTENT_BOUNDS.width, y: CONTENT_BOUNDS.y + CONTENT_BOUNDS.height },
      view,
    );

    expect(topLeft.x).toBeGreaterThanOrEqual(0);
    expect(topLeft.y).toBeGreaterThanOrEqual(0);
    expect(bottomRight.x).toBeLessThanOrEqual(size.width);
    expect(bottomRight.y).toBeLessThanOrEqual(size.height);
  });
});
