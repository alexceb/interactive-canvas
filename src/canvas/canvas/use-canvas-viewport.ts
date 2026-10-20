import { useEffect, useRef } from 'react';
import type { ViewportController } from '../viewport';

export function useCanvasViewport(controller: ViewportController) {
  const host = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    const worldElement = world.current;
    if (!element || !worldElement) return;
    controller.attach(element, worldElement);
    const observer = new ResizeObserver(() =>
      controller.resize(element.clientWidth, element.clientHeight),
    );
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1;
      if (event.ctrlKey || event.metaKey)
        controller.zoom(controller.view.zoom * Math.exp(-event.deltaY * unit * 0.008), {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      else
        controller.pan(
          -(event.shiftKey ? event.deltaY : event.deltaX) * unit,
          -(event.shiftKey ? event.deltaX : event.deltaY) * unit,
        );
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', wheel);
      controller.detach();
    };
  }, [controller]);
  return { host, world };
}
