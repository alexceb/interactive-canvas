import type { RefObject } from 'react';
export interface WorkspaceHeaderProps {
  panelOpen: boolean;
  openCount: number;
  error: string | null;
  saved: boolean;
  commentsToggle: RefObject<HTMLButtonElement | null>;
  onFit: () => void;
  onToggle: () => void;
  onReset: () => void;
}
