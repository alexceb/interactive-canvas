import { AlertTriangle } from 'lucide-react';
import { Canvas } from '../../canvas/canvas/canvas';
import { CommentPins } from '../../comments/comment-pins/comment-pins';
import { Sidebar } from '../../comments/sidebar/sidebar';
import shared from '../../shared.module.css';
import { CanvasTools } from '../canvas-tools/canvas-tools';
import { WorkspaceHeader } from '../workspace-header/workspace-header';
import { useWorkspace } from './use-workspace';
import styles from './workspace.module.css';

// Connects workspace navigation, anchored comments, and responsive review panels.
export function Workspace() {
  const {
    controller,
    mobile,
    tool,
    spaceHeld,
    panelOpen,
    selectedId,
    draft,
    error,
    openCount,
    saved,
    commentsToggle,
    togglePanel,
    resetWorkspace,
    place,
    navigate,
    startComment,
    setPanelOpen,
    changeDraft,
    closeAutoFocus,
    selectFromList,
    select,
    back,
    handleEscape,
    createThread,
  } = useWorkspace();
  return (
    <div className={styles.appShell}>
      <WorkspaceHeader
        panelOpen={panelOpen}
        openCount={openCount}
        error={error}
        saved={saved}
        commentsToggle={commentsToggle}
        onFit={() => controller.fit()}
        onToggle={togglePanel}
        onReset={resetWorkspace}
      />
      {error && (
        <div className={styles.storageWarning} role="alert">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}
      <div className={styles.workspace} data-panel={panelOpen}>
        <Canvas controller={controller} tool={tool} spaceHeld={spaceHeld} onPlace={place}>
          <CommentPins selectedId={selectedId} draft={draft?.anchor ?? null} onSelect={select} />
        </Canvas>
        <CanvasTools
          tool={tool}
          spaceHeld={spaceHeld}
          onNavigate={navigate}
          onComment={startComment}
        />
        <Sidebar
          open={panelOpen}
          mobile={mobile}
          selectedId={selectedId}
          draft={draft}
          onOpenChange={setPanelOpen}
          onDraftChange={changeDraft}
          onCloseAutoFocus={closeAutoFocus}
          onSelect={selectFromList}
          onBack={back}
          onAdd={startComment}
          onEscape={handleEscape}
          onCreate={createThread}
        />
      </div>
      <div className={shared.srOnly} aria-live="polite">
        {tool === 'comment'
          ? 'Comment tool active. Click the canvas, or press Enter on the focused canvas to comment at its center.'
          : ''}
      </div>
    </div>
  );
}
