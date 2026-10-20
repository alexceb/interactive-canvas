import type { HelpShortcut } from './help-dialog.types';
export const HELP_SHORTCUTS = [
  { label: 'Pan the canvas', content: 'Drag / scroll' },
  { label: 'Zoom at pointer', content: 'Ctrl / ⌘ + scroll' },
  { label: 'Touch navigation', content: 'Drag / pinch' },
  {
    label: 'Comment tool',
    content: (
      <>
        <kbd>C</kbd>
      </>
    ),
  },
  {
    label: 'Temporary pan',
    content: (
      <>
        <kbd>Space</kbd> + drag
      </>
    ),
  },
  {
    label: 'Fit content',
    content: (
      <>
        <kbd>0</kbd>
      </>
    ),
  },
  {
    label: 'Close / cancel',
    content: (
      <>
        <kbd>Esc</kbd>
      </>
    ),
  },
  { label: 'Send comment', content: 'Ctrl / ⌘ + Enter' },
  { label: 'Pan with canvas focused', content: 'Arrow keys' },
  {
    label: 'Zoom with canvas focused',
    content: (
      <>
        <kbd>+</kbd> / <kbd>−</kbd>
      </>
    ),
  },
] satisfies HelpShortcut[];
