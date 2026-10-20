import { AlertTriangle, Check, ChevronRight, MessageSquare } from 'lucide-react';
import { Avatar } from '../../comments/avatar/avatar';
import { WorkspaceMenu } from '../../components/workspace-menu/workspace-menu';
import type { WorkspaceHeaderProps } from './workspace-header.types';

/** Displays workspace identity, local-save status, participants, and workspace actions. */
export function WorkspaceHeader({
  panelOpen,
  openCount,
  error,
  saved,
  commentsToggle,
  onFit,
  onToggle,
  onReset,
}: WorkspaceHeaderProps) {
  return (
    <header className="app-header">
      <button type="button" className="brand" aria-label="Formspace home" onClick={onFit}>
        <span className="brand-mark">
          <span />
          <span />
          <span />
        </span>
        <span>formspace</span>
        <span className="brand-dot">®</span>
      </button>
      <span className="header-divider" />
      <div className="breadcrumbs">
        <span>Workspace</span>
        <ChevronRight size={13} />
        <strong>Form explorations</strong>
      </div>
      <span className="review-badge">
        <span /> In review
      </span>
      <div className="header-actions">
        <span
          className={`save-status${error ? ' save-error' : ''}`}
          title={error || 'Saved in this browser only'}
        >
          {error ? <AlertTriangle size={13} /> : <Check size={13} />}
          {error ? 'Not saved' : saved ? 'Saved locally' : 'Saving…'}
        </span>
        <section className="collaborators" aria-label="Demo participants">
          <Avatar authorId="maya" small />
          <Avatar authorId="sam" small />
          <Avatar authorId="alex" small />
        </section>
        <button
          type="button"
          className={`comments-toggle${panelOpen ? ' active' : ''}`}
          ref={commentsToggle}
          aria-label={panelOpen ? 'Hide comments' : 'Show comments'}
          aria-expanded={panelOpen}
          onClick={onToggle}
        >
          <MessageSquare size={16} />
          <span>Comments</span>
          <span className="header-comment-count">{openCount}</span>
        </button>
        <WorkspaceMenu onReset={onReset} />
      </div>
    </header>
  );
}
