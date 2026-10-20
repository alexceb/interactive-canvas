import { useCallback, useRef, useState } from 'react';
import type { Tool } from '../../canvas/canvas/canvas.types';
import type { Point } from '../../canvas/coordinates.types';
import { ViewportController } from '../../canvas/viewport';
import type { CommentDraft } from '../../comments/comments.types';
import {
  useCommentActions,
  useComments,
  usePersistence,
} from '../../comments/comments-provider/use-comments';
import { getThreadCounts } from '../../comments/thread.utils';
import { useMobile } from './use-mobile';
import { useWorkspaceShortcuts } from './use-workspace-shortcuts';
import { MOBILE_QUERY } from './workspace.constants';
import { focusCanvas } from './workspace.utils';

// Manages workspace tools, sidebar state, comment drafts, and focus transitions.
export function useWorkspace() {
  const mobile = useMobile();

  const [controller] = useState(() => new ViewportController());
  const [tool, setTool] = useState<Tool>('pan');
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [panelOpen, setPanelOpen] = useState(() => !window.matchMedia(MOBILE_QUERY).matches);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CommentDraft | null>(null);

  const commentsToggle = useRef<HTMLButtonElement>(null);
  const closeFocus = useRef<'canvas' | 'comments'>('comments');
  const { threads } = useComments();
  const { addThread, reset } = useCommentActions();
  const { error, saved } = usePersistence();

  // Returns to the thread list and discards any unsent draft.
  const back = useCallback(() => {
    setSelectedId(null);
    setDraft(null);
  }, []);

  // Backs out of a draft or thread before closing the list and restoring pan mode.
  const handleEscape = useCallback(() => {
    if (draft || selectedId) {
      back();
      setTool('pan');
    } else {
      setPanelOpen(false);
      setTool('pan');
    }
  }, [draft, selectedId, back]);

  // Starts comment placement and transfers keyboard focus to the board.
  const startComment = useCallback(() => {
    back();
    setTool('comment');
    if (mobile && panelOpen) {
      // Let the mobile modal release its focus trap before focusing the board.
      closeFocus.current = 'canvas';
      setPanelOpen(false);
    } else focusCanvas();
  }, [mobile, panelOpen, back]);

  // Opens an existing thread and leaves comment-placement mode.
  const select = useCallback((id: string) => {
    setDraft(null);
    setSelectedId(id);
    setPanelOpen(true);
    setTool('pan');
  }, []);

  // Opens a thread and centers its board anchor without changing zoom.
  const selectFromList = (id: string) => {
    select(id);
    controller.focus(threads[id].anchor);
  };

  // Starts an unsaved draft at the supplied world-space anchor.
  const place = useCallback((point: Point) => {
    setSelectedId(null);
    setDraft({ anchor: point, text: '' });
    setPanelOpen(true);
  }, []);

  const openCount = getThreadCounts(Object.values(threads)).open;

  useWorkspaceShortcuts({
    startComment,
    handleEscape,
    tool,
    controller,
    onPlace: place,
    onSpaceHeldChange: setSpaceHeld,
  });

  // Returns to pan mode and cancels the pending draft.
  const navigate = () => {
    setTool('pan');
    setDraft(null);
  };

  // Restores demo comments, clears the active review, and fits the board.
  const resetWorkspace = () => {
    reset();
    back();
    controller.fit();
    setTool('pan');
  };

  // Updates the current draft text while preserving its anchor.
  const changeDraft = (text: string) =>
    setDraft((current) => (current ? { ...current, text } : null));

  // Restores focus after sidebar dismissal and consumes any temporary canvas destination.
  const closeAutoFocus = () => {
    const destination = closeFocus.current;
    closeFocus.current = 'comments';
    if (destination === 'canvas') focusCanvas();
    else commentsToggle.current?.focus({ preventScroll: true });
  };

  // Adds the submitted draft to the comment store and opens the resulting conversation.
  const createThread = (text: string) => {
    if (!draft) return;
    const id = addThread(draft.anchor, text);
    setDraft(null);
    setSelectedId(id);
    setTool('pan');
  };

  // Shows or hides comments while preserving the current draft or thread selection.
  const togglePanel = () => setPanelOpen((value) => !value);

  return {
    mobile,
    controller,
    tool,
    spaceHeld,
    panelOpen,
    selectedId,
    draft,
    commentsToggle,
    error,
    saved,
    openCount,
    back,
    handleEscape,
    startComment,
    select,
    selectFromList,
    place,
    setPanelOpen,
    navigate,
    resetWorkspace,
    changeDraft,
    closeAutoFocus,
    createThread,
    togglePanel,
  };
}
