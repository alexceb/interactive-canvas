import { clampZoom, fitBounds, zoomAt } from './coordinates';
import type { Point, Viewport } from './coordinates.types';

/** High-frequency viewport state stays outside React. Only zoom controls subscribe. */
export class ViewportController {
  view: Viewport = { x: 0, y: 0, zoom: 1 };
  private host: HTMLElement | null = null;
  private world: HTMLElement | null = null;
  private frame = 0;
  private listeners = new Set<() => void>();
  private size = { width: 0, height: 0 };

  attach(host: HTMLElement, world: HTMLElement) {
    this.host = host;
    this.world = world;
    this.paint();
  }
  detach() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.host = this.world = null;
  }
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
  set(view: Viewport) {
    this.view = view;
    this.schedule();
  }
  pan(x: number, y: number) {
    this.set({ ...this.view, x: this.view.x + x, y: this.view.y + y });
  }
  zoom(zoom: number, at = { x: this.size.width / 2, y: this.size.height / 2 }) {
    this.set(zoomAt(this.view, at, zoom));
  }
  fit() {
    this.set(fitBounds(this.size));
  }
  focus(point: Point) {
    // Preserve the user's scale; place the chosen pin in the usable viewport center.
    this.set({
      x: this.size.width / 2 - point.x * this.view.zoom,
      y: this.size.height / 2 - point.y * this.view.zoom,
      zoom: this.view.zoom,
    });
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getZoom = () => this.view.zoom;
  private schedule() {
    if (!this.frame)
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.paint();
      });
  }
  private paint() {
    const { x, y, zoom } = this.view;
    if (this.world) this.world.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    if (this.host) {
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
