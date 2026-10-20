import type { CommentDraft } from '../comments.types';
export interface CommentDraftPanelProps {
  draft: CommentDraft;
  onChange: (text: string) => void;
  onCreate: (text: string) => void;
  onCancel: () => void;
}
