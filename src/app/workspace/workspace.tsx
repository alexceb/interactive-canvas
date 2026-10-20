import { AlertTriangle } from 'lucide-react';
import { Canvas } from '../../canvas/canvas/canvas';
import { CommentPins } from '../../comments/comment-pins/comment-pins';
import { Sidebar } from '../../comments/sidebar/sidebar';
import { CanvasTools } from '../canvas-tools/canvas-tools';
import { WorkspaceHeader } from '../workspace-header/workspace-header';
import { useWorkspace } from './use-workspace';

/** Connects workspace navigation, anchored comments, and responsive review panels. */
export function Workspace() {
  const workspace = useWorkspace();
  const { controller, mobile, tool, spaceHeld, panelOpen, selectedId, draft, error } = workspace;
  return (
    <div className="app-shell">
      <WorkspaceHeader
        panelOpen={panelOpen}
        openCount={workspace.openCount}
        error={error}
        saved={workspace.saved}
        commentsToggle={workspace.commentsToggle}
        onFit={() => controller.fit()}
        onToggle={workspace.togglePanel}
        onReset={workspace.resetWorkspace}
      />
      {error && (
        <div className="storage-warning" role="alert">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}
      <div className="workspace" data-panel={panelOpen}>
        <Canvas controller={controller} tool={tool} spaceHeld={spaceHeld} onPlace={workspace.place}>
          <CommentPins
            selectedId={selectedId}
            draft={draft?.anchor ?? null}
            onSelect={workspace.select}
          />
        </Canvas>
        <CanvasTools
          tool={tool}
          spaceHeld={spaceHeld}
          onNavigate={workspace.navigate}
          onComment={workspace.startComment}
        />
        <Sidebar
          open={panelOpen}
          mobile={mobile}
          selectedId={selectedId}
          draft={draft}
          onOpenChange={workspace.setPanelOpen}
          onDraftChange={workspace.changeDraft}
          onCloseAutoFocus={workspace.closeAutoFocus}
          onSelect={workspace.selectFromList}
          onBack={workspace.back}
          onAdd={workspace.startComment}
          onEscape={workspace.handleEscape}
          onCreate={workspace.createThread}
        />
      </div>
      <div className="screen-reader-announcement sr-only" aria-live="polite">
        {tool === 'comment'
          ? 'Comment tool active. Click the canvas, or press Enter on the focused canvas to comment at its center.'
          : ''}
      </div>
    </div>
  );
}
