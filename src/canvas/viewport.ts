import { clampZoom, fitBounds, zoomAt } from './coordinates';
import type { Point, Viewport } from './coordinates.types';

// Updates board transforms outside React and exposes zoom to subscribing controls.
export class ViewportController {
  view: Viewport = { x: 0, y: 0, zoom: 1 };
  private host: HTMLElement | null = null;
  private world: HTMLElement | null = null;
  private frame = 0;
  private listeners = new Set<() => void>();
  private size = { width: 0, height: 0 };

  // Connects the canvas elements and paints the current viewport.
  attach(host: HTMLElement, world: HTMLElement) {
    this.host = host;
    this.world = world;
    this.paint();
  }
  // Cancels pending painting and releases references to the canvas elements.
  detach() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.host = this.world = null;
  }
  // Fits content on first measurement, then preserves the board center during resizing.
  resize(width: number, height: number) {
    if (!width || !height) return;
    if (!this.size.width) this.view = fitBounds({ width, height });
    else
      this.view = {
        ...this.view,
        x: this.view.x + (width - this.size.width) / 2,
        y: this.view.y + (height - this.size.height) / 2,
      };
    this.size = { width, height };
    this.schedule();
  }
  // Replaces viewport state and schedules a paint.
  set(view: Viewport) {
    this.view = view;
    this.schedule();
  }
  // Moves the board by a delta measured in canvas pixels.
  pan(x: number, y: number) {
    this.set({ ...this.view, x: this.view.x + x, y: this.view.y + y });
  }
  // Zooms around a screen point, defaulting to the center of the usable canvas.
  zoom(zoom: number, at = { x: this.size.width / 2, y: this.size.height / 2 }) {
    this.set(zoomAt(this.view, at, zoom));
  }
  // Fits the fixed board content into the measured canvas.
  fit() {
    this.set(fitBounds(this.size));
  }
  // Centers a world-space anchor in the canvas while preserving the current zoom.
  focus(point: Point) {
    this.set({
      x: this.size.width / 2 - point.x * this.view.zoom,
      y: this.size.height / 2 - point.y * this.view.zoom,
      zoom: this.view.zoom,
    });
  }
  // Registers a viewport listener and returns its unsubscribe function.
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // Returns the primitive zoom snapshot used by React subscriptions.
  getZoom = () => this.view.zoom;

  // Coalesces multiple viewport updates into one paint per animation frame.
  private schedule() {
    if (!this.frame)
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.paint();
      });
  }
  // Applies board and grid transforms, then notifies viewport subscribers.
  private paint() {
    const { x, y, zoom } = this.view;
    if (this.world) this.world.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    if (this.host) {
      // Cancel board scaling for pin visuals while their anchors stay in world coordinates.
      this.host.style.setProperty('--inverse-zoom', String(1 / zoom));
      this.host.style.backgroundPosition = `${x}px ${y}px`;
      this.host.style.backgroundSize = `${24 * clampZoom(zoom)}px ${24 * clampZoom(zoom)}px`;
      this.host.dataset.zoom = String(zoom);
    }
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
