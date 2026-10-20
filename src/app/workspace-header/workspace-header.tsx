import { AlertTriangle, Check, ChevronRight, MessageSquare } from 'lucide-react';
import { Avatar } from '../../comments/avatar/avatar';
import { WorkspaceMenu } from '../../components/workspace-menu/workspace-menu';
import styles from './workspace-header.module.css';
import type { WorkspaceHeaderProps } from './workspace-header.types';

// Displays workspace identity, local-save status, participants, and workspace actions.
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
    <header className={styles.appHeader}>
      <button type="button" className={styles.brand} aria-label="Formspace home" onClick={onFit}>
        <span className={styles.brandMark}>
          <span />
          <span />
          <span />
        </span>
        <span>Formspace</span>
        <span className={styles.brandDot}>®</span>
      </button>
      <span className={styles.headerDivider} />
      <div className={styles.breadcrumbs}>
        <span>Workspace</span>
        <ChevronRight size={13} />
        <strong>Form explorations</strong>
      </div>
      <span className={styles.reviewBadge}>
        <span /> In review
      </span>
      <div className={styles.headerActions}>
        <span
          className={`${styles.saveStatus} ${error ? styles.saveError : ''}`}
          title={error || 'Saved in this browser only'}
        >
          {error ? <AlertTriangle size={13} /> : <Check size={13} />}
          {error ? 'Not saved' : saved ? 'Saved locally' : 'Saving…'}
        </span>
        <section className={styles.collaborators} aria-label="Demo participants">
          <Avatar authorId="maya" small className={styles.avatar} />
          <Avatar authorId="sam" small className={styles.avatar} />
          <Avatar authorId="alex" small className={styles.avatar} />
        </section>
        <button
          type="button"
          className={`${styles.commentsToggle} ${panelOpen ? styles.active : ''}`}
          ref={commentsToggle}
          aria-label={panelOpen ? 'Hide comments' : 'Show comments'}
          aria-expanded={panelOpen}
          onClick={onToggle}
        >
          <MessageSquare size={16} />
          <span>Comments</span>
          <span className={styles.headerCommentCount}>{openCount}</span>
        </button>
        <WorkspaceMenu onReset={onReset} />
      </div>
    </header>
  );
}
