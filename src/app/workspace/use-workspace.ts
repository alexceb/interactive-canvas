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
  const back = useCallback(() => {
    setSelectedId(null);
    setDraft(null);
  }, []);
  const handleEscape = useCallback(() => {
    if (draft || selectedId) {
      back();
      setTool('pan');
    } else {
      setPanelOpen(false);
      setTool('pan');
    }
  }, [draft, selectedId, back]);
  const startComment = useCallback(() => {
    back();
    setTool('comment');
    if (mobile && panelOpen) {
      // Wait until the modal releases its focus trap before focusing the board.
      closeFocus.current = 'canvas';
      setPanelOpen(false);
    } else focusCanvas();
  }, [mobile, panelOpen, back]);

  const select = useCallback((id: string) => {
    setDraft(null);
    setSelectedId(id);
    setPanelOpen(true);
    setTool('pan');
  }, []);
  const selectFromList = (id: string) => {
    select(id);
    controller.focus(threads[id].anchor);
  };
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
  const navigate = () => {
    setTool('pan');
    setDraft(null);
  };
  const resetWorkspace = () => {
    reset();
    back();
    controller.fit();
    setTool('pan');
  };
  const changeDraft = (text: string) =>
    setDraft((current) => (current ? { ...current, text } : null));
  const closeAutoFocus = () => {
    const destination = closeFocus.current;
    closeFocus.current = 'comments';
    if (destination === 'canvas') focusCanvas();
    else commentsToggle.current?.focus({ preventScroll: true });
  };
  const createThread = (text: string) => {
    if (!draft) return;
    const id = addThread(draft.anchor, text);
    setDraft(null);
    setSelectedId(id);
    setTool('pan');
  };
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
