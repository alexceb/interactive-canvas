import type { CommentDraft } from '../comments.types';
export interface SidebarProps {
  open: boolean;
  mobile: boolean;
  selectedId: string | null;
  draft: CommentDraft | null;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (text: string) => void;
  onCloseAutoFocus: () => void;
  onSelect: (id: string) => void;
  onBack: () => void;
  onCreate: (text: string) => void;
  onAdd: () => void;
  onEscape: () => void;
}
