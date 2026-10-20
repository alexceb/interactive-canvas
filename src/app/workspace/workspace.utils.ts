// Gives the board keyboard focus without scrolling the surrounding page.
export function focusCanvas() {
  document.querySelector<HTMLElement>('[data-testid="canvas"]')?.focus({ preventScroll: true });
}
