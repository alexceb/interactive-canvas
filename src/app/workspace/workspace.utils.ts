export function focusCanvas() {
  document.querySelector<HTMLElement>('[data-testid="canvas"]')?.focus({ preventScroll: true });
}
